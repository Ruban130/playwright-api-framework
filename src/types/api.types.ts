export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: T;
}

export interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  headers?: Record<string, string>;
  body?: unknown;
  queryParams?: Record<string, string | number | boolean>;
}

export interface AuthToken {
  accessToken: string;
  tokenType: string;
  expiresIn?: number;
  refreshToken?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
}

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface TestContext {
  testData: Map<string, unknown>;
  authToken?: AuthToken;
}
