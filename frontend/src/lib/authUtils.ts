export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

export function redirectToLogin() {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  window.location.href = `${API_BASE_URL}/auth/login`;
}

export function redirectToLogout() {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  window.location.href = `${API_BASE_URL}/auth/logout`;
}