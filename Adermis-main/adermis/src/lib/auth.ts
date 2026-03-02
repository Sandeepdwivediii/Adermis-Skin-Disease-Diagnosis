/**
 * Auth API client — handles login, register, logout, refresh, and session management.
 * All tokens are stored in HttpOnly cookies managed by the backend.
 */

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

async function authFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // Send cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await authFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const res = await authFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

export async function logout(): Promise<void> {
  await authFetch('/auth/logout', { method: 'POST' });
}

export async function refreshToken(): Promise<AuthResponse> {
  const res = await authFetch('/auth/refresh', { method: 'POST' });
  if (!res.ok) throw new Error('Refresh failed');
  return res.json();
}

export async function getMe(): Promise<AuthResponse> {
  const res = await authFetch('/auth/me');
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

export async function updateProfile(data: { name?: string; password?: string }): Promise<AuthResponse> {
  const res = await authFetch('/auth/update-profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.json();
}
