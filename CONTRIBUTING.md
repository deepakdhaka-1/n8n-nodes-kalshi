# Contributing to n8n-nodes-kalshi

Thank you for your interest in contributing! This document provides guidelines for contributing to this n8n community node.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/n8n-nodes-kalshi.git
   cd n8n-nodes-kalshi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Link for local development**
   ```bash
   npm link
   ```

5. **In your n8n installation**
   ```bash
   cd ~/.n8n
   npm link n8n-nodes-kalshi
   ```

## Development Workflow

### Making Changes

1. Create a new branch for your feature/fix
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes in the appropriate files:
   - Node logic: `nodes/Kalshi/Kalshi.node.ts`
   - API functions: `nodes/Kalshi/GenericFunctions.ts`
   - Credentials: `credentials/KalshiApi.credentials.ts`
   - Types: `nodes/Kalshi/types.ts`

3. Build and test your changes
   ```bash
   npm run build
   npm run lint
   ```

4. Test in n8n
   - Start n8n: `n8n start`
   - Create a workflow using your changes
   - Test all modified operations

### Code Style

- Follow the existing code style
- Use TypeScript types for all parameters
- Add JSDoc comments for complex functions
- Run `npm run format` before committing

### Testing Checklist

Before submitting a PR, ensure:

- [ ] Code builds without errors
- [ ] ESLint passes with no errors
- [ ] All operations work in both demo and production environments
- [ ] Error handling works correctly
- [ ] Authentication and token refresh work
- [ ] Pagination works for list operations
- [ ] Documentation is updated if needed

## Adding New Features

### Adding a New Operation

1. Add the operation to the node's properties in `Kalshi.node.ts`
2. Add parameter fields for the operation
3. Implement the operation logic in the `execute` method
4. Add TypeScript types in `types.ts` if needed
5. Update README.md with usage examples
6. Test thoroughly

### Adding New Resource Types

If Kalshi adds new API endpoints:

1. Add the resource to the `resource` options
2. Create operations for the resource
3. Add all necessary parameters
4. Implement in the execute method
5. Add types for the new resource
6. Document in README.md

## API Updates

When Kalshi updates their API:

1. Check the [Kalshi API changelog](https://docs.kalshi.com)
2. Update affected operations
3. Update types if the response structure changed
4. Test all affected operations
5. Update version number appropriately

## Submitting Changes

1. **Commit your changes**
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

2. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues
   - Include screenshots/examples if applicable
   - Ensure all tests pass

## Pull Request Guidelines

- Keep PRs focused on a single feature/fix
- Write clear commit messages
- Update documentation as needed
- Add examples for new features
- Respond to review feedback promptly

## Code Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be included in the next release

## Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features, backwards compatible
- **PATCH**: Bug fixes, backwards compatible

## Questions?

- Open an issue for bugs or feature requests
- Ask questions in pull request comments
- Check existing issues before creating new ones

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎉
