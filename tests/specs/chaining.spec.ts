import { test, expect } from '@playwright/test';
import { RestClient } from '../../src/utils/rest-client.js';
import { testDataGenerator } from '../../src/utils/test-data-generator.js';
import { apiConfig, endpoints } from '../../src/config/api-config.js';
import logger from '../../src/utils/logger.js';

test.describe('Request Chaining Tests @smoke', () => {
  let restClient: RestClient;

  test.beforeEach(async ({ request }) => {
    restClient = new RestClient(request, apiConfig);
    logger.info('Test setup: RestClient initialized for chaining tests');
  });

  test.afterEach(() => {
    restClient.reset();
  });

  test('Create post, retrieve it, update it, then delete it - Complete workflow', async () => {
    // Step 1: Create a new post
    const newPost = {
      title: 'Chained Test Post',
      body: 'This post was created via API chaining workflow',
      userId: 1,
    };

    const createResponse = await restClient
      .given()
      .body(newPost)
      .post(endpoints.posts);

    expect(createResponse.status).toBe(201);

    const createdPost = createResponse.body as Record<string, unknown>;
    const createdPostId = createdPost.id as number;

    logger.info(`Step 1: Created post with ID: ${createdPostId}`);

    // Step 2: Retrieve the created post
    restClient.reset();
    const getResponse = await restClient.get(endpoints.postById(createdPostId));

    expect(getResponse.status).toBe(200);

    const retrievedPost = getResponse.body as Record<string, unknown>;
    expect(retrievedPost.id).toBe(createdPostId);
    expect(retrievedPost.title).toBe(newPost.title);

    logger.info(`Step 2: Retrieved post with ID: ${createdPostId}`);

    // Step 3: Update the retrieved post
    restClient.reset();
    const updatePayload = {
      id: createdPostId,
      title: 'Updated via Chaining: ' + newPost.title,
      body: 'Updated body via chaining workflow',
      userId: 1,
    };

    const updateResponse = await restClient
      .given()
      .body(updatePayload)
      .put(endpoints.postById(createdPostId));

    expect(updateResponse.status).toBe(200);

    const updatedPost = updateResponse.body as Record<string, unknown>;
    expect(updatedPost.title).toBe(updatePayload.title);

    logger.info(`Step 3: Updated post with ID: ${createdPostId}`);

    // Step 4: Delete the post
    restClient.reset();
    const deleteResponse = await restClient.delete(endpoints.postById(createdPostId));

    expect(deleteResponse.status).toBe(200);

    logger.info(`Step 4: Deleted post with ID: ${createdPostId}`);
    logger.info('✓ Complete workflow (Create -> Read -> Update -> Delete) passed');
  });

  test('Create multiple posts, filter by user, then update all', async () => {
    const userId = 5;

    // Step 1: Create multiple posts for same user
    const postIds: number[] = [];

    for (let i = 0; i < 3; i++) {
      const payload = {
        title: `Chained Post ${i + 1}`,
        body: `Body for post ${i + 1}`,
        userId,
      };

      const response = await restClient
        .given()
        .body(payload)
        .post(endpoints.posts);

      expect(response.status).toBe(201);

      const createdPost = response.body as Record<string, unknown>;
      postIds.push(createdPost.id as number);

      restClient.reset();
    }

    logger.info(`Step 1: Created ${postIds.length} posts for user ${userId}`);

    // Step 2: Retrieve posts by user ID
    restClient.reset();
    const getResponse = await restClient.get(endpoints.postsByUserId(userId));

    expect(getResponse.status).toBe(200);
    expect(Array.isArray(getResponse.body)).toBe(true);

    logger.info(`Step 2: Retrieved posts for user ${userId}`);

    // Step 3: Update all created posts
    for (const postId of postIds) {
      const updatePayload = {
        id: postId,
        title: 'Updated in Batch',
        body: 'All updated together',
        userId,
      };

      const response = await restClient
        .given()
        .body(updatePayload)
        .put(endpoints.postById(postId));

      expect(response.status).toBe(200);

      restClient.reset();
    }

    logger.info(`Step 3: Updated all ${postIds.length} posts`);
    logger.info('✓ Batch create, retrieve, and update workflow passed');
  });

  test('Get user, retrieve their posts, get comments for each post', async () => {
    const userId = 1;

    // Step 1: Get user details
    const userResponse = await restClient.get(endpoints.userById(userId));

    expect(userResponse.status).toBe(200);

    const user = userResponse.body as Record<string, unknown>;
    expect(user.id).toBe(userId);

    logger.info(`Step 1: Retrieved user: ${user.name}`);

    // Step 2: Get all posts by this user
    restClient.reset();
    const postsResponse = await restClient.get(endpoints.postsByUserId(userId));

    expect(postsResponse.status).toBe(200);

    const posts = postsResponse.body as Record<string, unknown>[];
    logger.info(`Step 2: Retrieved ${posts.length} posts for user`);

    // Step 3: Get comments for each post
    const allComments: unknown[] = [];

    for (const post of posts.slice(0, 2)) {
      // Limit to first 2 posts for performance
      restClient.reset();

      const commentsResponse = await restClient.get(
        endpoints.commentsByPostId(post.id as number)
      );

      expect(commentsResponse.status).toBe(200);

      const comments = commentsResponse.body as Record<string, unknown>[];
      allComments.push(...comments);

      logger.info(`  - Post ${post.id}: ${comments.length} comments`);
    }

    logger.info(`Step 3: Retrieved total ${allComments.length} comments across posts`);
    logger.info('✓ User -> Posts -> Comments workflow passed');
  });

  test('Create post, patch it, verify with GET, then delete', async () => {
    // Step 1: Create post
    const payload = {
      title: 'Original Title',
      body: 'Original Body',
      userId: 3,
    };

    const createResponse = await restClient
      .given()
      .body(payload)
      .post(endpoints.posts);

    expect(createResponse.status).toBe(201);

    const createdPost = createResponse.body as Record<string, unknown>;
    const postId = createdPost.id as number;

    logger.info(`Step 1: Created post ${postId}`);

    // Step 2: Patch the post
    restClient.reset();

    const patchPayload = {
      title: 'Patched Title',
    };

    const patchResponse = await restClient
      .given()
      .body(patchPayload)
      .patch(endpoints.postById(postId));

    expect(patchResponse.status).toBe(200);

    logger.info(`Step 2: Patched post ${postId}`);

    // Step 3: Verify patch with GET
    restClient.reset();

    const getResponse = await restClient.get(endpoints.postById(postId));

    expect(getResponse.status).toBe(200);

    const verifiedPost = getResponse.body as Record<string, unknown>;
    expect(verifiedPost.title).toBe(patchPayload.title);

    logger.info(`Step 3: Verified patch on post ${postId}`);

    // Step 4: Delete
    restClient.reset();

    const deleteResponse = await restClient.delete(endpoints.postById(postId));

    expect(deleteResponse.status).toBe(200);

    logger.info(`Step 4: Deleted post ${postId}`);
    logger.info('✓ Create -> Patch -> Verify -> Delete workflow passed');
  });

  test('Request chaining with generated test data workflow @regression', async () => {
    // Step 1: Generate and create post
    const generatedPost = testDataGenerator.generatePost({ userId: 7 });

    const createResponse = await restClient
      .given()
      .body(generatedPost)
      .post(endpoints.posts);

    expect(createResponse.status).toBe(201);

    const createdPost = createResponse.body as Record<string, unknown>;
    const postId = createdPost.id as number;

    logger.info(`Step 1: Created post with generated data`);

    // Step 2: Generate and update
    restClient.reset();

    const updatePayload = {
      id: postId,
      title: 'Updated: ' + testDataGenerator.generateString(20),
      body: 'Updated body with generated content',
      userId: 7,
    };

    const updateResponse = await restClient
      .given()
      .body(updatePayload)
      .put(endpoints.postById(postId));

    expect(updateResponse.status).toBe(200);

    logger.info(`Step 2: Updated post with generated data`);

    // Step 3: Verify and patch
    restClient.reset();

    const patchPayload = {
      body: 'Final patched body: ' + testDataGenerator.generateString(15),
    };

    const patchResponse = await restClient
      .given()
      .body(patchPayload)
      .patch(endpoints.postById(postId));

    expect(patchResponse.status).toBe(200);

    logger.info(`Step 3: Patched post with generated data`);

    logger.info('✓ Workflow with generated test data passed');
  });
});
