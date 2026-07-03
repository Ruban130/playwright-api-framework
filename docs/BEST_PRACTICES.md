# Best Practices

Enterprise-grade best practices for API automation testing.

## Test Design

### 1. Single Responsibility

Each test should verify one behavior:

```typescript
// ✅ Good - Single responsibility
test('POST /posts - Create post returns 201 status', async ({ request }) => {
  const response = await restClient.given().body(payload).post(endpoints.posts);
  expect(response.status).toBe(201);
});

test('POST /posts - Created post has correct title', async ({ request }) => {
  const response = await restClient.given().body(payload).post(endpoints.posts);
  expect(response.body.title).toBe(payload.title);
});

// ❌ Bad - Multiple responsibilities
test('POST /posts - Create, verify, and update', async ({ request }) => {
  // Too many things verified in one test
});
```

### 2. Clear Test Names

Use descriptive names that explain what is being tested:

```typescript
// ✅ Good
test('GET /users/{id} - Non-existent user returns 404', async () => {});

test('POST /posts - Invalid email format returns 400', async () => {});

// ❌ Bad
test('Test user endpoint', async () => {});

test('API test', async () => {});
```

### 3. Use Test Tags

Organize tests for selective execution:

```typescript
// Smoke tests
test('GET /users - Retrieve all users @smoke', async () => {});

// Regression tests
test('GET /users/{id} - Validate user schema @regression', async () => {});

// Run smoke tests only
// npm run test:smoke
```

### 4. Arrange-Act-Assert Pattern

Structure tests for clarity:

```typescript
test('POST /posts - Create post with valid data', async ({ request }) => {
  // Arrange
  const restClient = new RestClient(request, apiConfig);
  const payload = { title: 'Test', body: 'Body', userId: 1 };

  // Act
  const response = await restClient.given().body(payload).post(endpoints.posts);

  // Assert
  expect(response.status).toBe(201);
  expect(response.body.title).toBe(payload.title);
});
```

## Assertion Best Practices

### 1. Specific Assertions

```typescript
// ✅ Good - Specific
expect(response.status).toBe(200);
expect(response.body.id).toBe(1);
expect(response.headers['content-type']).toContain('application/json');

// ❌ Bad - Too generic
expect(response).toBeTruthy();
```

### 2. Multiple Assertions

Group related assertions together:

```typescript
// ✅ Good - Logical grouping
test('GET /posts/{id} - Verify complete response', async () => {
  const response = await restClient.get(endpoints.postById(1));

  // Status and content type
  expect(response.status).toBe(200);
  expect(response.headers['content-type']).toContain('application/json');

  // Response structure
  expect(response.body).toHaveProperty('id');
  expect(response.body).toHaveProperty('title');

  // Data validation
  expect(response.body.id).toBe(1);
  expect(typeof response.body.title).toBe('string');
});
```

### 3. Schema Validation

Always validate response schema:

```typescript
test('GET /posts/{id} - Validate response schema', async () => {
  const response = await restClient.get(endpoints.postById(1));

  const validation = schemaValidator.validate(schemaValidator.postSchema, response.body);
  expect(validation.isValid).toBe(true);
});
```

## Test Data Management

### 1. Use Fixtures

Centralize test data:

```typescript
// ✅ Good - Centralized in fixtures
import { newPostPayload } from '../fixtures/test-data.js';

test('POST /posts - Create post', async () => {
  const response = await restClient.given().body(newPostPayload).post(endpoints.posts);
  expect(response.status).toBe(201);
});

// ❌ Bad - Scattered data
test('POST /posts - Create post', async () => {
  const payload = { title: 'Test', body: 'Body', userId: 1 };
  // ...
});
```

### 2. Generate Realistic Data

Use Faker.js for variety:

```typescript
test('POST /posts - Create with generated data', async () => {
  const post = testDataGenerator.generatePost({ userId: 1 });
  const response = await restClient.given().body(post).post(endpoints.posts);
  expect(response.status).toBe(201);
});
```

### 3. Maintain Data Independence

Each test should be independent:

```typescript
// ✅ Good - Independent tests
test('POST /posts - Create first post', async () => {
  const response = await restClient.given().body(payload1).post(endpoints.posts);
  expect(response.status).toBe(201);
});

test('POST /posts - Create second post', async () => {
  const response = await restClient.given().body(payload2).post(endpoints.posts);
  expect(response.status).toBe(201);
});

// ❌ Bad - Test dependency
let postId;
test('POST /posts - Create post', async () => {
  const response = await restClient.given().body(payload).post(endpoints.posts);
  postId = response.body.id;
});

test('GET /posts/{id} - Get post', async () => {
  // Depends on previous test
  const response = await restClient.get(endpoints.postById(postId));
});
```

## Code Quality

### 1. Type Safety

Always use TypeScript types:

```typescript
// ✅ Good - Explicit types
export async function validatePost(response: ApiResponse): void {
  const post = response.body as Post;
  expect(post.id).toBe(1);
}

// ❌ Bad - Any type
export async function validatePost(response: any): void {
  expect(response.body.id).toBe(1);
}
```

### 2. Error Handling

Handle potential errors:

```typescript
// ✅ Good - Error handling
test('GET /posts/{id} - Handle network error gracefully', async () => {
  try {
    const response = await restClient.get(endpoints.postById(1));
    expect(response.status).toBe(200);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Network error:', error.message);
    }
    throw error;
  }
});
```

### 3. Avoid Hard-coded Values

Use constants and configuration:

```typescript
// ✅ Good - Using config
import { apiConfig, endpoints } from '../src/config/api-config.js';

test('GET /posts', async () => {
  const response = await restClient.get(endpoints.posts);
  expect(response.status).toBe(200);
});

// ❌ Bad - Hard-coded values
test('GET /posts', async () => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts');
  expect(response.status).toBe(200);
});
```

## Maintenance

### 1. Keep Tests Simple

Minimize complexity:

```typescript
// ✅ Good - Simple and readable
test('POST /posts - Create post', async () => {
  const response = await restClient.given()
    .body(newPostPayload)
    .post(endpoints.posts);
  
  expect(response.status).toBe(201);
  expect(response.body.title).toBe(newPostPayload.title);
});

// ❌ Bad - Overly complex
test('POST /posts - Complex logic', async () => {
  // Multiple nested conditions
  // Complex data transformations
  // Difficult to understand
});
```

### 2. DRY Principle

Don't repeat code:

```typescript
// ✅ Good - Reusable helper
async function createAndVerifyPost(payload: Post): Promise<ApiResponse> {
  const response = await restClient.given().body(payload).post(endpoints.posts);
  expect(response.status).toBe(201);
  return response;
}

test('POST /posts - Create first post', async () => {
  const response = await createAndVerifyPost(payload1);
  expect(response.body.title).toBe(payload1.title);
});

// ❌ Bad - Repeated code
test('POST /posts - Create first post', async () => {
  let response = await restClient.given().body(payload1).post(endpoints.posts);
  expect(response.status).toBe(201);
});

test('POST /posts - Create second post', async () => {
  let response = await restClient.given().body(payload2).post(endpoints.posts);
  expect(response.status).toBe(201);
});
```

### 3. Update Tests with Code Changes

Keep tests aligned with implementation:

```typescript
// When API changes, update tests accordingly
// ❌ Bad - Outdated test
test('POST /posts - Expected response format', async () => {
  const response = await restClient.given().body(payload).post(endpoints.posts);
  // Old field that no longer exists
  expect(response.body.publishedDate).toBeDefined();
});

// ✅ Good - Updated test
test('POST /posts - Expected response format', async () => {
  const response = await restClient.given().body(payload).post(endpoints.posts);
  // Current field
  expect(response.body.createdAt).toBeDefined();
});
```

## Performance Optimization

### 1. Parallel Execution

Run independent tests in parallel:

```bash
# 4 workers by default
npm test

# Explicit worker count
npx playwright test --workers=8
```

### 2. Selective Testing

Run relevant tests during development:

```bash
# Only smoke tests during development
npm run test:smoke

# Full suite before commit
npm run test:regression
```

### 3. Avoid Unnecessary Retries

Configure retries wisely:

```typescript
// In playwright.config.ts
retries: process.env.CI ? 2 : 0, // Retry only in CI
```

## Logging and Reporting

### 1. Meaningful Logs

Log important information:

```typescript
test('POST /posts - Create post', async () => {
  logger.info('Creating post with payload:', newPostPayload);
  
  const response = await restClient.given().body(newPostPayload).post(endpoints.posts);
  
  logger.info('Post created successfully:', response.body.id);
  expect(response.status).toBe(201);
});
```

### 2. Error Reporting

Clearly report errors:

```typescript
test('GET /posts/{id} - Verify post exists', async () => {
  const response = await restClient.get(endpoints.postById(1));
  
  if (response.status !== 200) {
    logger.error('Failed to retrieve post', {
      status: response.status,
      statusText: response.statusText,
      body: response.body,
    });
  }
  
  expect(response.status).toBe(200);
});
```

## Security

### 1. Environment Variables

Never hard-code secrets:

```typescript
// ✅ Good - Using environment variables
const token = process.env.API_TOKEN;
const authHeader = authManager.generateBearerHeader(token);

// ❌ Bad - Hard-coded secrets
const authHeader = { Authorization: 'Bearer secret123' };
```

### 2. Sensitive Data in Logs

Don't log sensitive information:

```typescript
// ✅ Good - Mask sensitive data
logger.info('Token used:', token.substring(0, 10) + '...');

// ❌ Bad - Logging full token
logger.info('Token used:', token);
```

## Documentation

### 1. Comment Complex Logic

Add comments for unclear code:

```typescript
// ✅ Good - Clear comment
test('POST /posts - Verify idempotency', async () => {
  // Create two identical posts and verify they receive different IDs
  // This ensures the API generates unique identifiers
  const post1 = await restClient.given().body(payload).post(endpoints.posts);
  const post2 = await restClient.given().body(payload).post(endpoints.posts);
  
  expect(post1.body.id).not.toBe(post2.body.id);
});
```

### 2. Update Documentation

Keep README and docs updated with changes.

## Testing Checklist

Before committing code:

- ✅ Tests are independent
- ✅ Tests use clear names
- ✅ Tests follow AAA pattern
- ✅ Tests validate schema
- ✅ Tests use proper assertions
- ✅ Tests avoid hard-coded values
- ✅ Tests use fixtures for data
- ✅ Tests have appropriate tags
- ✅ Tests pass locally
- ✅ Code follows TypeScript best practices
- ✅ No hard-coded secrets
- ✅ Logging is appropriate
- ✅ Documentation is updated
