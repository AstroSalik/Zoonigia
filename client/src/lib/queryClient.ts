import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Get Firebase user for admin requests
  let headers: Record<string, string> = {};
  
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  // Add Firebase UID for admin routes
  if (url.includes('/admin/')) {
    try {
      const { waitForAuth } = await import('@/lib/adminClient');
      const user = await waitForAuth();
      if (user) {
        headers["X-User-ID"] = user.uid;
      }
    } catch (error) {
      console.error('Failed to get Firebase user for admin request:', error);
      // Don't throw here, let the server handle the missing auth
    }
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
    
    // Add Firebase UID for admin routes
    let headers: Record<string, string> = {};
    if (url.includes('/admin/')) {
      try {
        const { waitForAuth } = await import('@/lib/adminClient');
        const user = await waitForAuth();
        if (user) {
          headers["X-User-ID"] = user.uid;
        }
      } catch (error) {
        // Don't throw here, let the server handle the missing auth
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
