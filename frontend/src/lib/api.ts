const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function apiRequest(
  method: string,
  endpoint: string,
  data?: any,
  options: RequestInit = {}
) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Important for sessions
    ...options,
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${response.status}: ${errorText}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text();
}

export const api = {
  get: (endpoint: string, options?: RequestInit) => apiRequest('GET', endpoint, null, options),
  post: (endpoint: string, data?: any, options?: RequestInit) => apiRequest('POST', endpoint, data, options),
  put: (endpoint: string, data?: any, options?: RequestInit) => apiRequest('PUT', endpoint, data, options),
  patch: (endpoint: string, data?: any, options?: RequestInit) => apiRequest('PATCH', endpoint, data, options),
  delete: (endpoint: string, options?: RequestInit) => apiRequest('DELETE', endpoint, null, options),
};