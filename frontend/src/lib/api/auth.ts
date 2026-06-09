import apiClient from './client';
import { API_ENDPOINTS, TOKEN_KEY, USER_KEY } from './config';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  country: string;
  isActive: boolean;
  createdAt: string;
  lastLogin: string | null;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.login, { email, password });
    if (response.token) {
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }
    return response;
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    return apiClient.get(API_ENDPOINTS.me);
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    return apiClient.post(API_ENDPOINTS.changePassword, { currentPassword, newPassword });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = '/admin/login';
  },

  getStoredUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  getStoredToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(TOKEN_KEY);
  },

  isAdmin: (): boolean => {
    const user = authApi.getStoredUser();
    return user?.role === 'ADMIN';
  },

  isEditor: (): boolean => {
    const user = authApi.getStoredUser();
    return user?.role === 'ADMIN' || user?.role === 'EDITOR';
  },
};

export default authApi;
