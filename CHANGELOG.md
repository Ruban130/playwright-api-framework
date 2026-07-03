# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added

- **Initial Release**
- Core REST API automation framework with Playwright
- TypeScript strict typing configuration
- RestClient with fluent API pattern
- AuthManager for JWT and OAuth token handling
- SchemaValidator for JSON schema validation using AJV
- TestDataGenerator with Faker.js integration
- Comprehensive logging with Winston
- GET endpoint tests with response validation
- POST endpoint tests with data generation
- PUT endpoint tests with full replacement
- PATCH endpoint tests with partial updates
- DELETE endpoint tests with idempotency checks
- Negative tests and edge case handling
- Request chaining tests for complex workflows
- Smoke test suite with @smoke tag
- Regression test suite with @regression tag
- Test fixtures with mock data
- Global setup and teardown hooks
- ESLint configuration with strict TypeScript rules
- Prettier code formatting configuration
- Docker support with Dockerfile
- Docker Compose orchestration
- GitHub Actions CI/CD workflow
- HTML, JSON, and JUnit test reporters
- Playwright trace viewer support
- Automatic screenshot capture on failures
- Video recording on test failures
- Environment configuration with .env support
- Comprehensive README documentation
- Contributing guidelines
- MIT License
- Issue templates for bug reports and feature requests
- Pull request template
- .gitignore with common patterns

### Tech Stack

- Playwright 1.43.1
- TypeScript 5.3.3
- Node.js 18.0.0+
- npm 9.0.0+
- Docker (optional)
- GitHub Actions

### Documentation

- Complete README with architecture diagram
- Project structure explanation
- Installation guide
- Configuration guide
- Test execution examples
- Troubleshooting section
- Performance optimization tips
- Best practices guide

### CI/CD

- GitHub Actions workflow for automated testing
- Support for multiple Node.js versions (18.x, 20.x)
- Docker image building and testing
- Artifact uploads for test results and traces
- Scheduled daily test runs

### Code Quality

- ESLint with TypeScript support
- Prettier code formatting
- Strict TypeScript configuration
- Type safety with 100% coverage in utilities
- Type-safe test fixtures

## [Unreleased]

### Planned Features

- [ ] Open API 3.0 spec integration
- [ ] GraphQL API support
- [ ] WebSocket protocol support
- [ ] Performance testing with metrics
- [ ] Visual regression testing
- [ ] Multi-environment configuration
- [ ] API mocking with MSW
- [ ] Allure report integration
- [ ] Test data persistence
- [ ] Cloud integration (AWS/Azure)
- [ ] Custom HTML reporter
- [ ] Database assertion utilities
- [ ] API documentation generation
- [ ] Load testing capabilities
- [ ] Security testing module

---

For upgrade guide and migration path, see the [Contributing Guide](CONTRIBUTING.md).
