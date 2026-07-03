# Quick Start Guide

Get up and running with the Playwright API Automation Framework in 5 minutes.

## Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git (optional, for version control)

## Installation

### 1. Clone or Extract Repository

```bash
# If cloned from GitHub
git clone https://github.com/yourusername/playwright-api-automation-framework.git
cd playwright-api-automation-framework

# Or if extracted from ZIP
cd playwright-api-automation-framework
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages including:
- Playwright 1.43.1
- TypeScript 5.3.3
- Testing utilities and dependencies

### 3. Setup Environment

```bash
cp .env.example .env
```

Default configuration uses JSONPlaceholder API (no credentials needed).

### 4. Run First Test

```bash
npm run test:smoke
```

Expected output:
```
✓ GET /users - Retrieve all users
✓ POST /posts - Create new post with valid data
✓ PUT /posts/{id} - Update existing post with full replacement
✓ PATCH /posts/{id} - Partial update with single field
✓ DELETE /posts/{id} - Delete existing post
✓ Create post, retrieve it, update it, then delete it - Complete workflow
```

## Common Commands

```bash
# Run all tests
npm test

# Run smoke tests (quick validation)
npm run test:smoke

# Run regression tests (full suite)
npm run test:regression

# Run tests in parallel (faster)
npm run test:parallel

# Debug tests interactively
npm run test:debug

# View HTML report
npm run test:report

# Check code quality
npm run lint
npm run type-check
```

## Project Structure

```
📦 Framework
├── 📂 src/                 # Source code
│   ├── utils/             # Reusable utilities
│   ├── config/            # API configuration
│   └── types/             # TypeScript interfaces
├── 📂 tests/              # Test specifications
│   ├── specs/             # Test files
│   └── fixtures/          # Mock data
├── 📂 .github/            # GitHub workflows
├── 📂 docs/               # Documentation
├── README.md              # Full documentation
└── package.json           # Dependencies
```

## Key Features

### 1. Fluent REST API Client

```typescript
const response = await restClient
  .given()
  .header('X-Custom-Header', 'value')
  .body(payload)
  .post(endpoints.users);

expect(response.status).toBe(201);
```

### 2. Schema Validation

```typescript
const validation = schemaValidator.validate(schema, response.body);
expect(validation.isValid).toBe(true);
```

### 3. Test Data Generation

```typescript
const user = testDataGenerator.generateUser();
const posts = testDataGenerator.generatePosts(5);
```

### 4. Request Chaining

```typescript
// Create → Read → Update → Delete workflow
const createResponse = await restClient.post(endpoints.users);
const getResponse = await restClient.get(endpoints.userById(id));
const updateResponse = await restClient.put(endpoints.userById(id));
const deleteResponse = await restClient.delete(endpoints.userById(id));
```

## Configuration

### Change API Endpoint

Edit `.env`:

```env
# Default: JSONPlaceholder
API_BASE_URL=https://jsonplaceholder.typicode.com

# Alternative: ReqRes
API_BASE_URL=https://reqres.in/api
```

### Configure Test Settings

```env
# Logging level
LOG_LEVEL=info

# Request timeout
TEST_TIMEOUT=30000

# Retry count
RETRY_COUNT=2
```

## Test Execution Options

### Run Specific Test File

```bash
npx playwright test tests/specs/get.spec.ts
```

### Run Tests Matching Pattern

```bash
npx playwright test -g "POST /posts"
```

### Run with Debug UI

```bash
npm run test:ui
```

### Run with Detailed Logging

```bash
LOG_LEVEL=debug npm test
```

## Docker Execution

### Build and Run

```bash
# Build Docker image
docker build -t playwright-api-tests:latest .

# Run tests in container
docker-compose up --abort-on-container-exit
```

## Viewing Results

### HTML Report

```bash
npm run test:report
```

Opens detailed HTML report with:
- Test results and timing
- Screenshots of failures
- Video recordings
- Error details

### Trace Viewer

```bash
npm run test:trace
```

Interactive trace viewer showing:
- Network requests
- Timeline of actions
- Screenshots
- Logs and errors

## Test File Structure

Example test file (`tests/specs/get.spec.ts`):

```typescript
import { test, expect } from '@playwright/test';
import { RestClient } from '../../src/utils/rest-client.js';

test.describe('GET API Tests @smoke', () => {
  let restClient: RestClient;

  test.beforeEach(async ({ request }) => {
    restClient = new RestClient(request, apiConfig);
  });

  test('GET /users - Retrieve all users', async () => {
    const response = await restClient.get(endpoints.users);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

## Code Quality

### Lint Code

```bash
npm run lint              # Check for errors
npm run lint:fix          # Fix auto-fixable errors
```

### Format Code

```bash
npm run format            # Format with Prettier
npm run format:check      # Check formatting
```

### Type Check

```bash
npm run type-check        # TypeScript validation
```

## Troubleshooting

### Tests Timeout

```bash
# Increase timeout
TEST_TIMEOUT=60000 npm test
```

### API Unreachable

```bash
# Verify API is accessible
curl https://jsonplaceholder.typicode.com/posts/1

# Check your network connection
```

### Port Already in Use (Docker)

```bash
# Kill existing containers
docker kill $(docker ps -q)

# Or use different port in docker-compose.yml
```

### ESLint Errors

```bash
# Fix errors automatically
npm run lint:fix
```

## Authentication (Optional)

For APIs requiring authentication, use AuthManager:

```typescript
import { authManager } from '../src/utils/auth.js';

// Bearer token
const headers = authManager.generateBearerHeader(token);

// Basic auth
const headers = authManager.generateBasicAuthHeader(username, password);

// OAuth
authManager.setToken({
  accessToken: token,
  tokenType: 'Bearer',
  expiresIn: 3600,
});
const headers = authManager.generateAuthorizationHeader();
```

## Adding New Tests

### 1. Create Test File

```typescript
// tests/specs/new.spec.ts
import { test, expect } from '@playwright/test';
import { RestClient } from '../../src/utils/rest-client.js';

test.describe('My Tests @smoke', () => {
  test('Test description', async ({ request }) => {
    // Your test here
  });
});
```

### 2. Add Test Data (if needed)

```typescript
// tests/fixtures/test-data.ts
export const myTestPayload = {
  field1: 'value1',
  field2: 'value2',
};
```

### 3. Run Your Test

```bash
npx playwright test tests/specs/new.spec.ts
```

## Next Steps

- 📖 Read [README.md](./README.md) for complete documentation
- 🏗️ Check [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for design details
- 🎯 See [BEST_PRACTICES.md](./docs/BEST_PRACTICES.md) for coding standards
- 🐛 Visit [DEBUGGING.md](./docs/DEBUGGING.md) for debugging techniques
- ▶️ Check [RUNNING_TESTS.md](./docs/RUNNING_TESTS.md) for execution options

## Support

For questions or issues:

1. Check existing [documentation](./docs/)
2. Review [examples in tests](./tests/specs/)
3. See [troubleshooting section](#troubleshooting)

## Key Files to Know

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `playwright.config.ts` | Test configuration |
| `tsconfig.json` | TypeScript settings |
| `src/utils/rest-client.ts` | HTTP client implementation |
| `.env` | Environment variables |
| `tests/specs/*.spec.ts` | Test files |
| `docs/*.md` | Detailed documentation |

## Common Tasks

### Change Test Timeout
Edit `playwright.config.ts`:
```typescript
timeout: 60 * 1000, // 60 seconds
```

### Add Custom Header to All Requests
Edit `src/config/api-config.ts`:
```typescript
headers: {
  'Content-Type': 'application/json',
  'X-Custom-Header': 'value',
}
```

### Filter Tests by Tag
```bash
npx playwright test --grep @smoke    # Smoke tests only
npx playwright test --grep @regression # Regression tests only
```

### Generate New Test Data
```typescript
const user = testDataGenerator.generateUser({ name: 'Custom Name' });
const post = testDataGenerator.generatePost({ userId: 1 });
```

## Performance Tips

1. **Use Parallel Execution** for faster results: `npm run test:parallel`
2. **Run Smoke Tests First** to catch issues early: `npm run test:smoke`
3. **Enable Caching** for faster installations: `npm ci`
4. **Filter Tests** to run only what you need: `npx playwright test -g "pattern"`

## Framework Statistics

- **70+ API Test Cases** across all HTTP methods
- **Schema Validation** for 3+ resource types
- **Request Chaining** workflows with multi-step operations
- **100% TypeScript** with strict typing
- **Zero-Config** setup for JSONPlaceholder API
- **Docker Support** for containerized execution
- **GitHub Actions** CI/CD integration
- **Full Documentation** with examples

---

**Ready to start testing?** Run `npm run test:smoke` now! 🚀
