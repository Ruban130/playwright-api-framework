# API Testing with JSONPlaceholder and ReqRes

This framework is configured to test against public APIs. Choose your target based on your testing needs.

## JSONPlaceholder (Default)

Public fake JSON API perfect for testing and prototyping.

**URL**: https://jsonplaceholder.typicode.com

### Available Resources

- `/posts` - Simulated blog posts
- `/users` - Simulated user data
- `/comments` - Simulated comments
- `/albums` - Simulated albums
- `/photos` - Simulated photos
- `/todos` - Simulated todo items

### Characteristics

- No authentication required
- Simulates real API behavior
- Returns predictable data
- Supports all HTTP methods
- Rate limiting: Generous (no practical limit for testing)
- Data is never persisted (returns 200 but doesn't actually store)

### Using JSONPlaceholder

```bash
# Set environment variable
export API_BASE_URL=https://jsonplaceholder.typicode.com

# Run tests
npm test
```

## ReqRes

Hosted API service for testing CRUD operations.

**URL**: https://reqres.in/api

### Available Resources

- `/users` - User management
- `/posts` - Post management (custom endpoint)
- `/resources` - Resource management

### Characteristics

- No authentication required (optional: token endpoints)
- Production-like responses
- Supports all HTTP methods
- Rate limiting: 100 requests per second
- Data is simulated (not persisted)
- Built-in delay simulation

### Using ReqRes

```bash
# Set environment variable
export API_BASE_URL=https://reqres.in/api

# Run tests
npm test
```

## Endpoint Comparison

| Operation | JSONPlaceholder | ReqRes |
|-----------|-----------------|--------|
| GET users | `/users` | `/users` |
| GET user | `/users/{id}` | `/users/{id}` |
| POST user | `/users` | `/users` |
| PUT user | `/users/{id}` | `/users/{id}` |
| PATCH user | `/users/{id}` | `/users/{id}` |
| DELETE user | `/users/{id}` | `/users/{id}` |

## Switching Between APIs

Edit `.env` file:

```env
# For JSONPlaceholder
API_BASE_URL=https://jsonplaceholder.typicode.com

# OR for ReqRes
API_BASE_URL=https://reqres.in/api
```

## Test Results Comparison

### Typical Response Times

**JSONPlaceholder**
- Average: 100-200ms
- GET: ~50-100ms
- POST/PUT/PATCH: ~100-200ms
- DELETE: ~80-150ms

**ReqRes**
- Average: 300-500ms (includes deliberate delay)
- GET: ~400ms
- POST/PUT/PATCH: ~300-400ms
- DELETE: ~400ms

## Recommended Configuration

### Development Testing

```env
API_BASE_URL=https://jsonplaceholder.typicode.com
TEST_TIMEOUT=30000
RETRY_COUNT=1
```

### CI/CD Pipeline

```env
API_BASE_URL=https://jsonplaceholder.typicode.com
TEST_TIMEOUT=30000
RETRY_COUNT=2
```

### Integration Testing

```env
API_BASE_URL=https://reqres.in/api
TEST_TIMEOUT=60000
RETRY_COUNT=3
```

## Mocking vs Live Testing

### Live API Testing (Current)

✅ Tests real network behavior
✅ Tests actual API responses
✅ Integration validation
❌ Depends on API availability
❌ Slower test execution

### Adding Mock Testing

To add mock API testing:

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('*/users', (req, res, ctx) => {
    return res(ctx.json([{ id: 1, name: 'Test User' }]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Health Check

Verify your API is reachable:

```bash
# JSONPlaceholder
curl https://jsonplaceholder.typicode.com/posts/1

# ReqRes
curl https://reqres.in/api/users/1
```

## Further Reading

- [JSONPlaceholder Documentation](https://jsonplaceholder.typicode.com)
- [ReqRes Documentation](https://reqres.in)
- [REST API Best Practices](https://restfulapi.net/)
