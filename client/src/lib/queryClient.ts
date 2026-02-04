import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage = res.statusText;
    let errorDetails: any = null;
    
    try {
      // Read response as text first (can be parsed as JSON if needed)
      const text = await res.text();
      
      if (text) {
        // Try to parse as JSON
        try {
          const json = JSON.parse(text);
          errorMessage = json.message || json.error || errorMessage;
          errorDetails = json;
        } catch {
          // Not JSON, use text as error message
          errorMessage = text || errorMessage;
        }
      }
    } catch (parseError) {
      // If reading fails, use status text
      errorMessage = res.statusText;
    }
    
    const error: any = new Error(errorMessage);
    error.status = res.status;
    error.details = errorDetails;
    throw error;
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  let headers: Record<string, string> = {};
  
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  // Add Firebase ID token and user ID for authenticated requests
  try {
    const { auth } = await import('@/lib/firebase');
      const user = auth.currentUser;
      if (user) {
        const idToken = await user.getIdToken();
        headers["Authorization"] = `Bearer ${idToken}`;
        headers["x-user-id"] = user.uid; // Add user ID for backend
      }
    } catch (error) {
      console.error('Failed to get Firebase ID token:', error);
    // Don't throw here, let the server handle the missing auth
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    
    // Add Firebase ID token and user ID for authenticated requests
    let headers: Record<string, string> = {};
    
    try {
      const { auth } = await import('@/lib/firebase');
      const user = auth.currentUser;
      if (user) {
        const idToken = await user.getIdToken();
        headers["Authorization"] = `Bearer ${idToken}`;
        headers["x-user-id"] = user.uid; // Add user ID for backend
      }
    } catch (error) {
      console.error('Failed to get Firebase ID token for query:', error);
    }
    
    // Add Firebase UID for admin routes (fallback)
    if (url.includes('/admin/')) {
      try {
        const { waitForAuth } = await import('@/lib/adminClient');
        const user = await waitForAuth();
        if (user && !headers["x-user-id"]) {
          headers["X-User-ID"] = user.uid;
        }
      } catch (error) {
        console.error('Admin request - Auth failed:', error);
      }
    }
    
    const res = await fetch(url, {
      credentials: "include",
      headers,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});
