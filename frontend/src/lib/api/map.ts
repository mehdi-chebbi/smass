import apiClient from './client';
import { API_ENDPOINTS } from './config';

export const mapLayerApi = {
  getAll: async (): Promise<any> => apiClient.get(API_ENDPOINTS.mapLayers),
  getById: async (id: string): Promise<any> => apiClient.get(API_ENDPOINTS.mapLayerById(id)),
  create: async (data: any): Promise<any> => apiClient.post(API_ENDPOINTS.mapLayers, data),
  update: async (id: string, data: any): Promise<any> => apiClient.put(API_ENDPOINTS.mapLayerById(id), data),
  delete: async (id: string): Promise<any> => apiClient.delete(API_ENDPOINTS.mapLayerById(id)),
};

export const mapPointApi = {
  getAll: async (): Promise<any> => apiClient.get(API_ENDPOINTS.mapPoints),
  getById: async (id: string): Promise<any> => apiClient.get(API_ENDPOINTS.mapPointById(id)),
  create: async (data: any): Promise<any> => apiClient.post(API_ENDPOINTS.mapPoints, data),
  update: async (id: string, data: any): Promise<any> => apiClient.put(API_ENDPOINTS.mapPointById(id), data),
  delete: async (id: string): Promise<any> => apiClient.delete(API_ENDPOINTS.mapPointById(id)),
};

export default { mapLayerApi, mapPointApi };
