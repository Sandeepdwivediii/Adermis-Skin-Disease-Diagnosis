"""LLM service routes — text enrichment, follow-up, treatment, final diagnosis."""
import json
from flask import Blueprint, request, jsonify
from services.llm.gemini import generate_text, generate_json
from services.llm.safety import apply_safety

llm_bp = Blueprint("llm", __name__, url_prefix="/llm")


@llm_bp.route("/enrich", methods=["POST"])
def enrich():
    """
    Text description → top 5 disease predictions.

    Input:  {"description": str}
    Output: {"predictions": [{"disease": str, "score": float}, ...]}
    """
    data = request.get_json(silent=True) or {}
    description = data.get("description", "").strip()
    if not description:
        return jsonify({"error": "Description is required"}), 400

    prompt = f"""You are an expert dermatologist. Based on this patient description, 
predict the top 5 most likely skin diseases.

Patient description: "{description}"

Respond ONLY with valid JSON — an array of objects, no markdown:
[
  {{"disease": "Disease Name", "score": 0.8}},
  {{"disease": "Another Disease", "score": 0.6}}
]

Rules:
- Scores should reflect confidence (0.0 to 1.0)
- Include only dermatological conditions
- Order by likelihood (highest first)
"""
    try:
        predictions = generate_json(prompt)
        if not isinstance(predictions, list):
            predictions = []
        return jsonify({"predictions": predictions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@llm_bp.route("/followup", methods=["POST"])
def followup():
    """
    Predictions → 3-5 follow-up questions.

    Input:  {"predictions": [...]}
    Output: {"questions": [str, ...]}
    """
    data = request.get_json(silent=True) or {}
    predictions = data.get("predictions", [])

    prompt = f"""Given these possible skin disease predictions:
{json.dumps(predictions, indent=2)}

Generate 3-5 focused follow-up medical questions to help refine the diagnosis.
Questions should cover:
- Duration and progression of symptoms
- Location and spread pattern
- Associated symptoms (pain, itching, etc.)
- Medical history and triggers
- Previous treatments tried

Return ONLY plain text questions, one per line, numbered 1-5.
No JSON, no markdown formatting.
"""
    try:
        raw = generate_text(prompt)
        questions = [q.strip() for q in raw.strip().split("\n") if q.strip()]
        # Remove numbering prefixes like "1." or "1)"
        cleaned = []
        for q in questions:
            for prefix in ["1.", "2.", "3.", "4.", "5.", "1)", "2)", "3)", "4)", "5)"]:
                if q.startswith(prefix):
                    q = q[len(prefix):].strip()
                    break
            if q:
                cleaned.append(q)
        return jsonify({"questions": cleaned[:5]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@llm_bp.route("/final-diagnosis", methods=["POST"])
def final_diagnosis():
    """
    Predictions + user answers → final disease + structured treatment.

    Input:  {"predictions": [...], "user_answers": {...}}
    Output: {"final_disease": str, "treatment": str, "risk_level": str}
    """
    data = request.get_json(silent=True) or {}
    predictions = data.get("predictions", [])
    user_answers = data.get("user_answers", {})

    # Step 1: Determine final disease
    diagnosis_prompt = f"""Based on these AI predictions:
{json.dumps(predictions, indent=2)}

And the patient's answers to follow-up questions:
{json.dumps(user_answers, indent=2)}

Determine the single most likely final skin disease diagnosis.
Return ONLY the disease name in plain text, nothing else.
"""
    try:
        final_disease = generate_text(diagnosis_prompt).strip()
    except Exception:
        final_disease = predictions[0]["disease"] if predictions else "Unknown"

    # Step 2: Determine risk level
    risk_prompt = f"""For the skin condition "{final_disease}", classify the risk level.
Return ONLY one of these words: low, moderate, high
"""
    try:
        risk_level = generate_text(risk_prompt).strip().lower()
        if risk_level not in ("low", "moderate", "high"):
            risk_level = "moderate"
    except Exception:
        risk_level = "moderate"

    # Step 3: Generate structured treatment plan
    treatment_prompt = f"""You are a medical assistant. Provide a structured treatment plan for:

**Disease:** {final_disease}

Respond using this exact format with 2-3 bullet points per section.
Keep explanations simple, practical, and relevant for a general audience.

**Diagnosis:** [Short explanation of the disease]

**Symptoms:**
- [Common symptom 1]
- [Common symptom 2]
- [Common symptom 3]

**Causes:**
- [Major cause or risk factor]
- [Another contributing factor]

**Treatments (Ordered by approach):**
- Ayurvedic Solutions: [1-2 natural treatments]
- Home Remedies: [1-2 home relief methods]
- Non-Prescription Medications: [1-2 OTC products]
- Prescription Medications: [1-2 doctor-prescribed options]

**When to See a Doctor:**
- [Warning sign 1]
- [Warning sign 2]

**Prevention Tips:**
- [Prevention method 1]
- [Prevention method 2]
"""
    try:
        treatment = generate_text(treatment_prompt)
        treatment = apply_safety(treatment, is_treatment=True)
    except Exception:
        treatment = "Unable to generate treatment plan. Please consult a dermatologist."

    return jsonify({
        "final_disease": final_disease,
        "treatment": treatment,
        "risk_level": risk_level,
    })


@llm_bp.route("/treatment", methods=["POST"])
def treatment():
    """
    Generate treatment for a specific disease.

    Input:  {"disease": str}
    Output: {"treatment": str}
    """
    data = request.get_json(silent=True) or {}
    disease = data.get("disease", "").strip()

    if not disease:
        return jsonify({"error": "Disease name is required"}), 400

    prompt = f"""Provide a concise, structured treatment overview for {disease}.
Include: diagnosis summary, common symptoms, causes, home remedies, 
OTC medications, prescription options, and when to see a doctor.
Format with markdown headers and bullet points.
"""
    try:
        result = generate_text(prompt)
        result = apply_safety(result, is_treatment=True)
        return jsonify({"treatment": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
