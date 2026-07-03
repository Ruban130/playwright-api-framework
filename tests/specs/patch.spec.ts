import { test, expect } from '@playwright/test';
import { RestClient } from '../../src/utils/rest-client.js';
import { apiConfig, endpoints } from '../../src/config/api-config.js';
import { patchPostPayload } from '../fixtures/test-data.js';
import logger from '../../src/utils/logger.js';

test.describe('PATCH API Tests @regression', () => {
  let restClient: RestClient;

  test.beforeEach(async ({ request }) => {
    restClient = new RestClient(request, apiConfig);
    logger.info('Test setup: RestClient initialized for PATCH tests');
  });

  test.afterEach(() => {
    restClient.reset();
  });

  test('PATCH /posts/{id} - Partial update with single field', async () => {
    const postId = 1;
    const payload = { title: 'Patched Title Only' };

    const response = await restClient
      .given()
      .body(payload)
      .patch(endpoints.postById(postId));

    expect(response.status).toBe(200);

    const patchedPost = response.body as Record<string, unknown>;
    expect(patchedPost.id).toBe(postId);
    expect(patchedPost.title).toBe(payload.title);

    logger.info(`✓ Post ${postId} patched successfully`);
  });

  test('PATCH /posts/{id} - Partial update with multiple fields', async () => {
    const postId = 1;
    const payload = {
      title: 'New Title',
      body: 'New body text',
    };

    const response = await restClient
      .given()
      .body(payload)
      .patch(endpoints.postById(postId));

    expect(response.status).toBe(200);

    const patchedPost = response.body as Record<string, unknown>;
    expect(patchedPost.title).toBe(payload.title);
    expect(patchedPost.body).toBe(payload.body);

    logger.info('✓ Post patched with multiple fields');
  });

  test('PATCH /posts/{id} - Update only title field', async () => {
    const postId = 2;
    const payload = patchPostPayload;

    const response = await restClient
      .given()
      .body(payload)
      .patch(endpoints.postById(postId));

    expect(response.status).toBe(200);

    const patchedPost = response.body as Record<string, unknown>;
    expect(patchedPost.title).toBe(payload.title);

    logger.info('✓ Post title field patched');
  });

  test('PATCH /posts/{id} - Verify non-patched fields remain unchanged', async () => {
    const postId = 1;

    // First, get the original post
    const getResponse = await restClient.get(endpoints.postById(postId));
    const originalPost = getResponse.body as Record<string, unknown>;

    // Patch only the title
    const payload = { title: 'Temporarily Changed Title' };
    const patchResponse = await restClient
      .given()
      .body(payload)
      .patch(endpoints.postById(postId));

    expect(patchResponse.status).toBe(200);

    const patchedPost = patchResponse.body as Record<string, unknown>;
    expect(patchedPost.userId).toBe(originalPost.userId);
    expect(patchedPost.id).toBe(originalPost.id);

    logger.info('✓ Non-patched fields remained unchanged');
  });

  test('PATCH /posts/{id} - Patch with custom headers', async () => {
    const postId = 1;
    const payload = { title: 'Patched with Headers' };

    const response = await restClient
      .given()
      .header('X-Patch-Version', '2.0')
      .header('X-Patched-By', 'automation')
      .body(payload)
      .patch(endpoints.postById(postId));

    expect(response.status).toBe(200);

    logger.info('✓ PATCH request sent with custom headers');
  });

  test('PATCH /posts/{id} - Partial update preserves structure', async () => {
    const postId = 3;
    const payload = {
      body: 'Updated body content only',
    };

    const response = await restClient
      .given()
      .body(payload)
      .patch(endpoints.postById(postId));

    expect(response.status).toBe(200);

    const patchedPost = response.body as Record<string, unknown>;
    expect(patchedPost).toHaveProperty('id');
    expect(patchedPost).toHaveProperty('title');
    expect(patchedPost).toHaveProperty('userId');
    expect(patchedPost.body).toBe(payload.body);

    logger.info('✓ Structure preserved after partial update');
  });

  test('PATCH /posts/{id} - Multiple patch operations on same resource @smoke', async () => {
    const postId = 4;

    const patches = [
      { title: 'First Patch' },
      { body: 'First patch body' },
      { title: 'Second Patch Title' },
    ];

    for (const patch of patches) {
      const response = await restClient
        .given()
        .body(patch)
        .patch(endpoints.postById(postId));

      expect(response.status).toBe(200);
    }

    logger.info('✓ Multiple PATCH operations completed on same resource');
  });

  test('PATCH /posts/{id} - Response Content-Type validation', async () => {
    const postId = 1;
    const payload = { title: 'Content Type Test' };

    const response = await restClient
      .given()
      .header('Content-Type', 'application/json')
      .body(payload)
      .patch(endpoints.postById(postId));

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');

    logger.info('✓ Response Content-Type validated');
  });

  test('PATCH /posts/{id} - Update with empty string value', async () => {
    const postId = 5;
    const payload = { body: '' };

    const response = await restClient
      .given()
      .body(payload)
      .patch(endpoints.postById(postId));

    expect(response.status).toBe(200);

    const patchedPost = response.body as Record<string, unknown>;
    expect(patchedPost.body).toBe('');

    logger.info('✓ PATCH with empty string value handled');
  });
});
