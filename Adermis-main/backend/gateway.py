"""
Adermis API Gateway
───────────────────
Central routing server that registers all microservice blueprints.
Handles CORS, global error handling, and the orchestrator endpoint.
"""
import json
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import SECRET_KEY, FRONTEND_ORIGIN, PORT, DEBUG, MONGODB_URI, MAPS_API_KEY

# ─── Create Flask app ───
app = Flask(__name__)
app.secret_key = SECRET_KEY

# ─── CORS ───
CORS(app, resources={r"/*": {"origins": [FRONTEND_ORIGIN, "http://localhost:3000", "http://localhost:3001", "http://localhost:3002"]}},
     supports_credentials=True)

# ─── Register microservice blueprints ───
from services.auth.routes import auth_bp
from services.ml.routes import ml_bp
from services.llm.routes import llm_bp
from services.clinic.routes import clinic_bp

app.register_blueprint(auth_bp)
app.register_blueprint(ml_bp)
app.register_blueprint(llm_bp)
app.register_blueprint(clinic_bp)

# ─── Scan persistence (MongoDB) ───
from pymongo import MongoClient
import datetime

_client = MongoClient(MONGODB_URI)
_db = _client.get_default_database() if "/" in MONGODB_URI.split("://")[-1] else _client["adermis"]
scans_col = _db["scans"]


# ─── Health check ───
@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "name": "Adermis API Gateway",
        "version": "1.0.0",
        "status": "running",
        "services": ["auth", "ml", "llm", "clinic"],
        "endpoints": {
            "health": "/health",
            "analyze": "POST /api/analyze",
            "find_clinics": "POST /api/find_clinics",
            "auth_login": "POST /auth/login",
            "auth_register": "POST /auth/register",
        },
        "frontend": FRONTEND_ORIGIN,
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "services": ["auth", "ml", "llm", "clinic"]})


# ─── Orchestrator: combined analysis endpoint ───
@app.route("/api/analyze", methods=["POST"])
def analyze():
    """
    Orchestrates the full analysis flow:
    1. ML prediction from image
    2. LLM enrichment from text
    3. Merge predictions
    4. Generate follow-up questions
    """
    from services.ml.model import get_model
    from services.ml.preprocessing import preprocess_image
    from services.llm.gemini import generate_json, generate_text
    from config import CLASS_NAMES
    import torch

    text_description = request.form.get("description", "")
    concerns = request.form.get("concerns", "")
    image_file = request.files.get("image")

    final_predictions = []

    # 1. ML prediction from image
    if image_file:
        try:
            model = get_model()
            img_tensor = preprocess_image(image_file)
            with torch.no_grad():
                outputs = model(img_tensor)
                probabilities = torch.nn.functional.softmax(outputs, dim=1)[0]
            
            top3_values, top3_indices = torch.topk(probabilities, 3)
            for score, idx in zip(top3_values, top3_indices):
                idx_int = idx.item()
                disease = CLASS_NAMES[idx_int] if 0 <= idx_int < len(CLASS_NAMES) else "Unknown"
                final_predictions.append({
                    "disease": disease,
                    "score": round(score.item(), 4),
                    "source": "image"
                })
        except Exception as e:
            print(f"ML prediction error: {e}")

    # 2. LLM enrichment from text
    if text_description:
        full_description = text_description
        if concerns:
            full_description += f"\nAdditional concerns: {concerns}"
        
        prompt = f"""You are an expert dermatologist. Predict the top 5 possible skin diseases based on this description:
'{full_description}'
Return ONLY valid JSON — an array of objects, no markdown:
[
    {{"disease": "Disease Name", "score": 0.8}},
    {{"disease": "Another Disease", "score": 0.6}}
]
"""
        try:
            text_predictions = generate_json(prompt)
            if isinstance(text_predictions, list):
                for p in text_predictions:
                    p["source"] = "text"
                final_predictions.extend(text_predictions)
        except Exception as e:
            print(f"LLM enrichment error: {e}")

    if not final_predictions:
        return jsonify({"error": "No predictions could be generated. Please provide an image or description."}), 400

    # 3. LLM enrichment — generate description, severity, recommendations
    top_disease = final_predictions[0].get("disease", "Unknown")
    top_score = final_predictions[0].get("score", 0)

    description = ""
    severity = "mild"
    recommendations = []

    enrichment_prompt = f"""You are an expert dermatologist. The AI model detected "{top_disease}" with {round(top_score * 100, 1)}% confidence.

Provide a JSON response with these exact keys:
{{
    "description": "A clear 2-3 sentence description of {top_disease}, what it is, common symptoms, and who it affects.",
    "severity": "mild OR moderate OR severe (choose one based on the condition)",
    "recommendations": [
        "First actionable recommendation",
        "Second recommendation",
        "Third recommendation",
        "Fourth recommendation"
    ]
}}

Return ONLY valid JSON, no markdown fences, no extra text."""

    try:
        enrichment = generate_json(enrichment_prompt)
        if isinstance(enrichment, dict):
            description = enrichment.get("description", "")
            sev = enrichment.get("severity", "mild").lower().strip()
            if sev in ("mild", "moderate", "severe"):
                severity = sev
            else:
                severity = "moderate"
            recs = enrichment.get("recommendations", [])
            if isinstance(recs, list):
                recommendations = [str(r) for r in recs if r]
    except Exception as e:
        print(f"LLM enrichment error: {e}")
        description = f"{top_disease} is a skin condition detected by our AI model. Please consult a dermatologist for a thorough evaluation."
        severity = "moderate"
        recommendations = [
            "Keep the affected area clean and moisturized",
            "Avoid scratching or irritating the area",
            "Monitor for any changes in size, color, or texture",
            "Schedule an appointment with a dermatologist for professional evaluation",
        ]

    # 4. Generate follow-up questions
    followup_prompt = f"""Given these possible skin diseases:
{json.dumps(final_predictions, indent=2)}

Generate 3-5 focused follow-up medical questions to refine the diagnosis.
Cover: duration, location, pain/itching, medical history, previous treatments.
Return ONLY plain text questions, one per line. No numbering, no markdown.
"""
    try:
        raw_questions = generate_text(followup_prompt)
        questions = [q.strip().lstrip("0123456789.-) ") for q in raw_questions.strip().split("\n") if q.strip()]
        questions = [q for q in questions if len(q) > 10][:5]
    except Exception:
        questions = [
            "How long have you had this skin condition?",
            "Is the affected area itchy, painful, or burning?",
            "Has the condition spread or changed in size?",
            "Have you tried any treatments or medications?",
            "Do you have any known skin allergies or conditions?",
        ]

    return jsonify({
        "predictions": final_predictions,
        "top_condition": top_disease,
        "description": description,
        "severity": severity,
        "recommendations": recommendations,
        "disclaimer": "This AI analysis is for informational purposes only and does not constitute medical advice. Please consult a qualified dermatologist for accurate diagnosis and treatment.",
        "followup_questions": questions,
    })


# ─── Final diagnosis endpoint ───
@app.route("/api/final-diagnosis", methods=["POST"])
def final_diagnosis():
    """Proxy to LLM final diagnosis with orchestration."""
    from services.llm.gemini import generate_text
    from services.llm.safety import apply_safety

    data = request.get_json(silent=True) or {}
    predictions = data.get("predictions", [])
    user_answers = data.get("user_answers", {})

    # Determine final disease
    diagnosis_prompt = f"""Based on these AI predictions:
{json.dumps(predictions, indent=2)}
And patient responses to follow-up questions:
{json.dumps(user_answers, indent=2)}
Determine the final skin disease. Return ONLY the disease name in plain text.
"""
    try:
        final_disease = generate_text(diagnosis_prompt).strip()
    except Exception:
        final_disease = predictions[0].get("disease", "Unknown") if predictions else "Unknown"

    # Risk level
    risk_prompt = f'For the skin condition "{final_disease}", return ONLY one word: low, moderate, or high'
    try:
        risk_level = generate_text(risk_prompt).strip().lower()
        if risk_level not in ("low", "moderate", "high"):
            risk_level = "moderate"
    except Exception:
        risk_level = "moderate"

    # Treatment plan
    treatment_prompt = f"""You are a medical assistant. Provide a structured treatment plan for:

**Disease:** {final_disease}

Use this exact format with 2-3 bullet points per section:

**Diagnosis:** [Short explanation]

**Symptoms:**
- [Symptom 1]
- [Symptom 2]
- [Symptom 3]

**Causes:**
- [Cause 1]
- [Cause 2]

**Treatments (Ordered):**
- Ayurvedic Solutions: [1-2 natural treatments]
- Home Remedies: [1-2 home methods]
- Non-Prescription Medications: [1-2 OTC products]
- Prescription Medications: [1-2 doctor-prescribed options]

**When to See a Doctor:**
- [Warning sign 1]
- [Warning sign 2]

**Prevention Tips:**
- [Tip 1]
- [Tip 2]
"""
    try:
        treatment = generate_text(treatment_prompt)
        treatment = apply_safety(treatment, is_treatment=True)
    except Exception:
        treatment = "Unable to generate treatment. Please consult a dermatologist."

    return jsonify({
        "final_disease": final_disease,
        "treatment": treatment,
        "risk_level": risk_level,
    })


# ─── Find clinics (backwards-compatible endpoint) ───
@app.route("/api/find_clinics", methods=["POST"])
def find_clinics_compat():
    """Backwards-compatible endpoint that proxies to clinic service."""
    from services.clinic.places import find_nearby_clinics
    import requests as req_lib

    data = request.get_json(silent=True) or {}
    user_location = data.get("location")
    # Accept both {range: km} and {radius: meters}
    range_km = data.get("range", None)
    radius_m = data.get("radius", None)
    if range_km is not None:
        range_km = int(range_km)
    elif radius_m is not None:
        range_km = max(1, int(radius_m) // 1000)
    else:
        range_km = 20

    # Accept both {location: {lat, lng}} and flat {lat, lng}
    if not user_location:
        flat_lat = data.get("lat")
        flat_lng = data.get("lng")
        if flat_lat is not None and flat_lng is not None:
            lat, lng = float(flat_lat), float(flat_lng)
        else:
            return jsonify({"error": "Location is required"}), 400
    elif isinstance(user_location, str):
        if not MAPS_API_KEY:
            return jsonify({"error": "Maps API not configured"}), 500
        geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={user_location}&key={MAPS_API_KEY}"
        try:
            geo_resp = req_lib.get(geocode_url, timeout=10)
            geo_data = geo_resp.json()
            if geo_data.get("status") != "OK":
                return jsonify({"error": "Unable to geocode location"}), 400
            loc = geo_data["results"][0]["geometry"]["location"]
            lat, lng = loc["lat"], loc["lng"]
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        lat = float(user_location.get("lat", 0))
        lng = float(user_location.get("lng", 0))

    clinics = find_nearby_clinics(lat, lng, range_km)
    return jsonify({"clinics": clinics})


# ─── Save scan result ───
@app.route("/api/scans", methods=["POST"])
def save_scan():
    """Save a completed scan result to MongoDB."""
    from services.auth.middleware import require_auth
    from flask import g

    # Manual auth check
    from services.auth.jwt_utils import verify_access_token
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    
    if not token:
        return jsonify({"error": "Authentication required"}), 401
    
    payload = verify_access_token(token)
    if not payload:
        return jsonify({"error": "Invalid token"}), 401

    data = request.get_json(silent=True) or {}
    scan_doc = {
        "userId": payload["sub"],
        "predictions": data.get("predictions", []),
        "finalDiagnosis": data.get("finalDiagnosis", ""),
        "treatmentPlan": data.get("treatmentPlan", ""),
        "riskLevel": data.get("riskLevel", "moderate"),
        "textDescription": data.get("textDescription", ""),
        "concerns": data.get("concerns", []),
        "followUpQA": data.get("followUpQA", []),
        "createdAt": datetime.datetime.utcnow(),
    }
    result = scans_col.insert_one(scan_doc)
    scan_doc["_id"] = str(result.inserted_id)
    scan_doc["createdAt"] = scan_doc["createdAt"].isoformat()

    return jsonify({"success": True, "scan": scan_doc}), 201


# ─── Get user's scans ───
@app.route("/api/scans", methods=["GET"])
def get_scans():
    """Get scan history for authenticated user."""
    from services.auth.jwt_utils import verify_access_token

    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]

    if not token:
        return jsonify({"error": "Authentication required"}), 401

    payload = verify_access_token(token)
    if not payload:
        return jsonify({"error": "Invalid token"}), 401

    user_id = payload["sub"]
    limit = request.args.get("limit", 50, type=int)
    skip = request.args.get("skip", 0, type=int)

    scans = list(
        scans_col.find({"userId": user_id})
        .sort("createdAt", -1)
        .skip(skip)
        .limit(limit)
    )
    total = scans_col.count_documents({"userId": user_id})

    for s in scans:
        s["_id"] = str(s["_id"])
        if "createdAt" in s and hasattr(s["createdAt"], "isoformat"):
            s["createdAt"] = s["createdAt"].isoformat()

    return jsonify({"scans": scans, "total": total})


# ─── Get user stats ───
@app.route("/api/stats", methods=["GET"])
def get_stats():
    """Get scan statistics for authenticated user."""
    from services.auth.jwt_utils import verify_access_token

    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]

    if not token:
        return jsonify({"error": "Authentication required"}), 401

    payload = verify_access_token(token)
    if not payload:
        return jsonify({"error": "Invalid token"}), 401

    user_id = payload["sub"]
    total_scans = scans_col.count_documents({"userId": user_id})
    
    # Get latest scan
    latest = scans_col.find_one({"userId": user_id}, sort=[("createdAt", -1)])
    latest_disease = latest.get("finalDiagnosis", "None") if latest else "None"
    latest_risk = latest.get("riskLevel", "none") if latest else "none"

    # Unique conditions detected
    pipeline = [
        {"$match": {"userId": user_id, "finalDiagnosis": {"$ne": ""}}},
        {"$group": {"_id": "$finalDiagnosis"}},
    ]
    conditions = list(scans_col.aggregate(pipeline))

    return jsonify({
        "totalScans": total_scans,
        "latestCondition": latest_disease,
        "latestRisk": latest_risk,
        "uniqueConditions": len(conditions),
    })


# ─── Global error handler ───
@app.errorhandler(Exception)
def handle_error(e):
    traceback.print_exc()
    return jsonify({"error": "Internal server error", "message": str(e)}), 500


@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404


# ─── Main ───
if __name__ == "__main__":
    print(f"🚀 Adermis API Gateway starting on port {PORT}")
    print(f"   Services: auth, ml, llm, clinic")
    print(f"   CORS origin: {FRONTEND_ORIGIN}")
    app.run(host="0.0.0.0", port=PORT, debug=DEBUG)
