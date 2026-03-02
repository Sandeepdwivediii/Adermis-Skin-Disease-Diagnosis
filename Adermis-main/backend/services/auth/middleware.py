"""Auth middleware — JWT cookie verification decorator."""
from functools import wraps
from flask import request, jsonify, g
from services.auth.jwt_utils import verify_access_token


def require_auth(f):
    """Decorator that verifies the access_token cookie and attaches user info to `g`."""

    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get("access_token")
        if not token:
            # Also check Authorization header as fallback
            auth_header = request.headers.get("Authorization", "")
            if auth_header.startswith("Bearer "):
                token = auth_header[7:]

        if not token:
            return jsonify({"error": "Authentication required"}), 401

        payload = verify_access_token(token)
        if payload is None:
            return jsonify({"error": "Invalid or expired token"}), 401

        g.user_id = payload["sub"]
        g.user_email = payload["email"]
        g.user_name = payload.get("name", "")
        return f(*args, **kwargs)

    return decorated
