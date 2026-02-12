# casework-app

Merging Housekeeping and Casework app

## Setup

### First-time setup

```bash
# Install all dependencies and set up git hooks
npm install
```

This will:

- Install monorepo deps
- Install all deps in `materials_ui/`
- Configure pre-commit hooks to run linting and formatting

### Development

```bash
cd materials_ui
npm run dev
```

### Pre-commit hooks

Before each commit, lint-staged automatically runs the following on staged files:

- ESLint
- Prettier
