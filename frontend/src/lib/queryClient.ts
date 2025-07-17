import { QueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://zoonigia-web.onrender.com';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = (queryKey[0] as string).startsWith('http') 
          ? queryKey[0] as string 
          : `${API_BASE_URL}${queryKey[0]}`;
        const response = await fetch(url, {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        }
        
        return response.json();
      },
    },
  },
});

export async function apiRequest(
  method: string,
  endpoint: string,
  data?: any
): Promise<Response> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
    ...(data && { body: JSON.stringify(data) }),
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response;
}