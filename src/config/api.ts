/**
 * API configuration
 * Centralizes all API endpoints and prevents hardcoding throughout the application
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  USER_PROFILE: `${API_BASE_URL}/auth/user`,
};
