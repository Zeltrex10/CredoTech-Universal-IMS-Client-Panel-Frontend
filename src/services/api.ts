import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling auth errors
apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");	
    }
    return Promise.reject(error);
  }
);

export default apiInstance;

export interface User {
  id: string;
  email: string;
  name: string;
  companyName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiInstance.post<AuthResponse>("/api/login", {
      email,
      password,
    });
    return response.data;
  },

  signup: async (userData: {
    email: string;
    password: string;
    name: string;
    companyName: string;
  }): Promise<AuthResponse> => {
    const response = await apiInstance.post<AuthResponse>("/api/signup", userData);
    return response.data;
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    await apiInstance.post("/api/request-reset", { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiInstance.post("/api/reset-password", {
      token,
      newPassword,
    });
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiInstance.get<User>("/api/me");
    return response.data;
  },

  updatePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    await apiInstance.put("/api/update-password", {
      currentPassword,
      newPassword,
    });
  },

  updateUser: async (
    userId: string,
    userData: { name: string; email: string; currentPassword: string; newPassword?: string }
  ): Promise<User> => {
    const response = await apiInstance.put<User>(`/api/users/${userId}`, userData);
    return response.data;
  },

  getToken: async (userId: string): Promise<string> => {
    const response = await apiInstance.get<{ token: string }>(`/api/token/${userId}`);
    return response.data.token; 
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  },
};

export const statsApi = {
  getInitialStats: async () => {
    return await apiInstance.get("/stats/initial");
  },
  storeInitialStats: async (stats: any) => {
    return await apiInstance.post("/stats/initial", stats);
  },
  getLastResetDate: async () => {
    return await apiInstance.get("/stats/last-reset-date");
  },
  resetDailyStats: async () => {
    return await apiInstance.post("/stats/reset-daily");
  },
};
