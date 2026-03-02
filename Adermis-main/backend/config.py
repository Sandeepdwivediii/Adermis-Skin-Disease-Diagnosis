"""
Shared configuration for all backend services.
Loads environment variables and defines constants.
"""
import os
from dotenv import load_dotenv

load_dotenv()

# ─── Flask / Server ───
SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")
PORT = int(os.getenv("PORT", 5000))
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"

# ─── JWT ───
JWT_SECRET = os.getenv("JWT_SECRET", SECRET_KEY)
JWT_REFRESH_SECRET = os.getenv("JWT_REFRESH_SECRET", SECRET_KEY + "-refresh")
ACCESS_TOKEN_EXPIRY_MINUTES = 15
REFRESH_TOKEN_EXPIRY_DAYS = 7

# ─── MongoDB ───
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/adermis")

# ─── Google Gemini ───
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY", "")

# ─── Google Maps ───
MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")

# ─── ML Model ───
MODEL_URL = "https://drive.google.com/uc?id=1w0mSk2-OZHFrMDYgSa2JSesF3JXHh0Jx"
MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
MODEL_PATH = os.path.join(MODEL_DIR, "skin_disease_model.pth")

CLASS_NAMES = [
    "Unknown", "Eczema", "Warts", "Melanoma", "Atopic Dermatitis",
    "BCC", "Melanocytic Nevi", "BKL", "Psoriasis",
    "Seborrheic Keratoses", "Tinea"
]

# ─── Clinic Cache ───
CLINIC_CACHE_TTL_SECONDS = 300  # 5 minutes
