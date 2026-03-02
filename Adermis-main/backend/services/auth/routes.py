"""Auth service routes — registration, login, refresh, logout."""
from flask import Blueprint, request, jsonify, make_response
from pymongo import MongoClient
import bcrypt
from config import MONGODB_URI, ACCESS_TOKEN_EXPIRY_MINUTES, REFRESH_TOKEN_EXPIRY_DAYS
from services.auth.jwt_utils import (
    create_access_token,
    create_refresh_token,
    verify_refresh_token,
    blacklist_token,
)
from services.auth.middleware import require_auth

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

# MongoDB connection
_client = MongoClient(MONGODB_URI)
_db = _client.get_default_database() if "/" in MONGODB_URI.split("://")[-1] else _client["adermis"]
users_col = _db["users"]

# Ensure email index
users_col.create_index("email", unique=True)


def _set_auth_cookies(response, access_token: str, refresh_token: str):
    """Set HttpOnly, Secure, SameSite cookies for auth tokens."""
    response.set_cookie(
        "access_token",
        access_token,
        httponly=True,
        secure=False,  # Set True in production with HTTPS
        samesite="Lax",
        max_age=ACCESS_TOKEN_EXPIRY_MINUTES * 60,
        path="/",
    )
    response.set_cookie(
        "refresh_token",
        refresh_token,
        httponly=True,
        secure=False,
        samesite="Lax",
        max_age=REFRESH_TOKEN_EXPIRY_DAYS * 86400,
        path="/",
    )
    return response


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    name = data.get("name", "").strip()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    if users_col.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 409

    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    result = users_col.insert_one({
        "email": email,
        "name": name,
        "password": hashed.decode("utf-8"),
    })

    user_id = str(result.inserted_id)
    access_token = create_access_token(user_id, email, name)
    refresh_token = create_refresh_token(user_id)

    resp = make_response(jsonify({
        "success": True,
        "user": {"id": user_id, "email": email, "name": name},
    }))
    return _set_auth_cookies(resp, access_token, refresh_token)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = users_col.find_one({"email": email})
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    stored_hash = user["password"]
    if isinstance(stored_hash, str):
        stored_hash = stored_hash.encode("utf-8")

    if not bcrypt.checkpw(password.encode("utf-8"), stored_hash):
        return jsonify({"error": "Invalid email or password"}), 401

    user_id = str(user["_id"])
    name = user.get("name", "")
    access_token = create_access_token(user_id, email, name)
    refresh_token = create_refresh_token(user_id)

    resp = make_response(jsonify({
        "success": True,
        "user": {"id": user_id, "email": email, "name": name},
    }))
    return _set_auth_cookies(resp, access_token, refresh_token)


@auth_bp.route("/refresh", methods=["POST"])
def refresh():
    old_refresh = request.cookies.get("refresh_token")
    if not old_refresh:
        return jsonify({"error": "No refresh token"}), 401

    payload = verify_refresh_token(old_refresh)
    if payload is None:
        return jsonify({"error": "Invalid or expired refresh token"}), 401

    # Rotate: blacklist old refresh token, issue new pair
    blacklist_token(old_refresh)

    user_id = payload["sub"]
    user = users_col.find_one({"_id": __import__("bson").ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 401

    email = user["email"]
    name = user.get("name", "")
    new_access = create_access_token(user_id, email, name)
    new_refresh = create_refresh_token(user_id)

    resp = make_response(jsonify({
        "success": True,
        "user": {"id": user_id, "email": email, "name": name},
    }))
    return _set_auth_cookies(resp, new_access, new_refresh)


@auth_bp.route("/logout", methods=["POST"])
def logout():
    refresh_token = request.cookies.get("refresh_token")
    if refresh_token:
        blacklist_token(refresh_token)

    resp = make_response(jsonify({"success": True}))
    resp.delete_cookie("access_token", path="/")
    resp.delete_cookie("refresh_token", path="/")
    return resp


@auth_bp.route("/me", methods=["GET"])
@require_auth
def me():
    """Return current authenticated user info."""
    from flask import g
    return jsonify({
        "user": {
            "id": g.user_id,
            "email": g.user_email,
            "name": g.user_name,
        }
    })


@auth_bp.route("/update-profile", methods=["PUT"])
@require_auth
def update_profile():
    """Update user name or password."""
    from flask import g
    import bson

    data = request.get_json(silent=True) or {}
    updates = {}

    if "name" in data:
        updates["name"] = data["name"].strip()

    if "password" in data and data["password"]:
        if len(data["password"]) < 6:
            return jsonify({"error": "Password must be at least 6 characters"}), 400
        hashed = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt())
        updates["password"] = hashed.decode("utf-8")

    if not updates:
        return jsonify({"error": "Nothing to update"}), 400

    users_col.update_one(
        {"_id": bson.ObjectId(g.user_id)},
        {"$set": updates}
    )

    user = users_col.find_one({"_id": bson.ObjectId(g.user_id)})
    return jsonify({
        "success": True,
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user.get("name", ""),
        }
    })
