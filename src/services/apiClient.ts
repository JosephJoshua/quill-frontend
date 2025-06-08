import { useAuthStore } from "@/store/auth";
import { ApiError } from "@/types/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

type FetchOptions = RequestInit & {
  useAuth?: boolean;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }
    return response.json() as Promise<T>;
  }

  const errorData: ApiError = await response.json();
  // Special handling for 401 Unauthorized to trigger logout
  if (response.status === 401) {
    useAuthStore.getState().logout();
    // Optionally redirect to login page
    window.location.href = "/login";
  }

  const errorMessage = Array.isArray(errorData.message)
    ? errorData.message.join(", ")
    : errorData.message;

  throw new Error(errorMessage || "An unknown API error occurred");
}

export const apiClient = {
  async get<T>(
    endpoint: string,
    options: FetchOptions = { useAuth: true }
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  },

  async post<T>(
    endpoint: string,
    body: any,
    options: FetchOptions = { useAuth: true }
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async put<T>(
    endpoint: string,
    body: any,
    options: FetchOptions = { useAuth: true }
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  async patch<T>(
    endpoint: string,
    body: any,
    options: FetchOptions = { useAuth: true }
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  async delete<T>(
    endpoint: string,
    options: FetchOptions = { useAuth: true }
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  },

  async request<T>(endpoint: string, options: FetchOptions): Promise<T> {
    const { useAuth = true, ...fetchOptions } = options;
    const headers = new Headers(fetchOptions.headers || {});

    headers.set("Content-Type", "application/json");
    headers.set("ngrok-skip-browser-warning", "123abc");

    if (useAuth) {
      const token = useAuthStore.getState().token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    return handleResponse<T>(response);
  },
};
