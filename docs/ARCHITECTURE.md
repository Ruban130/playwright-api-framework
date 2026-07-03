# Architecture Overview

Enterprise-grade API automation framework architecture using Playwright TypeScript.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Test Execution Layer                  │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ GET Spec │  │ POST Spec│  │ PUT Spec │  │DEL Spec  │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘ │
│       │             │             │             │        │
│  ┌────────────────────────────────────────────────────┐  │
│  │        Request Chaining & Negative Tests           │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                   Core Framework Layer                   │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐   │
│  │              RestClient (Fluent API)             │   │
│  │  • HTTP Methods (GET, POST, PUT, PATCH, DELETE) │   │
│  │  • Query Parameters & Headers                    │   │
│  │  • Request/Response Handling                     │   │
│  │  • Assertions & Fluent Interface                 │   │
│  └──────────────────────────────────────────────────┘   │
│                          │                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ AuthManager  │  │SchemaValidator│ │TestDataGen   │  │
│  │ • JWT Decode │  │ • JSON Schema │ │ • Faker.js   │  │
│  │ • OAuth      │  │ • Validation  │ │ • Mocking    │  │
│  │ • Tokens     │  │ • Custom Schemas │ • Fixtures │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                  Utilities & Config Layer                │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌────────────────┐  ┌────────────┐ │
│  │   Logger      │  │ Configuration  │  │   Types    │ │
│  │ (Winston)     │  │ (API Endpoints)│  │(Interfaces)│ │
│  └───────────────┘  └────────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│              Playwright API Request Layer                │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐   │
│  │  Playwright Test Context                         │   │
│  │  • APIRequestContext                             │   │
│  │  • Request/Response Handling                      │   │
│  │  • Error Management                              │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                    Network & APIs                        │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐   │
│  │  HTTP Network (TCP/IP)                           │   │
│  │  • JSONPlaceholder  (Default)                    │   │
│  │  • ReqRes          (Alternative)                 │   │
│  │  • Custom APIs     (Configurable)                │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Component Interaction Flow

```
Test Suite
    │
    ├─→ Playwright Test Runner
    │       │
    │       ├─→ Global Setup Hook
    │       │
    │       └─→ Test Execution
    │           │
    │           ├─→ RestClient.given()
    │           │       │
    │           │       ├─→ Set Headers
    │           │       ├─→ Set Query Params
    │           │       └─→ Set Body
    │           │
    │           ├─→ RestClient.post/put/patch/delete/get()
    │           │       │
    │           │       └─→ Execute Request
    │           │           │
    │           │           ├─→ AuthManager (if needed)
    │           │           │   • Generate Auth Header
    │           │           │   • Validate Token
    │           │           │
    │           │           ├─→ Build URL & Options
    │           │           │
    │           │           └─→ Playwright APIRequestContext
    │           │               │
    │           │               └─→ HTTP Request (Network)
    │           │
    │           ├─→ Response Received
    │           │   │
    │           │   ├─→ Logger.info(response)
    │           │   │
    │           │   └─→ SchemaValidator.validate()
    │           │
    │           └─→ Assertions
    │               • Status code
    │               • Response body
    │               • Response headers
    │               • Schema validation
    │
    └─→ Global Teardown Hook
        │
        └─→ Cleanup & Reporting
```

## Module Responsibilities

### RestClient
- **Purpose**: Fluent HTTP client with assertion capabilities
- **Methods**: GET, POST, PUT, PATCH, DELETE
- **Features**: 
  - Fluent API (builder pattern)
  - Query parameters
  - Custom headers
  - Request body handling
  - Inline assertions

### AuthManager
- **Purpose**: Handle authentication tokens
- **Features**:
  - JWT token decoding
  - Token expiration checking
  - Bearer token generation
  - Basic auth header generation
  - OAuth token management

### SchemaValidator
- **Purpose**: Validate API responses against JSON schemas
- **Features**:
  - AJV-based validation
  - Predefined schemas (User, Post, Comment)
  - Custom schema support
  - Error reporting
  - Type-safe validation

### TestDataGenerator
- **Purpose**: Generate realistic test data
- **Features**:
  - Faker.js integration
  - User generation
  - Post generation
  - Comment generation
  - Custom overrides support

### Logger
- **Purpose**: Comprehensive logging throughout tests
- **Features**:
  - Winston-based logging
  - Multiple transports (console, file)
  - Separate error logs
  - Configurable log levels
  - Structured logging

## Data Flow Example: POST Request

```
Test Code
    │
    └─→ restClient.given()
        │   • Creates builder instance
        │
        └─→ .header('X-Custom', 'value')
            │   • Adds to headers map
            │
            └─→ .body(payload)
                │   • Stores payload
                │
                └─→ .post(endpoint)
                    │   • Sets method to POST
                    │   • Calls executeRequest()
                    │
                    └─→ buildUrl()
                        │   • Constructs: baseURL + endpoint + query params
                        │
                        └─→ buildRequestOptions()
                            │   • Merges headers
                            │   • Adds body
                            │   • Sets timeout
                            │
                            └─→ request.post(url, options)
                                │   • Playwright sends HTTP request
                                │   • Network transmission
                                │   • Receives response
                                │
                                └─→ Logger.info(response)
                                    │   • Logs request & response
                                    │
                                    └─→ Returns ApiResponse
                                        {
                                          status: 201,
                                          statusText: "Created",
                                          headers: {...},
                                          body: {...}
                                        }

Test Assertions
    │
    ├─→ expect(response.status).toBe(201)
    ├─→ expect(response.body).toHaveProperty('id')
    └─→ schemaValidator.validate(schema, response.body)
```

## SOLID Principles Implementation

### Single Responsibility
- `RestClient`: HTTP communication only
- `AuthManager`: Authentication token handling
- `SchemaValidator`: Schema validation logic
- `TestDataGenerator`: Test data generation
- `Logger`: Logging concerns

### Open/Closed
- Extendable utilities through inheritance
- Plugin-able reporters in Playwright config
- Custom schema definitions supported
- Configurable endpoints

### Liskov Substitution
- AuthManager can be swapped for different auth implementations
- SchemaValidator can use different validation engines
- TestDataGenerator can use different data providers

### Interface Segregation
- Specific interfaces for API responses, auth tokens, configurations
- No large, monolithic interfaces
- Clients only depend on needed contracts

### Dependency Inversion
- Tests depend on RestClient abstraction, not implementation
- RestClient depends on Playwright's APIRequestContext interface
- Configuration injected, not hard-coded

## Clean Code Principles

### DRY (Don't Repeat Yourself)
- Reusable utilities in `src/utils/`
- Shared test fixtures in `tests/fixtures/`
- Common configuration in `src/config/`

### KISS (Keep It Simple, Stupid)
- Fluent API for simplicity
- Clear method names
- Logical code organization
- Minimal dependencies

### YAGNI (You Aren't Gonna Need It)
- Only essential features implemented
- No over-engineering
- Focused scope

## Testing Architecture

### Test Organization
```
tests/
├── specs/              # Test specifications
│   ├── get.spec.ts    # GET endpoint tests
│   ├── post.spec.ts   # POST endpoint tests
│   ├── put.spec.ts    # PUT endpoint tests
│   ├── patch.spec.ts  # PATCH endpoint tests
│   ├── delete.spec.ts # DELETE endpoint tests
│   ├── negative.spec.ts # Edge cases & negative tests
│   └── chaining.spec.ts # Request chaining workflows
├── fixtures/          # Test data & fixtures
└── hooks/            # Global setup/teardown
```

### Test Categories
- **Smoke Tests (@smoke)**: Quick validation of core functionality
- **Regression Tests (@regression)**: Comprehensive validation
- **Negative Tests**: Edge cases and error scenarios
- **Chaining Tests**: Multi-step workflows

## Scalability Considerations

### Horizontal Scaling
- Parallel test execution (configurable workers)
- Distributed CI/CD across multiple agents
- Docker containerization for scaling

### Vertical Scaling
- Efficient memory usage
- Optimized request handling
- Configurable timeouts and retries

### Maintainability
- Modular code organization
- Comprehensive documentation
- Type safety with TypeScript
- Consistent code style

## Performance Optimization

### Test Execution
- Parallel workers reduce overall execution time
- Selective test execution (smoke vs regression)
- Efficient resource management

### Request Optimization
- Connection reuse via Playwright
- Minimal payload sizes
- Timeout configuration

### Data Management
- Lightweight fixture loading
- Efficient faker data generation
- In-memory storage for test data

## Error Handling Strategy

```
Request Execution
    │
    ├─→ Network Error
    │   └─→ Logger.error()
    │       └─→ Throw error to test
    │
    ├─→ Timeout
    │   └─→ Retry logic (if configured)
    │       └─→ Log & throw
    │
    ├─→ Response Received
    │   ├─→ Status check
    │   ├─→ Schema validation
    │   └─→ Assertion failure
    │       └─→ Screenshot & video capture
    │           └─→ Log full details
    │
    └─→ Report Generation
        └─→ HTML, JSON, JUnit reports
```

## Security Architecture

- Environment-based configuration
- No secrets in code
- Token encryption support
- Secure logging (mask sensitive data)
- HTTPS for API communication
- SSL/TLS certificate validation

## Deployment Pipeline

```
Code Commit
    │
    └─→ GitHub Actions
        │
        ├─→ Lint & Type Check
        ├─→ Smoke Tests
        ├─→ Regression Tests
        ├─→ Build Docker Image
        └─→ Upload Artifacts
            │
            ├─→ Test Results
            ├─→ Coverage Reports
            └─→ Trace Files
```

## Extension Points

### Adding New Utilities
1. Create file in `src/utils/`
2. Export from module
3. Import in tests

### Adding New Tests
1. Create `.spec.ts` file in `tests/specs/`
2. Add appropriate tags (`@smoke`, `@regression`)
3. Use RestClient and utilities

### Custom Configuration
1. Create environment-specific `.env` files
2. Update `src/config/api-config.ts`
3. Reference in tests

### Adding New Reporters
1. Update `playwright.config.ts`
2. Configure reporter options
3. Generate after test run
