"""Google Places API wrapper with in-memory caching."""
import requests
from config import MAPS_API_KEY
from utils.cache import clinic_cache

# Keywords for categorization
_GOV_KEYWORDS = ["govt", "government", "municipal", "district", "public", "sarkari"]
_NGO_KEYWORDS = ["ngo", "charitable", "trust", "foundation", "mission", "welfare"]


def _categorize_place(place: dict) -> str:
    """Categorize a place as Government, NGO, or Private."""
    name_lower = (place.get("name", "") or "").lower()
    types = place.get("types", [])
    
    for keyword in _GOV_KEYWORDS:
        if keyword in name_lower:
            return "Government"
    
    for keyword in _NGO_KEYWORDS:
        if keyword in name_lower:
            return "NGO"
    
    return "Private"


def find_nearby_clinics(lat: float, lng: float, radius_km: int = 20) -> list:
    """
    Find skin-related clinics near a location using Google Places API.
    Results are cached by lat/lng grid for 5 minutes.
    """
    # Round coordinates to create cache grid (~1km precision)
    cache_key = f"clinics:{round(lat, 2)}:{round(lng, 2)}:{radius_km}"
    cached = clinic_cache.get(cache_key)
    if cached is not None:
        return cached

    if not MAPS_API_KEY:
        return []

    radius = radius_km * 1000
    categories = {
        "NGO": "NGO skin hospital",
        "Government": "government skin hospital",
        "Private": "dermatologist skin clinic",
    }

    clinics = []
    seen_ids = set()

    for category, keyword in categories.items():
        places_url = (
            f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
            f"location={lat},{lng}&radius={radius}&type=hospital&keyword={keyword}"
            f"&key={MAPS_API_KEY}"
        )
        try:
            resp = requests.get(places_url, timeout=10)
            data = resp.json()
        except Exception:
            continue

        for place in data.get("results", []):
            place_id = place.get("place_id")
            if not place_id or place_id in seen_ids:
                continue
            seen_ids.add(place_id)

            # Fetch details
            details = {}
            try:
                details_url = (
                    f"https://maps.googleapis.com/maps/api/place/details/json?"
                    f"place_id={place_id}"
                    f"&fields=name,formatted_address,formatted_phone_number,opening_hours,website,rating"
                    f"&key={MAPS_API_KEY}"
                )
                details_resp = requests.get(details_url, timeout=10)
                details = details_resp.json().get("result", {})
            except Exception:
                pass

            # Determine actual category from place info
            actual_category = _categorize_place(place)

            clinic = {
                "category": actual_category,
                "name": place.get("name"),
                "place_id": place_id,
                "address": details.get("formatted_address", place.get("vicinity", "")),
                "phone": details.get("formatted_phone_number"),
                "website": details.get("website"),
                "rating": place.get("rating"),
                "location": place.get("geometry", {}).get("location", {}),
                "hours": details.get("opening_hours", {}).get("weekday_text", []),
                "is_open": details.get("opening_hours", {}).get("open_now"),
            }
            clinics.append(clinic)

    # Sort: NGO first, then Government, then Private
    sort_order = {"NGO": 0, "Government": 1, "Private": 2}
    clinics.sort(key=lambda c: sort_order.get(c["category"], 3))

    # Cache results
    clinic_cache.set(cache_key, clinics)
    return clinics
