// ============================================================
// SMAS API Configuration - v3.0
// ============================================================
// ARCHITECTURE:
//   Backend (Express) → port 3001
//   Frontend (Next.js) → port 3000
//
// Client-side API calls use relative paths (/api/...) which
// go through Next.js proxy routes → backend.
// Server-side calls go directly to the backend.
//
// Asset URLs (images, file downloads) use XTransformPort
// to route through the Caddy gateway to the backend.
// ============================================================

export const BACKEND_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT || "3001";

export const API_CONFIG = {
  backendPort: BACKEND_PORT,
  timeout: 30000,
};

// Client-side: relative path (Next.js proxy routes forward to backend)
// Server-side: direct call to backend
export const getApiUrl = (endpoint: string): string => {
  if (typeof window === "undefined") {
    const base = process.env.BACKEND_URL || `http://localhost:${BACKEND_PORT}`;
    return `${base}${endpoint}`;
  }
  return endpoint;
};

// For client-side asset URLs (img src, file downloads, etc.)
// These bypass Next.js and go through the Caddy gateway using XTransformPort.
export const getAssetUrl = (path: string): string => {
  if (!path) return path;
  if (path.startsWith("http")) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}XTransformPort=${BACKEND_PORT}`;
};

// ============================================================
// TOKEN KEY — unified across the whole app
// ============================================================
export const TOKEN_KEY = "smas_auth_token";
export const USER_KEY = "smas_auth_user";

// ============================================================
// API ENDPOINTS  (all relative, getApiUrl prepends the host)
// ============================================================
export const API_ENDPOINTS = {
  // Auth
  login: "/api/auth/login",
  me: "/api/auth/me",
  changePassword: "/api/auth/change-password",

  // Content
  contents: "/api/contents",
  publishedContents: "/api/contents/published",
  contentBySlug: (slug: string) => `/api/contents/published/${slug}`,
  contentById: (id: string) => `/api/contents/${id}`,

  // News
  news: "/api/news",
  newsAll: "/api/news/all",
  newsById: (id: string) => `/api/news/${id}`,

  // Map
  mapLayers: "/api/map/layers",
  mapLayerById: (id: string) => `/api/map/layers/${id}`,
  mapPoints: "/api/map/points",
  mapPointById: (id: string) => `/api/map/points/${id}`,

  // Categories & Tags
  categories: "/api/categories",
  tags: "/api/tags",

  // Other
  statistics: "/api/statistics",
  statisticsAll: "/api/statistics/all",
  partners: "/api/partners",
  partnersAll: "/api/partners/all",
  tenders: "/api/tenders",
  tendersById: (id: string) => `/api/tenders/${id}`,
  settings: "/api/settings",
  health: "/api/health",

  // Upload
  uploadPdf: "/api/upload/pdf",
  uploadImage: "/api/upload/image",
  deleteFile: (type: string, filename: string) =>
    `/api/upload/${type}/${filename}`,

  // Users
  users: "/api/users",
  userById: (id: string) => `/api/users/${id}`,
};
