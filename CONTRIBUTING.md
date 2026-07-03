# Contributing Guide

Thank you for your interest in contributing to the Playwright API Automation Framework! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Git Workflow](#git-workflow)
- [Commit Convention](#commit-convention)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Documentation](#documentation)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and adhere to our Code of Conduct:

- Be respectful and inclusive
- Welcome different perspectives and experiences
- Focus on constructive feedback
- Report unacceptable behavior to the maintainers

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- Docker (optional, for testing)
- Visual Studio Code (recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/playwright-api-automation-framework.git
cd playwright-api-automation-framework
```

3. Add upstream remote:

```bash
git remote add upstream https://github.com/original-owner/playwright-api-automation-framework.git
```

## Development Setup

### Install Dependencies

```bash
npm install
```

### Build TypeScript

```bash
npm run build
```

### Verify Setup

```bash
npm run type-check
npm run lint
npm test:smoke
```

## Git Workflow

### Branch Strategy

We follow a simple branch strategy:

- **main** - Production-ready code
- **develop** - Development branch for next release
- **feature/** - Feature branches
- **fix/** - Bug fix branches
- **docs/** - Documentation changes
- **refactor/** - Code refactoring branches

### Creating a Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Keep Your Branch Updated

```bash
# Before creating PR
git fetch upstream
git rebase upstream/main
```

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

Must be one of:

- **feat**: A new feature
- **fix**: A bug fix
- **refactor**: Code change that neither fixes bug nor adds feature
- **docs**: Documentation only changes
- **test**: Adding or updating tests
- **ci**: Changes to CI/CD configuration
- **build**: Changes to build system or dependencies
- **perf**: Performance improvement
- **style**: Code style changes (formatting, missing semicolons, etc)
- **chore**: Other changes that don't modify src or test files

### Scope

Optional. Specify the area of the codebase:

- `rest-client`
- `auth`
- `schema-validator`
- `logger`
- `tests`
- `ci`
- `docs`

### Subject

- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period (.) at the end
- Maximum 50 characters

### Body

Optional. Explain what and why, not how:

```
feat(rest-client): add support for query parameter validation

Add validation logic for query parameters before sending requests.
This ensures type safety and prevents common errors.
```

### Footer

Optional. Reference issues or breaking changes:

```
Fixes #123
Breaking-Change: Endpoint format changed from /v1/ to /api/v1/
```

### Examples

```bash
# Feature
git commit -m "feat(tests): add request chaining tests for CRUD workflow"

# Bug fix
git commit -m "fix(schema-validator): handle null values in optional fields"

# Documentation
git commit -m "docs: update installation instructions for Node.js 20"

# Tests
git commit -m "test(negative): add boundary value testing for post IDs"

# CI/CD
git commit -m "ci: update GitHub Actions workflow for parallel testing"
```

## Coding Standards

### TypeScript

- **Strict Mode**: All TypeScript files must use strict mode
- **Type Safety**: No `any` types allowed (use `unknown` if needed)
- **Interfaces**: Define interfaces for all objects
- **Imports**: Use ES6 module imports
- **Return Types**: All functions must have explicit return types

### Code Style

- ESLint: `npm run lint`
- Prettier: `npm run format`
- File naming: `camelCase.ts` for utilities, `kebab-case.spec.ts` for tests

### Best Practices

```typescript
// ✅ Good
export interface ApiResponse {
  status: number;
  body: Record<string, unknown>;
}

export async function fetchData(url: string): Promise<ApiResponse> {
  // Implementation
}

// ❌ Bad
export async function fetchData(url: string): any {
  // Implementation
}

export const response: any = {};
```

### Documentation

- Add meaningful comments only for complex logic
- Use JSDoc for public functions:

```typescript
/**
 * Validate data against JSON Schema
 * @param schema - JSON Schema to validate against
 * @param data - Data to validate
 * @returns Validation result with errors if invalid
 */
export function validate(schema: JSONSchemaType, data: unknown): ValidationResult {
  // Implementation
}
```

## Testing Requirements

### Test Coverage

New features must include tests:

- ✅ Happy path tests
- ✅ Edge case tests
- ✅ Negative tests
- ✅ Type safety tests

### Test Naming

```typescript
test('POST /users - Create user with valid data', async () => {
  // Test implementation
});

test('GET /users/{id} - Non-existent user returns 404', async () => {
  // Test implementation
});
```

### Test Tags

Use tags for test organization:

```typescript
test('GET /users @smoke', async () => { });
test('POST /users @regression', async () => { });
```

### Running Tests

```bash
npm test                    # All tests
npm run test:smoke          # Smoke tests
npm run test:regression     # Regression tests
npm run test:parallel       # Parallel execution
```

### Test Quality Checklist

- [ ] Tests pass locally
- [ ] Tests pass in CI
- [ ] No console errors/warnings
- [ ] Proper assertions used
- [ ] Test data properly generated/mocked
- [ ] Cleanup code in afterEach

## Pull Request Process

### Before Creating PR

1. Update and rebase your branch:

```bash
git fetch upstream
git rebase upstream/main
```

2. Run tests locally:

```bash
npm test
npm run lint
npm run type-check
npm run format:check
```

3. Fix any issues:

```bash
npm run lint:fix
npm run format
```

### Creating PR

1. Push your branch:

```bash
git push origin feature/your-feature-name
```

2. Create Pull Request on GitHub with:
   - Clear title following commit convention
   - Description of changes
   - Reference to related issues
   - Screenshots/videos if applicable
   - Testing performed

### PR Title Format

```
feat(rest-client): add query parameter filtering support
fix(tests): resolve timeout issues in parallel execution
docs: update API configuration guide
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #(issue number)

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing Performed
- [ ] Unit tests
- [ ] Integration tests
- [ ] Smoke tests
- [ ] Manual testing

## Screenshots/Videos
(if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
- [ ] Changes tested in CI
```

### Review Process

- Maintainers will review your PR
- Changes may be requested
- Address feedback and re-push
- Approval and merge by maintainers

### Approval Criteria

- ✅ Code quality standards met
- ✅ Tests pass and cover new code
- ✅ Documentation updated
- ✅ Follows commit conventions
- ✅ No breaking changes (or documented)
- ✅ One approval from maintainer

## Documentation

### Updating README

When adding features, update `README.md`:

- Add feature to Features section
- Update Architecture diagram if needed
- Add usage examples
- Update troubleshooting if applicable

### Adding to CHANGELOG

Update `CHANGELOG.md` when:

- Adding new features
- Fixing bugs
- Making breaking changes
- Updating documentation

Format:

```markdown
## [Unreleased]

### Added
- New feature description

### Fixed
- Bug fix description

### Changed
- Breaking change description
```

## Reporting Issues

### Bug Report

Use the bug report template:

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Node.js version
- npm version
- OS
- Browser (if applicable)

## Logs
Include error logs and stack traces

## Attachments
Screenshots, videos, or test files
```

### Feature Request

Use the feature request template:

```markdown
## Description
Clear description of desired feature

## Motivation
Why is this feature needed?

## Proposed Solution
How should this feature work?

## Alternative Solutions
Other approaches considered

## Additional Context
Any other relevant information
```

## Questions?

- 📝 Open an Issue
- 📢 Start a Discussion
- 💬 Comment on related PR

## Recognition

Contributors will be:

- Acknowledged in CHANGELOG
- Listed in project README (if applicable)
- Given credit in commits

Thank you for contributing! 🎉
