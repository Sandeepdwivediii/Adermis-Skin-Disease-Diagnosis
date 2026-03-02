"""Simple in-memory TTL cache. Drop-in replacement for Redis in dev."""
import time
from threading import Lock


class TTLCache:
    """Thread-safe dictionary with per-key TTL expiration."""

    def __init__(self, default_ttl: int = 300):
        self._store: dict = {}
        self._lock = Lock()
        self.default_ttl = default_ttl

    def get(self, key: str):
        with self._lock:
            entry = self._store.get(key)
            if entry is None:
                return None
            if time.time() > entry["expires"]:
                del self._store[key]
                return None
            return entry["value"]

    def set(self, key: str, value, ttl: int | None = None):
        with self._lock:
            self._store[key] = {
                "value": value,
                "expires": time.time() + (ttl or self.default_ttl),
            }

    def delete(self, key: str):
        with self._lock:
            self._store.pop(key, None)

    def has(self, key: str) -> bool:
        return self.get(key) is not None

    def clear(self):
        with self._lock:
            self._store.clear()


# Singleton caches used across services
clinic_cache = TTLCache(default_ttl=300)
token_blacklist = TTLCache(default_ttl=7 * 24 * 3600)  # 7-day TTL for refresh tokens
