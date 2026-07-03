# Debugging Guide

## Using Playwright Inspector

Interactive debugging with step-by-step test execution.

```bash
npm run test:debug
```

### Inspector Features

- **Step through code** - Execute one action at a time
- **Inspect DOM** - View HTML structure
- **Evaluate expressions** - Run JavaScript in console
- **Set breakpoints** - Pause at specific lines
- **View logs** - See request/response details

### Inspector Controls

- **Pause/Resume** - Play/pause test execution
- **Step Over** - Execute next line
- **Step Into** - Enter function
- **Continue** - Run to next breakpoint

## Using Playwright Trace Viewer

```bash
npm test:trace
```

### Trace Contents

- Network requests and responses
- Screenshot timeline
- Action logs
- Network activity
- Error messages

### Viewing Traces

```bash
# View specific trace
npx playwright show-trace test-results/trace.zip
```

## Using Playwright UI

Visual test runner with real-time execution.

```bash
npm run test:ui
```

### UI Features

- Test file explorer
- Test filtering and search
- Visual test execution
- Trace integration
- Live reload on code changes

## Logging

### Enable Debug Logging

```bash
LOG_LEVEL=debug npm test
```

### Log Levels

- `debug` - Detailed diagnostic information
- `info` - General informational messages
- `warn` - Warning messages
- `error` - Error messages only

### View Logs

```bash
# Combined logs
cat results/combined.log

# Error logs only
cat results/error.log
```

## Screenshots and Videos

### Automatic Capture

```bash
# Screenshots on failure (default)
npm test

# Always capture screenshots
npx playwright test --screenshot on

# Capture videos
npx playwright test --video on
```

### View Artifacts

```bash
# Screenshots location
ls test-results/
```

## Using Breakpoints

### In Test Code

```typescript
test('GET /users - Retrieve all users', async ({ request }) => {
  const client = new RestClient(request, apiConfig);
  
  // Breakpoint: test execution will pause here
  debugger;
  
  const response = await client.get(endpoints.users);
  expect(response.status).toBe(200);
});
```

Run with debug:

```bash
npm run test:debug
```

## Debugging Specific Issues

### Assertion Failures

```bash
# Run single test with UI
npx playwright test -g "test name" --ui

# Or with debug
npm run test:debug -- -g "test name"
```

### Network Issues

```bash
# Enable detailed logging
LOG_LEVEL=debug npm test

# Check API availability
curl https://jsonplaceholder.typicode.com/posts/1
```

### Timeout Issues

```bash
# Increase timeout
TEST_TIMEOUT=60000 npm test

# Or run single test with debug
npm run test:debug -- -g "slow test"
```

### Flaky Tests

```bash
# Run serially to eliminate race conditions
npm run test:serial

# Or with detailed logging
LOG_LEVEL=debug npm run test:serial
```

## Inspecting API Responses

### In Test Code

```typescript
test('GET /users - Debug response', async ({ request }) => {
  const client = new RestClient(request, apiConfig);
  const response = await client.get(endpoints.users);
  
  // Log response for inspection
  console.log('Status:', response.status);
  console.log('Headers:', response.headers);
  console.log('Body:', JSON.stringify(response.body, null, 2));
  
  expect(response.status).toBe(200);
});
```

Run with logging:

```bash
LOG_LEVEL=debug npm test 2>&1 | tee test.log
```

## Using VS Code Debugger

### Setup

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Playwright Tests",
      "skipFiles": ["<node_internals>/**"],
      "command": "npm",
      "args": ["run", "test:debug"],
      "protocol": "inspector",
      "env": {
        "LOG_LEVEL": "debug"
      }
    }
  ]
}
```

### Start Debugging

1. Set breakpoints in VS Code
2. Press F5 or click "Run and Debug"
3. Select "Debug Playwright Tests"

## Common Debugging Scenarios

### Scenario: Test Passes Locally but Fails in CI

**Solution:**
1. Check environment variables in CI
2. Verify API URL accessibility
3. Check for timing issues (increase timeout)
4. Look for OS-specific behaviors

```bash
# Simulate CI environment
TEST_TIMEOUT=30000 RETRY_COUNT=2 npm test
```

### Scenario: Random Test Failures

**Solution:**
1. Run test multiple times serially
2. Check for timing issues
3. Look for state dependencies between tests
4. Enable detailed logging

```bash
npm run test:serial -- -g "flaky test"
LOG_LEVEL=debug npm run test:serial -- -g "flaky test"
```

### Scenario: Slow Tests

**Solution:**
1. Profile with trace viewer
2. Check network times
3. Identify bottlenecks
4. Optimize requests

```bash
npm test -- --trace on
npm run test:trace
```

### Scenario: Response Validation Failures

**Solution:**
1. Log response body
2. Validate schema
3. Check data types
4. Inspect headers

```typescript
const response = await client.get(endpoints.users);
console.log(JSON.stringify(response.body, null, 2));

const validation = schemaValidator.validate(schema, response.body);
console.log('Validation errors:', validation.errors);
```

## Performance Profiling

### Identify Slow Tests

```bash
npm test -- --reporter=list
```

### Detailed Timing

```bash
npx playwright test --reporter=json > results.json
```

Analyze results:

```bash
cat results.json | jq '.suites[].tests[] | {title, duration: .duration}'
```

## Accessing Test Results

### Results Files

```
results/
├── html-report/           # HTML test report
├── results.json           # JSON results
├── junit.xml              # JUnit XML
├── combined.log           # All logs
└── error.log              # Error logs only

test-results/
├── *.png                  # Screenshots
├── *.webm                 # Videos
└── trace.zip              # Trace file
```

### View Results

```bash
# HTML report
npm run test:report

# Trace viewer
npm run test:trace

# JSON results
jq . results/results.json

# Logs
tail -f results/combined.log
```

## Advanced Debugging

### Environment-specific Debug

```bash
# Debug with specific API
API_BASE_URL=https://reqres.in/api npm run test:debug

# Debug with specific log level
LOG_LEVEL=debug npm run test:debug
```

### Recording Session

```bash
# Record all activity
npm test -- --trace on --video on --screenshot on

# Review artifacts
npm run test:trace
npm run test:report
```

## Tips and Tricks

✅ Use `--grep` to filter specific tests
✅ Use `--tag` to run by test tags
✅ Use `--headed` to see browser (if applicable)
✅ Use `debugger;` statement to pause execution
✅ Use `console.log()` for quick debugging
✅ Save traces for post-test analysis
✅ Compare traces between passing/failing runs
✅ Enable verbose logging for CI failures
