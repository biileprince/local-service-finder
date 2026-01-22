// API Service utilities for making HTTP requests to backend

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" 
    ? "" 
    : process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : "http://localhost:3000");

export interface ApiError {
  error: string;
  message?: string;
}

export class ApiClient {
  private static getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }

  private static getHeaders(includeAuth = false): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  static async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth = false,
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = this.getHeaders(requiresAuth);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          error: "An error occurred",
        }));
        throw new Error(error.error || "Request failed");
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  static async get<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" }, requiresAuth);
  }

  static async post<T>(
    endpoint: string,
    data: any,
    requiresAuth = false,
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      requiresAuth,
    );
  }

  static async put<T>(
    endpoint: string,
    data: any,
    requiresAuth = false,
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      requiresAuth,
    );
  }

  static async patch<T>(
    endpoint: string,
    data: any,
    requiresAuth = false,
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      requiresAuth,
    );
  }

  static async delete<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" }, requiresAuth);
  }
}

// Auth API
export const authApi = {
  async register(data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role?: string;
  }) {
    return ApiClient.post<{ user: any; token: string }>(
      "/api/auth/register",
      data,
    );
  },

  async login(data: { email: string; password: string }) {
    return ApiClient.post<{ user: any; token: string }>(
      "/api/auth/login",
      data,
    );
  },

  async getCurrentUser() {
    return ApiClient.get<{ user: any; isProvider: boolean }>(
      "/api/auth/me",
      true,
    );
  },
};

// Categories API
export const categoriesApi = {
  async getAll() {
    return ApiClient.get<{
      categories: Array<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        icon: string | null;
        providerCount: number;
      }>;
    }>("/api/categories");
  },
};

// Providers API
export const providersApi = {
  async getAll(params?: {
    category?: string;
    search?: string;
    minRating?: number;
    verified?: boolean;
    featured?: boolean;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    return ApiClient.get<{
      providers: any[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/api/providers${queryString ? `?${queryString}` : ""}`);
  },

  async getById(id: string) {
    return ApiClient.get<{ provider: any }>(`/api/providers/${id}`);
  },
};

// Bookings API
export const bookingsApi = {
  async getAll(params?: { role?: "customer" | "provider"; status?: string }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    return ApiClient.get<{ bookings: any[] }>(
      `/api/bookings${queryString ? `?${queryString}` : ""}`,
      true,
    );
  },

  async getById(id: string) {
    return ApiClient.get<{ booking: any }>(`/api/bookings/${id}`, true);
  },

  async create(data: {
    providerId: string;
    date: string;
    time: string;
    serviceAddress: string;
    problemDescription: string;
  }) {
    return ApiClient.post<{ booking: any; message: string }>(
      "/api/bookings",
      data,
      true,
    );
  },

  async updateStatus(
    id: string,
    data: { status?: string; totalAmount?: number },
  ) {
    return ApiClient.patch<{ booking: any; message: string }>(
      `/api/bookings/${id}`,
      data,
      true,
    );
  },

  async delete(id: string) {
    return ApiClient.delete<{ message: string }>(`/api/bookings/${id}`, true);
  },
};
