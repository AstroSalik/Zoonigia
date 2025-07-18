const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

export function getAuthUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

export function redirectToLogin(): void {
  window.location.href = getAuthUrl('/api/login');
}

export function redirectToLogout(): void {
  window.location.href = getAuthUrl('/api/logout');
}