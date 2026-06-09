import apiClient from './client';
import { API_ENDPOINTS } from './config';

// Types
export interface Content {
  id: string;
  title: string;
  titleFr?: string;
  slug: string;
  excerpt?: string;
  excerptFr?: string;
  content: string;
  contentFr?: string;
  contentType: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    nameFr?: string;
  };
  tags?: { id: string; name: string }[];
  author?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ContentPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ContentsResponse {
  contents: Content[];
  pagination: ContentPagination;
}

// Content API
export const contentApi = {
  getAll: async (params?: {
    status?: string;
    contentType?: string;
    categoryId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ContentsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.set('status', params.status);
    if (params?.contentType) queryParams.set('contentType', params.contentType);
    if (params?.categoryId) queryParams.set('categoryId', params.categoryId);
    if (params?.search) queryParams.set('search', params.search);
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    
    const endpoint = `${API_ENDPOINTS.contents}?${queryParams.toString()}`;
    return apiClient.get(endpoint);
  },

  getPublished: async (params?: {
    contentType?: string;
    categoryId?: string;
    page?: number;
    limit?: number;
  }): Promise<ContentsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.contentType) queryParams.set('contentType', params.contentType);
    if (params?.categoryId) queryParams.set('categoryId', params.categoryId);
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    
    const endpoint = `${API_ENDPOINTS.publishedContents}?${queryParams.toString()}`;
    return apiClient.get(endpoint);
  },

  getBySlug: async (slug: string): Promise<{ content: Content }> => {
    return apiClient.get(API_ENDPOINTS.contentBySlug(slug));
  },

  create: async (data: Partial<Content>): Promise<{ message: string; content: Content }> => {
    return apiClient.post(API_ENDPOINTS.contents, data);
  },

  update: async (id: string, data: Partial<Content>): Promise<{ message: string; content: Content }> => {
    return apiClient.put(API_ENDPOINTS.contentById(id), data);
  },

  delete: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete(API_ENDPOINTS.contentById(id));
  },
};

export default contentApi;
