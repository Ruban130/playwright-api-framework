import { test, expect } from '@playwright/test';
import { RestClient } from '../../src/utils/rest-client.js';
import { testDataGenerator } from '../../src/utils/test-data-generator.js';
import { schemaValidator } from '../../src/utils/schema-validator.js';
import { apiConfig, endpoints } from '../../src/config/api-config.js';
import { updatedPostPayload } from '../fixtures/test-data.js';
import logger from '../../src/utils/logger.js';

test.describe('PUT API Tests @regression', () => {
  let restClient: RestClient;

  test.beforeEach(async ({ request }) => {
    restClient = new RestClient(request, apiConfig);
    logger.info('Test setup: RestClient initialized for PUT tests');
  });

  test.afterEach(() => {
    restClient.reset();
  });

  test('PUT /posts/{id} - Update existing post with full replacement', async () => {
    const postId = 1;
    const payload = updatedPostPayload;

    const response = await restClient
      .given()
      .body(payload)
      .put(endpoints.postById(postId));

    expect(response.status).toBe(200);

    const updatedPost = response.body as Record<string, unknown>;
    expect(updatedPost.id).toBe(payload.id);
    expect(updatedPost.title).toBe(payload.title);
    expect(updatedPost.body).toBe(payload.body);

    logger.info(`✓ Post ${postId} updated successfully`);
  });

  test('PUT /posts/{id} - Validate updated post schema', async () => {
    const postId = 1;
    const payload = updatedPostPayload;

    const response = await restClient
      .given()
      .body(payload)
      .put(endpoints.postById(postId));

    expect(response.status).toBe(200);

    const validationResult = schemaValidator.validate(schemaValidator.postSchema, response.body);
    expect(validationResult.isValid).toBe(true);

    logger.info('✓ Updated post schema validation passed');
  });

  test('PUT /posts/{id} - Update post with custom headers', async () => {
    const postId = 1;
    const payload = updatedPostPayload;

    const response = await restClient
      .given()
      .header('X-Update-Version', '1.0')
      .header('X-Updated-By', 'api-automation')
      .body(payload)
      .put(endpoints.postById(postId));

    expect(response.status).toBe(200);

    logger.info('✓ Post updated with custom headers');
  });

  test('PUT /posts/{id} - Full replacement verification', async () => {
    const postId = 1;
    const payload = updatedPostPayload;

    const response = await restClient
      .given()
      .body(payload)
      .put(endpoints.postById(postId));

    expect(response.status).toBe(200);

    const updatedPost = response.body as Record<string, unknown>;
    expect(updatedPost).toHaveProperty('id');
    expect(updatedPost).toHaveProperty('title');
    expect(updatedPost).toHaveProperty('body');
    expect(updatedPost).toHaveProperty('userId');

    logger.info('✓ All properties verified after full replacement');
  });

  test('PUT /posts/{id} - Update with generated test data @smoke', async () => {
    const postId = 1;
    const generatedPost = testDataGenerator.generatePost({ userId: 1, id: postId });

    const response = await restClient
      .given()
      .body(generatedPost)
      .put(endpoints.postById(postId));

    expect(response.status).toBe(200);

    logger.info('✓ Post updated with generated test data');
  });

  test('PUT /posts/{id} - Verify title and body are updated', async () => {
    const postId = 1;
    const payload = {
      id: postId,
      title: 'Completely New Title',
      body: 'Completely new body content here',
      userId: 1,
    };

    const response = await restClient
      .given()
      .body(payload)
      .put(endpoints.postById(postId));

    expect(response.status).toBe(200);

    const updatedPost = response.body as Record<string, unknown>;
    expect(updatedPost.title).toBe(payload.title);
    expect(updatedPost.body).toBe(payload.body);

    logger.info('✓ Title and body updates verified');
  });

  test('PUT /posts/{id} - Response Content-Type validation', async () => {
    const postId = 1;
    const payload = updatedPostPayload;

    const response = await restClient
      .given()
      .header('Content-Type', 'application/json')
      .body(payload)
      .put(endpoints.postById(postId));

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');

    logger.info('✓ Response Content-Type validated');
  });

  test('PUT /posts/{id} - Update same post multiple times @regression', async () => {
    const postId = 1;

    for (let i = 0; i < 3; i++) {
      const payload = {
        id: postId,
        title: `Updated Title - Iteration ${i + 1}`,
        body: `Updated Body - Iteration ${i + 1}`,
        userId: 1,
      };

      const response = await restClient
        .given()
        .body(payload)
        .put(endpoints.postById(postId));

      expect(response.status).toBe(200);

      const updatedPost = response.body as Record<string, unknown>;
      expect(updatedPost.title).toBe(payload.title);
    }

    logger.info('✓ Same post updated successfully 3 times');
  });

  test('PUT /posts/{id} - Empty userId handling', async () => {
    const postId = 1;
    const payload = {
      id: postId,
      title: 'Test Title',
      body: 'Test Body',
      userId: 0,
    };

    const response = await restClient
      .given()
      .body(payload)
      .put(endpoints.postById(postId));

    expect(response.status).toBe(200);

    logger.info('✓ PUT request handled edge case (userId: 0)');
  });
});
