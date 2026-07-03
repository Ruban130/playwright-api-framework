import { ApiConfig } from '../types/api.types.js';

export const apiConfig: ApiConfig = {
  baseURL: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  timeout: parseInt(process.env.TEST_TIMEOUT || '30000', 10),
  retries: parseInt(process.env.RETRY_COUNT || '2', 10),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export const endpoints = {
  // JSONPlaceholder endpoints
  users: '/users',
  posts: '/posts',
  comments: '/comments',
  
  // Specific resource endpoints
  userById: (id: number): string => `/users/${id}`,
  postById: (id: number): string => `/posts/${id}`,
  commentById: (id: number): string => `/comments/${id}`,
  postsByUserId: (userId: number): string => `/posts?userId=${userId}`,
  commentsByPostId: (postId: number): string => `/comments?postId=${postId}`,
};
