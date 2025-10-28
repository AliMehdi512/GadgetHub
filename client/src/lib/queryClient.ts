import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { supabase } from "./supabase";

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
  // Only add auth headers for protected endpoints
  const isProtectedEndpoint = url.includes('/api/auth/') || 
                             url.includes('/api/cart') || 
                             url.includes('/api/orders') ||
                             url.includes('/api/admin');
  
  let headers: Record<string, string> = {};
  
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  if (isProtectedEndpoint) {
    // Get the current session token for protected endpoints
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    if (token) {
      headers.Authorization = `Bearer ${token}`;
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
    
    // Only add auth headers for protected endpoints
    const isProtectedEndpoint = url.includes('/api/auth/') || 
                               url.includes('/api/cart') || 
                               url.includes('/api/orders') ||
                               url.includes('/api/admin');
    
    let headers: Record<string, string> = {};
    
    if (isProtectedEndpoint) {
      // Get the current session token for protected endpoints
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const res = await fetch(url, {
      headers,
      credentials: "include",
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
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
