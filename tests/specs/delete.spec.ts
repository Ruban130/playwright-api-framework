import { test, expect } from '@playwright/test';
import { RestClient } from '../../src/utils/rest-client.js';
import { apiConfig, endpoints } from '../../src/config/api-config.js';
import logger from '../../src/utils/logger.js';

test.describe('DELETE API Tests @regression', () => {
  let restClient: RestClient;

  test.beforeEach(async ({ request }) => {
    restClient = new RestClient(request, apiConfig);
    logger.info('Test setup: RestClient initialized for DELETE tests');
  });

  test.afterEach(() => {
    restClient.reset();
  });

  test('DELETE /posts/{id} - Delete existing post', async () => {
    const postId = 1;

    const response = await restClient.delete(endpoints.postById(postId));

    expect(response.status).toBe(200);

    logger.info(`✓ Post ${postId} deleted successfully`);
  });

  test('DELETE /posts/{id} - Delete with verification via response', async () => {
    const postId = 2;

    const response = await restClient.delete(endpoints.postById(postId));

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();

    logger.info(`✓ Delete response received and verified`);
  });

  test('DELETE /posts/{id} - Response structure validation', async () => {
    const postId = 3;

    const response = await restClient.delete(endpoints.postById(postId));

    expect(response.status).toBe(200);
    expect(response.statusText).toBe('OK');

    logger.info('✓ Delete response structure validated');
  });

  test('DELETE /posts/{id} - Delete with custom headers', async () => {
    const postId = 4;

    const response = await restClient
      .given()
      .header('X-Delete-Reason', 'test-cleanup')
      .header('X-Deleted-By', 'api-automation')
      .delete(endpoints.postById(postId));

    expect(response.status).toBe(200);

    logger.info('✓ DELETE request sent with custom headers');
  });

  test('DELETE /comments/{id} - Delete comment', async () => {
    const commentId = 1;

    const response = await restClient.delete(endpoints.commentById(commentId));

    expect(response.status).toBe(200);

    logger.info(`✓ Comment ${commentId} deleted`);
  });

  test('DELETE /users/{id} - Delete user', async () => {
    const userId = 10;

    const response = await restClient.delete(endpoints.userById(userId));

    expect(response.status).toBe(200);

    logger.info(`✓ User ${userId} deleted`);
  });

  test('DELETE /posts/{id} - Multiple deletions in sequence @smoke', async () => {
    const postIds = [5, 6, 7];

    for (const postId of postIds) {
      const response = await restClient.delete(endpoints.postById(postId));
      expect(response.status).toBe(200);
    }

    logger.info(`✓ ${postIds.length} posts deleted in sequence`);
  });

  test('DELETE /posts/{id} - Non-existent resource handling', async () => {
    const postId = 99999;

    const response = await restClient.delete(endpoints.postById(postId));

    // JSONPlaceholder returns 200 for non-existent resources
    expect([200, 404]).toContain(response.status);

    logger.info('✓ Non-existent resource delete handled gracefully');
  });

  test('DELETE /posts/{id} - Response header validation', async () => {
    const postId = 8;

    const response = await restClient.delete(endpoints.postById(postId));

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBeDefined();

    logger.info('✓ Response headers validated');
  });

  test('DELETE /posts/{id} - Empty response body handling', async () => {
    const postId = 9;

    const response = await restClient.delete(endpoints.postById(postId));

    expect(response.status).toBe(200);
    // Response body may be empty object or contain data depending on API
    expect(response.body).toBeDefined();

    logger.info('✓ Empty response body handled correctly');
  });

  test('DELETE /posts/{id} - Verify idempotency @regression', async () => {
    const postId = 10;

    // First deletion
    const response1 = await restClient.delete(endpoints.postById(postId));
    expect(response1.status).toBe(200);

    // Second deletion of same resource
    const response2 = await restClient.delete(endpoints.postById(postId));
    expect([200, 404]).toContain(response2.status);

    logger.info('✓ DELETE idempotency verified');
  });
});
