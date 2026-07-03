import { test, expect } from '@playwright/test';
import { RestClient } from '../../src/utils/rest-client.js';
import { schemaValidator } from '../../src/utils/schema-validator.js';
import { apiConfig, endpoints } from '../../src/config/api-config.js';
import { mockUsers, mockPosts } from '../fixtures/test-data.js';
import logger from '../../src/utils/logger.js';

test.describe('GET API Tests @smoke', () => {
  let restClient: RestClient;

  test.beforeEach(async ({ request }) => {
    restClient = new RestClient(request, apiConfig);
    logger.info('Test setup: RestClient initialized');
  });

  test.afterEach(() => {
    restClient.reset();
  });

  test('GET /users - Retrieve all users', async () => {
    const response = await restClient.get(endpoints.users);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect((response.body as unknown[]).length).toBeGreaterThan(0);

    logger.info(`✓ Retrieved ${(response.body as unknown[]).length} users`);
  });

  test('GET /users/{id} - Retrieve specific user by ID', async () => {
    const userId = 1;
    const response = await restClient.get(endpoints.userById(userId));

    expect(response.status).toBe(200);

    const user = response.body as Record<string, unknown>;
    expect(user.id).toBe(userId);
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');

    logger.info(`✓ Retrieved user with ID: ${userId}`);
  });

  test('GET /users/{id} - Validate user schema', async () => {
    const response = await restClient.get(endpoints.userById(1));

    const validationResult = schemaValidator.validate(schemaValidator.userSchema, response.body);
    expect(validationResult.isValid).toBe(true);

    logger.info('✓ User schema validation passed');
  });

  test('GET /posts - Retrieve all posts', async () => {
    const response = await restClient.get(endpoints.posts);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect((response.body as unknown[]).length).toBeGreaterThan(0);

    logger.info(`✓ Retrieved ${(response.body as unknown[]).length} posts`);
  });

  test('GET /posts?userId={id} - Retrieve posts by user ID', async () => {
    const userId = 1;
    const response = await restClient.get(endpoints.postsByUserId(userId));

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    const posts = response.body as Record<string, unknown>[];
    posts.forEach((post) => {
      expect(post.userId).toBe(userId);
    });

    logger.info(`✓ Retrieved ${posts.length} posts for user ${userId}`);
  });

  test('GET /posts/{id} - Retrieve specific post by ID', async () => {
    const postId = 1;
    const response = await restClient.get(endpoints.postById(postId));

    expect(response.status).toBe(200);

    const post = response.body as Record<string, unknown>;
    expect(post.id).toBe(postId);
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('body');

    logger.info(`✓ Retrieved post with ID: ${postId}`);
  });

  test('GET /posts/{id} - Validate post schema', async () => {
    const response = await restClient.get(endpoints.postById(1));

    const validationResult = schemaValidator.validate(schemaValidator.postSchema, response.body);
    expect(validationResult.isValid).toBe(true);

    logger.info('✓ Post schema validation passed');
  });

  test('GET /comments?postId={id} - Retrieve comments by post ID', async () => {
    const postId = 1;
    const response = await restClient.get(endpoints.commentsByPostId(postId));

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    const comments = response.body as Record<string, unknown>[];
    comments.forEach((comment) => {
      expect(comment.postId).toBe(postId);
    });

    logger.info(`✓ Retrieved ${comments.length} comments for post ${postId}`);
  });

  test('GET /comments/{id} - Retrieve specific comment by ID', async () => {
    const commentId = 1;
    const response = await restClient.get(endpoints.commentById(commentId));

    expect(response.status).toBe(200);

    const comment = response.body as Record<string, unknown>;
    expect(comment.id).toBe(commentId);
    expect(comment).toHaveProperty('email');
    expect(comment).toHaveProperty('body');

    logger.info(`✓ Retrieved comment with ID: ${commentId}`);
  });

  test('GET /comments/{id} - Validate comment schema', async () => {
    const response = await restClient.get(endpoints.commentById(1));

    const validationResult = schemaValidator.validate(schemaValidator.commentSchema, response.body);
    expect(validationResult.isValid).toBe(true);

    logger.info('✓ Comment schema validation passed');
  });

  test('GET - Verify response headers', async () => {
    const response = await restClient.get(endpoints.users);

    expect(response.headers['content-type']).toContain('application/json');
    expect(response.statusText).toBe('OK');

    logger.info('✓ Response headers validated');
  });

  test('GET /users - Query parameter filtering @regression', async () => {
    const response = await restClient.queryParam('id', '1').when();

    // Note: JSONPlaceholder may not support all query parameters
    // This test demonstrates query parameter usage
    expect(response.status).toBe(200);

    logger.info('✓ Query parameter filtering test completed');
  });
});
