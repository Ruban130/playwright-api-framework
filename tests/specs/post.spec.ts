import { test, expect } from '@playwright/test';
import { RestClient } from '../../src/utils/rest-client.js';
import { testDataGenerator } from '../../src/utils/test-data-generator.js';
import { schemaValidator } from '../../src/utils/schema-validator.js';
import { apiConfig, endpoints } from '../../src/config/api-config.js';
import { newPostPayload } from '../fixtures/test-data.js';
import logger from '../../src/utils/logger.js';

test.describe('POST API Tests @smoke', () => {
  let restClient: RestClient;

  test.beforeEach(async ({ request }) => {
    restClient = new RestClient(request, apiConfig);
    logger.info('Test setup: RestClient initialized for POST tests');
  });

  test.afterEach(() => {
    restClient.reset();
  });

  test('POST /posts - Create new post with valid data', async () => {
    const payload = newPostPayload;

    const response = await restClient
      .given()
      .body(payload)
      .post(endpoints.posts);

    expect(response.status).toBe(201);

    const createdPost = response.body as Record<string, unknown>;
    expect(createdPost).toHaveProperty('id');
    expect(createdPost.title).toBe(payload.title);
    expect(createdPost.body).toBe(payload.body);
    expect(createdPost.userId).toBe(payload.userId);

    logger.info(`✓ Post created with ID: ${createdPost.id}`);
  });

  test('POST /posts - Create post with generated test data', async () => {
    const generatedPost = testDataGenerator.generatePost({ userId: 1 });

    const response = await restClient
      .given()
      .body(generatedPost)
      .post(endpoints.posts);

    expect(response.status).toBe(201);

    const createdPost = response.body as Record<string, unknown>;
    expect(createdPost.title).toBe(generatedPost.title);

    logger.info('✓ Post created with generated test data');
  });

  test('POST /posts - Validate post schema on creation', async () => {
    const payload = newPostPayload;

    const response = await restClient
      .given()
      .body(payload)
      .post(endpoints.posts);

    expect(response.status).toBe(201);

    const validationResult = schemaValidator.validate(schemaValidator.postSchema, response.body);
    expect(validationResult.isValid).toBe(true);

    logger.info('✓ Created post schema validation passed');
  });

  test('POST /posts - Create post with custom headers', async () => {
    const payload = newPostPayload;

    const response = await restClient
      .given()
      .header('X-Custom-Header', 'test-value')
      .header('X-Test-ID', '12345')
      .body(payload)
      .post(endpoints.posts);

    expect(response.status).toBe(201);

    logger.info('✓ Post created with custom headers');
  });

  test('POST /posts - Response contains expected properties', async () => {
    const payload = newPostPayload;

    const response = await restClient
      .given()
      .body(payload)
      .post(endpoints.posts);

    expect(response.status).toBe(201);

    const createdPost = response.body as Record<string, unknown>;
    expect(createdPost).toHaveProperty('id');
    expect(createdPost).toHaveProperty('title');
    expect(createdPost).toHaveProperty('body');
    expect(createdPost).toHaveProperty('userId');

    logger.info('✓ All expected properties present in response');
  });

  test('POST /posts - Create multiple posts in sequence @regression', async () => {
    const postsToCreate = testDataGenerator.generatePosts(3, { userId: 2 });
    const createdIds: number[] = [];

    for (const post of postsToCreate) {
      const response = await restClient
        .given()
        .body(post)
        .post(endpoints.posts);

      expect(response.status).toBe(201);

      const createdPost = response.body as Record<string, unknown>;
      createdIds.push(createdPost.id as number);
    }

    expect(createdIds.length).toBe(3);
    logger.info(`✓ Created ${createdIds.length} posts sequentially`);
  });

  test('POST /posts - Content-Type header validation', async () => {
    const payload = newPostPayload;

    const response = await restClient
      .given()
      .header('Content-Type', 'application/json')
      .body(payload)
      .post(endpoints.posts);

    expect(response.status).toBe(201);
    expect(response.headers['content-type']).toContain('application/json');

    logger.info('✓ Content-Type header validated');
  });

  test('POST /posts - Verify response ID is numeric', async () => {
    const payload = newPostPayload;

    const response = await restClient
      .given()
      .body(payload)
      .post(endpoints.posts);

    expect(response.status).toBe(201);

    const createdPost = response.body as Record<string, unknown>;
    expect(typeof createdPost.id).toBe('number');
    expect(createdPost.id).toBeGreaterThan(0);

    logger.info(`✓ Created post ID is numeric: ${createdPost.id}`);
  });
});
