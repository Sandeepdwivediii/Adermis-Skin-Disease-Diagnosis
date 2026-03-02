"""Clinic service routes — POST /find-clinics."""
import requests
from flask import Blueprint, request, jsonify
from config import MAPS_API_KEY
from services.clinic.places import find_nearby_clinics

clinic_bp = Blueprint("clinic", __name__, url_prefix="/clinics")


@clinic_bp.route("/find", methods=["POST"])
def find_clinics():
    """
    Find nearby skin clinics.

    Input:  {"location": {"lat": float, "lng": float} | str, "range": int}
    Output: {"clinics": [...]}
    """
    data = request.get_json(silent=True) or {}
    user_location = data.get("location")
    range_km = data.get("range", 20)

    if not user_location:
        return jsonify({"error": "Location is required"}), 400

    # If location is a string (city name), geocode it
    if isinstance(user_location, str):
        if not MAPS_API_KEY:
            return jsonify({"error": "Maps API key not configured"}), 500
        geocode_url = (
            f"https://maps.googleapis.com/maps/api/geocode/json"
            f"?address={user_location}&key={MAPS_API_KEY}"
        )
        try:
            geo_resp = requests.get(geocode_url, timeout=10)
            geo_data = geo_resp.json()
            if geo_data.get("status") != "OK":
                return jsonify({"error": "Unable to geocode location"}), 400
            loc = geo_data["results"][0]["geometry"]["location"]
            lat, lng = loc["lat"], loc["lng"]
        except Exception as e:
            return jsonify({"error": f"Geocoding failed: {str(e)}"}), 500
    else:
        lat = user_location.get("lat")
        lng = user_location.get("lng")
        if lat is None or lng is None:
            return jsonify({"error": "Invalid location format"}), 400

    clinics = find_nearby_clinics(lat, lng, range_km)
    return jsonify({"clinics": clinics})
