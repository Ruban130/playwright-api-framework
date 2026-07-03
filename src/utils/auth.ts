import { AuthToken } from '../types/api.types.js';
import logger from './logger.js';

interface JWTPayload {
  iss?: string;
  sub?: string;
  aud?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export class AuthManager {
  private token: AuthToken | null = null;

  /**
   * Decode JWT token (without verification)
   * Note: For production, verify token signature on server-side
   */
  public decodeJWT(token: string): JWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        logger.warn('Invalid JWT format');
        return null;
      }

      const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
      return JSON.parse(payload) as JWTPayload;
    } catch (error) {
      logger.error('Failed to decode JWT', error);
      return null;
    }
  }

  /**
   * Check if JWT token is expired
   */
  public isTokenExpired(token: string): boolean {
    const payload = this.decodeJWT(token);
    if (!payload || !payload.exp) {
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }

  /**
   * Store token in memory
   */
  public setToken(token: AuthToken): void {
    this.token = token;
    logger.info('Token stored successfully');
  }

  /**
   * Get stored token
   */
  public getToken(): AuthToken | null {
    return this.token;
  }

  /**
   * Generate OAuth Authorization header
   */
  public generateAuthorizationHeader(): Record<string, string> | null {
    if (!this.token) {
      logger.warn('No token available');
      return null;
    }

    return {
      Authorization: `${this.token.tokenType} ${this.token.accessToken}`,
    };
  }

  /**
   * Generate Bearer token header
   */
  public generateBearerHeader(token: string): Record<string, string> {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Generate Basic Auth header
   */
  public generateBasicAuthHeader(username: string, password: string): Record<string, string> {
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    return {
      Authorization: `Basic ${credentials}`,
    };
  }

  /**
   * Clear stored token
   */
  public clearToken(): void {
    this.token = null;
    logger.info('Token cleared');
  }
}

export const authManager = new AuthManager();
