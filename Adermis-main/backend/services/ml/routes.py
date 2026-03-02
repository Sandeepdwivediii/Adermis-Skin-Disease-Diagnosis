"""ML Prediction service routes — POST /predict."""
import torch
from flask import Blueprint, request, jsonify
from config import CLASS_NAMES
from services.ml.model import get_model
from services.ml.preprocessing import preprocess_image

ml_bp = Blueprint("ml", __name__, url_prefix="/ml")


@ml_bp.route("/predict", methods=["POST"])
def predict():
    """
    Accept an image file, return top-3 disease predictions.

    Returns:
        {
            "disease": str,
            "confidence": float,
            "top3_predictions": [{"disease": str, "confidence": float}, ...]
        }
    """
    image_file = request.files.get("image")
    if not image_file:
        return jsonify({"error": "No image provided"}), 400

    try:
        model = get_model()
        img_tensor = preprocess_image(image_file)

        with torch.no_grad():
            outputs = model(img_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)[0]

        # Top-3 predictions
        top3_values, top3_indices = torch.topk(probabilities, 3)
        top3 = []
        for score, idx in zip(top3_values, top3_indices):
            idx_int = idx.item()
            disease = CLASS_NAMES[idx_int] if 0 <= idx_int < len(CLASS_NAMES) else "Unknown"
            top3.append({"disease": disease, "confidence": round(score.item(), 4)})

        best = top3[0]
        return jsonify({
            "disease": best["disease"],
            "confidence": best["confidence"],
            "top3_predictions": top3,
        })

    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500
