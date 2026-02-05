import { QueryClient, QueryFunction } from "@tanstack/react-query";

// --- ADDED: Define the Backend URL based on the environment ---
const BASE_URL = import.meta.env.PROD
  ? "https://zoonigia-backend.onrender.com"
  : ""; // Keep empty for dev to use relative paths (localhost proxy)
// -------------------------------------------------------------

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage = res.statusText;
    let errorDetails: any = null;

    try {
      const text = await res.text();
      if (text) {
        try {
          const json = JSON.parse(text);
          errorMessage = json.message || json.error || errorMessage;
          errorDetails = json;
        } catch {
          errorMessage = text || errorMessage;
        }
      }
    } catch (parseError) {
      errorMessage = res.statusText;
    }

    const error: any = new Error(errorMessage);
    error.status = res.status;
    error.details = errorDetails;
    throw error;
  }
}

// --- ADDED: Helper to construct the full URL ---
function getFullUrl(path: string) {
  if (!path.startsWith("/")) {
    path = "/" + path;
  }
  // If the path is already a full URL (external), leave it alone
  if (path.startsWith("http")) return path;

  return `${BASE_URL}${path}`;
}
// -----------------------------------------------

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  let headers: Record<string, string> = {};

  if (data) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const { auth } = await import('@/lib/firebase');
    const user = auth.currentUser;
    if (user) {
      const idToken = await user.getIdToken();
      headers["Authorization"] = `Bearer ${idToken}`;
      headers["x-user-id"] = user.uid;
    }
  } catch (error) {
    console.error('Failed to get Firebase ID token:', error);
  }

  // --- UPDATED: Use getFullUrl here ---
  const res = await fetch(getFullUrl(url), {
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
      // --- UPDATED: Use getFullUrl here ---
      const path = queryKey.join("/");
      const url = getFullUrl(path);

      let headers: Record<string, string> = {};

      try {
        const { auth } = await import('@/lib/firebase');
        const user = auth.currentUser;
        if (user) {
          const idToken = await user.getIdToken();
          headers["Authorization"] = `Bearer ${idToken}`;
          headers["x-user-id"] = user.uid;
        }
      } catch (error) {
        console.error('Failed to get Firebase ID token for query:', error);
      }

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
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});