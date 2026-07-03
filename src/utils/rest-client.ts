import { APIRequestContext, expect } from '@playwright/test';
import { ApiConfig, ApiRequest, ApiResponse } from '../types/api.types.js';
import logger from './logger.js';

export class RestClient {
  private request: APIRequestContext;
  private config: ApiConfig;
  private currentRequest: ApiRequest;

  constructor(request: APIRequestContext, config: ApiConfig) {
    this.request = request;
    this.config = config;
    this.currentRequest = {
      method: 'GET',
      endpoint: '',
      headers: config.headers,
    };
  }

  /**
   * Fluent API: Set HTTP method
   */
  public given(): this {
    return this;
  }

  /**
   * Fluent API: Set request headers
   */
  public header(key: string, value: string): this {
    if (!this.currentRequest.headers) {
      this.currentRequest.headers = {};
    }
    this.currentRequest.headers[key] = value;
    return this;
  }

  /**
   * Fluent API: Set multiple headers
   */
  public headers(headers: Record<string, string>): this {
    this.currentRequest.headers = {
      ...this.currentRequest.headers,
      ...headers,
    };
    return this;
  }

  /**
   * Fluent API: Set request body
   */
  public body(body: unknown): this {
    this.currentRequest.body = body;
    return this;
  }

  /**
   * Fluent API: Set query parameters
   */
  public queryParam(key: string, value: string | number | boolean): this {
    if (!this.currentRequest.queryParams) {
      this.currentRequest.queryParams = {};
    }
    this.currentRequest.queryParams[key] = value;
    return this;
  }

  /**
   * Fluent API: Set multiple query parameters
   */
  public queryParams(params: Record<string, string | number | boolean>): this {
    this.currentRequest.queryParams = {
      ...this.currentRequest.queryParams,
      ...params,
    };
    return this;
  }

  /**
   * Fluent API: Perform GET request
   */
  public async when(): Promise<ApiResponse> {
    this.currentRequest.method = 'GET';
    return this.executeRequest();
  }

  /**
   * Fluent API: Perform POST request
   */
  public async post(): Promise<ApiResponse> {
    this.currentRequest.method = 'POST';
    return this.executeRequest();
  }

  /**
   * Fluent API: Perform PUT request
   */
  public async put(): Promise<ApiResponse> {
    this.currentRequest.method = 'PUT';
    return this.executeRequest();
  }

  /**
   * Fluent API: Perform PATCH request
   */
  public async patch(): Promise<ApiResponse> {
    this.currentRequest.method = 'PATCH';
    return this.executeRequest();
  }

  /**
   * Fluent API: Perform DELETE request
   */
  public async delete(): Promise<ApiResponse> {
    this.currentRequest.method = 'DELETE';
    return this.executeRequest();
  }

  /**
   * Fluent API: Set endpoint and execute GET
   */
  public async get(endpoint: string): Promise<ApiResponse> {
    this.currentRequest.endpoint = endpoint;
    this.currentRequest.method = 'GET';
    return this.executeRequest();
  }

  /**
   * Private: Execute the actual HTTP request
   */
  private async executeRequest(): Promise<ApiResponse> {
    try {
      const url = this.buildUrl();
      const options = this.buildRequestOptions();

      logger.info(`${this.currentRequest.method} ${url}`);

      let response;
      switch (this.currentRequest.method) {
        case 'POST':
          response = await this.request.post(url, options);
          break;
        case 'PUT':
          response = await this.request.put(url, options);
          break;
        case 'PATCH':
          response = await this.request.patch(url, options);
          break;
        case 'DELETE':
          response = await this.request.delete(url, options);
          break;
        default:
          response = await this.request.get(url, options);
      }

      const body = await response.json().catch(() => response.text());
      const apiResponse: ApiResponse = {
        status: response.status(),
        statusText: response.statusText(),
        headers: response.headers(),
        body,
      };

      logger.info(`Response status: ${apiResponse.status}`);
      return apiResponse;
    } catch (error) {
      logger.error('Request failed', error);
      throw error;
    }
  }

  /**
   * Private: Build complete URL with query parameters
   */
  private buildUrl(): string {
    let url = `${this.config.baseURL}${this.currentRequest.endpoint}`;

    if (this.currentRequest.queryParams) {
      const queryString = Object.entries(this.currentRequest.queryParams)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      url += `?${queryString}`;
    }

    return url;
  }

  /**
   * Private: Build request options
   */
  private buildRequestOptions(): Record<string, unknown> {
    const options: Record<string, unknown> = {
      timeout: this.config.timeout,
      headers: this.currentRequest.headers,
    };

    if (this.currentRequest.body) {
      options.data = this.currentRequest.body;
    }

    return options;
  }

  /**
   * Fluent API: Assertion - check status code
   */
  public then(): this {
    return this;
  }

  /**
   * Assert status code
   */
  public expectStatusCode(expectedStatus: number, actualResponse: ApiResponse): void {
    expect(actualResponse.status).toBe(expectedStatus);
    logger.info(`✓ Status code ${expectedStatus} verified`);
  }

  /**
   * Assert response body contains property
   */
  public expectProperty(property: string, actualResponse: ApiResponse): void {
    const body = actualResponse.body as Record<string, unknown>;
    expect(body).toHaveProperty(property);
    logger.info(`✓ Property ${property} exists in response`);
  }

  /**
   * Assert response body property value
   */
  public expectPropertyValue(
    property: string,
    expectedValue: unknown,
    actualResponse: ApiResponse
  ): void {
    const body = actualResponse.body as Record<string, unknown>;
    expect(body[property]).toBe(expectedValue);
    logger.info(`✓ Property ${property} equals ${expectedValue}`);
  }

  /**
   * Reset current request for next call
   */
  public reset(): void {
    this.currentRequest = {
      method: 'GET',
      endpoint: '',
      headers: this.config.headers,
    };
  }
}
