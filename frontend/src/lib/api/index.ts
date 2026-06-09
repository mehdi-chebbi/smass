// API Configuration and exports
export * from './config';
export * from './client';
export * from './auth';
export * from './content';
export * from './map';

import apiClient from './client';
import { API_ENDPOINTS, getApiUrl } from './config';

// Re-export getApiUrl for convenience
export { getApiUrl };

// News API
export const newsApi = {
  getAll: async (params?: { isEvent?: boolean; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.isEvent !== undefined) queryParams.set('isEvent', params.isEvent.toString());
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    
    return apiClient.get(`${API_ENDPOINTS.news}?${queryParams.toString()}`);
  },
};

// Statistics API
export const statisticsApi = {
  getAll: async () => {
    return apiClient.get(API_ENDPOINTS.statistics);
  },
};

// Partners API
export const partnersApi = {
  getAll: async () => {
    return apiClient.get(API_ENDPOINTS.partners);
  },
};

// Tenders API
export const tendersApi = {
  getAll: async (params?: { status?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.set('status', params.status);
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    
    return apiClient.get(`${API_ENDPOINTS.tenders}?${queryParams.toString()}`);
  },
};

// Categories API
export const categoriesApi = {
  getAll: async () => {
    return apiClient.get(API_ENDPOINTS.categories);
  },
};

// Tags API
export const tagsApi = {
  getAll: async () => {
    return apiClient.get(API_ENDPOINTS.tags);
  },
};

// Settings API
export const settingsApi = {
  getAll: async () => {
    return apiClient.get(API_ENDPOINTS.settings);
  },
};

// Health check
export const healthApi = {
  check: async () => {
    return apiClient.get(API_ENDPOINTS.health);
  },
};
