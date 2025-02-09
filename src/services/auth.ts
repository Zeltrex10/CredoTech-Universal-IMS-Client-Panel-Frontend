import apiInstance from "./api";

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
    console.log(`Updating user with ID: ${userId}`); // Add logging
    try {
      const response = await apiInstance.put<User>(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with ID: ${userId}`, error); // Add error logging
      throw error;
    }
  },

  getToken: async (userId: string): Promise<string> => {
    const response = await apiInstance.get<{ token: string }>(`/token/${userId}`);
    return response.data.token;
  },

  storeToken: async (userId: string, token: string): Promise<void> => {
    await apiInstance.post("/token", { userId, token });
  },

  removeToken: async (userId: string): Promise<void> => {
    await apiInstance.delete(`/token/${userId}`);
  },

  logout: async (userId: string) => {
    await authService.removeToken(userId);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  },
};
