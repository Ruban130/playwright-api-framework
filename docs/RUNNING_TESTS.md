# Running Tests

This guide covers all ways to execute tests in the framework.

## Prerequisites

```bash
npm install
npm run build
```

## Test Execution Commands

### All Tests

```bash
npm test
```

Runs all tests in the test suite with default configuration.

**Configuration:**
- Workers: 4 (parallel)
- Retries: 0 (local) / 2 (CI)
- Timeout: 30 seconds per test

### Smoke Tests Only

```bash
npm run test:smoke
```

Runs tests tagged with `@smoke` for quick validation.

**Use Case:** Quick smoke tests in CI/CD pipeline
**Expected Duration:** 30-60 seconds

### Regression Tests

```bash
npm run test:regression
```

Runs tests tagged with `@regression` for comprehensive validation.

**Use Case:** Full test suite before release
**Expected Duration:** 5-10 minutes

### Parallel Execution

```bash
npm run test:parallel
```

Runs all tests with 4 parallel workers.

**Configuration:**
- Workers: 4
- Best for: Local testing to speed up execution

### Serial Execution

```bash
npm run test:serial
```

Runs all tests sequentially with 1 worker.

**Configuration:**
- Workers: 1
- Best for: Debugging and trace analysis

### Debug Mode

```bash
npm run test:debug
```

Runs tests with Playwright Inspector for interactive debugging.

**Features:**
- Step through test execution
- Inspect locators and values
- Modify test on-the-fly

### UI Mode

```bash
npm run test:ui
```

Opens Playwright Test UI for visual test execution.

**Features:**
- Visual test runner
- Test filtering and search
- Live reload on code changes
- Trace viewer integration

## Advanced Test Execution

### Run Specific Test File

```bash
npx playwright test tests/specs/get.spec.ts
```

### Run Specific Test

```bash
npx playwright test -g "GET /users"
```

### Run Tests Matching Pattern

```bash
npx playwright test -g "POST.*create"
```

### Run Single Test with Debug

```bash
npm run test:debug -- tests/specs/get.spec.ts -g "GET /users"
```

### Run with Custom Config

```bash
npx playwright test --config=custom-playwright.config.ts
```

### Run with Custom Reporter

```bash
npx playwright test --reporter=html
npx playwright test --reporter=json
npx playwright test --reporter=junit
```

### Run with Trace

```bash
npx playwright test --trace on
npx playwright test --trace retain-on-failure
```

### Run with Video

```bash
npx playwright test --video on
npx playwright test --video retain-on-failure
```

### Run with Screenshots

```bash
npx playwright test --screenshot on
npx playwright test --screenshot only-on-failure
```

## Filtering Tests

### By Tag

```bash
# Smoke tests
npx playwright test --grep @smoke

# Regression tests
npx playwright test --grep @regression

# Exclude smoke tests
npx playwright test --grep-invert @smoke
```

### By File

```bash
npx playwright test tests/specs/post.spec.ts
```

### By Test Name

```bash
npx playwright test -g "POST /posts - Create new post"
```

### Multiple Filters

```bash
npx playwright test tests/specs/get.spec.ts -g "users"
```

## Test Reports

### View HTML Report

```bash
npm run test:report
```

Opens HTML report in default browser.

**Report Location:** `results/html-report/index.html`

### View Trace Files

```bash
npm run test:trace
```

Opens Playwright Trace Viewer for detailed test analysis.

**Trace Location:** `test-results/**/*.zip`

### View Test Results

```bash
cat results/results.json
```

JSON results file with detailed test execution data.

## Environment Configuration

### Set API URL

```bash
# JSONPlaceholder
API_BASE_URL=https://jsonplaceholder.typicode.com npm test

# ReqRes
API_BASE_URL=https://reqres.in/api npm test
```

### Set Log Level

```bash
LOG_LEVEL=debug npm test
LOG_LEVEL=info npm test
LOG_LEVEL=warn npm test
```

### Set Timeout

```bash
TEST_TIMEOUT=60000 npm test  # 60 seconds
```

### Set Retry Count

```bash
RETRY_COUNT=3 npm test
```

## Docker Testing

### Build Image

```bash
docker build -t playwright-api-tests:latest .
```

### Run in Docker

```bash
docker run playwright-api-tests:latest
```

### Run with Environment Variables

```bash
docker run \
  -e API_BASE_URL=https://jsonplaceholder.typicode.com \
  -e LOG_LEVEL=info \
  playwright-api-tests:latest
```

### Run with Docker Compose

```bash
docker-compose up --abort-on-container-exit
```

### Mount Volumes

```bash
docker run \
  -v $(pwd)/results:/app/results \
  playwright-api-tests:latest
```

## CI/CD Integration

### GitHub Actions

Tests run automatically on:
- Push to `main` or `develop`
- Pull requests to `main` or `develop`
- Daily schedule (2 AM UTC)

View results in **Actions** tab.

### Local CI Simulation

```bash
npm run type-check
npm run lint
npm run format:check
npm run test:smoke
npm run test:regression
```

## Test Execution Matrix

| Scenario | Command | Duration | Use Case |
|----------|---------|----------|----------|
| Quick check | `npm run test:smoke` | ~1 min | Pre-commit |
| Full suite | `npm test` | ~10 min | Before PR |
| Debug single | `npm run test:debug` | Variable | Troubleshooting |
| CI pipeline | `npm run test:smoke && npm run test:regression` | ~15 min | GitHub Actions |
| Parallel | `npm run test:parallel` | ~3 min | Local development |
| Serial | `npm run test:serial` | ~10 min | Trace analysis |

## Performance Tips

### Faster Execution

```bash
# Use parallel workers
npm run test:parallel

# Run only smoke tests
npm run test:smoke

# Run specific file
npx playwright test tests/specs/get.spec.ts
```

### Debugging

```bash
# Step through test
npm run test:debug

# Visual UI
npm run test:ui

# With traces
npx playwright test --trace on
```

### CI Optimization

```bash
# Install dependencies from cache
npm ci

# Run with 1 worker in CI
npx playwright test --workers=1
```

## Troubleshooting Test Execution

### Tests Timeout

```bash
# Increase timeout
TEST_TIMEOUT=60000 npm test

# Or edit playwright.config.ts
timeout: 60 * 1000
```

### API Unreachable

```bash
# Check API availability
curl https://jsonplaceholder.typicode.com/posts/1

# Switch to different API
API_BASE_URL=https://reqres.in/api npm test
```

### Flaky Tests

```bash
# Run with retries
RETRY_COUNT=3 npm test

# Run serially to eliminate race conditions
npm run test:serial
```

### Memory Issues

```bash
# Reduce workers
npx playwright test --workers=2

# Or use serial execution
npm run test:serial
```

### Port Conflicts

```bash
# Change port in docker-compose.yml
# Or run: docker kill $(docker ps -q)
```

## Next Steps

- Read [API_CONFIGURATION.md](./API_CONFIGURATION.md) for API setup
- See [DEBUGGING.md](./DEBUGGING.md) for debugging techniques
- Check [BEST_PRACTICES.md](./BEST_PRACTICES.md) for optimization
