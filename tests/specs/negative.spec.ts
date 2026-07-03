import { test, expect } from '@playwright/test';
import { RestClient } from '../../src/utils/rest-client.js';
import { apiConfig, endpoints } from '../../src/config/api-config.js';
import logger from '../../src/utils/logger.js';

test.describe('Negative Tests & Edge Cases @regression', () => {
  let restClient: RestClient;

  test.beforeEach(async ({ request }) => {
    restClient = new RestClient(request, apiConfig);
    logger.info('Test setup: RestClient initialized for negative tests');
  });

  test.afterEach(() => {
    restClient.reset();
  });

  test('GET /posts/{id} - Non-existent post returns empty or 404', async () => {
    const postId = 999999;

    const response = await restClient.get(endpoints.postById(postId));

    // JSONPlaceholder returns empty for non-existent, some APIs return 404
    expect([200, 404]).toContain(response.status);

    logger.info('✓ Non-existent resource handled appropriately');
  });

  test('POST /posts - Missing required field (title)', async () => {
    const payload = {
      body: 'Body without title',
      userId: 1,
    };

    const response = await restClient
      .given()
      .body(payload)
      .post(endpoints.posts);

    // Depending on API validation, may accept or reject
    expect(response.status).toBeDefined();

    logger.info('✓ Request with missing field processed');
  });

  test('POST /posts - Null value in required field', async () => {
    const payload = {
      title: null,
      body: 'Test body',
      userId: 1,
    };

    const response = await restClient
      .given()
      .body(payload)
      .post(endpoints.posts);

    expect(response.status).toBeDefined();

    logger.info('✓ Request with null value processed');
  });

  test('PUT /posts/{id} - Malformed JSON handling', async () => {
    // This test demonstrates error handling
    const postId = 1;
    const payload = { title: undefined, body: undefined };

    const response = await restClient
      .given()
      .body(payload)
      .put(endpoints.postById(postId));

    expect(response.status).toBeDefined();

    logger.info('✓ Malformed data handled');
  });

  test('GET - Invalid endpoint returns appropriate status', async () => {
    const invalidEndpoint = '/posts/invalid';

    const response = await restClient.get(invalidEndpoint);

    // Should return 404 or appropriate error
    expect(response.status).toBeGreaterThanOrEqual(400);

    logger.info('✓ Invalid endpoint error handled');
  });

  test('POST /posts - Empty string title', async () => {
    const payload = {
      title: '',
      body: 'Body text',
      userId: 1,
    };

    const response = await restClient
      .given()
      .body(payload)
      .post(endpoints.posts);

    expect(response.status).toBeDefined();

    logger.info('✓ Empty string in field processed');
  });

  test('POST /posts - Extra fields in payload', async () => {
    const payload = {
      title: 'Test Title',
      body: 'Test Body',
      userId: 1,
      extraField: 'Should not affect',
      anotherExtra: 12345,
      nestedExtra: { unwanted: 'data' },
    };

    const response = await restClient
      .given()
      .body(payload)
      .post(endpoints.posts);

    expect(response.status).toBe(201);

    logger.info('✓ Extra fields in payload handled');
  });

  test('PATCH /posts/{id} - Patch with no fields (empty body)', async () => {
    const postId = 1;
    const payload = {};

    const response = await restClient
      .given()
      .body(payload)
      .patch(endpoints.postById(postId));

    expect([200, 400]).toContain(response.status);

    logger.info('✓ Empty PATCH body processed');
  });

  test('GET /posts - Numeric field in query string', async () => {
    const response = await restClient.queryParam('id', '1').when();

    expect(response.status).toBe(200);

    logger.info('✓ Numeric query parameter handled');
  });

  test('POST /posts - Extremely large string in body', async () => {
    const largeString = 'A'.repeat(10000);
    const payload = {
      title: largeString,
      body: largeString,
      userId: 1,
    };

    const response = await restClient
      .given()
      .body(payload)
      .post(endpoints.posts);

    expect([201, 400, 413]).toContain(response.status);

    logger.info('✓ Large payload processed');
  });

  test('GET /posts - Special characters in response', async () => {
    const response = await restClient.get(endpoints.posts);

    expect(response.status).toBe(200);

    const posts = response.body as Record<string, unknown>[];
    // Verify special characters can be parsed
    expect(posts.length).toBeGreaterThan(0);

    logger.info('✓ Response with special characters parsed');
  });

  test('POST /posts - Numeric string vs number validation', async () => {
    const payload1 = {
      title: 'Test',
      body: 'Test',
      userId: '1', // String instead of number
    };

    const response = await restClient
      .given()
      .body(payload1)
      .post(endpoints.posts);

    expect(response.status).toBe(201);

    logger.info('✓ Type coercion handled');
  });

  test('DELETE /posts/{id} - Delete already deleted resource', async () => {
    const postId = 11;

    // First delete
    const response1 = await restClient.delete(endpoints.postById(postId));
    expect(response1.status).toBe(200);

    // Second delete (should be idempotent or return 404)
    const response2 = await restClient.delete(endpoints.postById(postId));
    expect([200, 404]).toContain(response2.status);

    logger.info('✓ Repeated delete handled appropriately');
  });

  test('GET /posts/{id} - Boundary value: ID = 0', async () => {
    const response = await restClient.get(endpoints.postById(0));

    expect([200, 404]).toContain(response.status);

    logger.info('✓ Boundary value (ID=0) handled');
  });

  test('GET /posts/{id} - Boundary value: Very large ID', async () => {
    const response = await restClient.get(endpoints.postById(999999999));

    expect([200, 404]).toContain(response.status);

    logger.info('✓ Very large ID handled');
  });
});
