# Demo Tenant Miniapp

A tenant miniapp showcasing context-specific capabilities across Projects, Learn, and Studio contexts.

## Features

- **Projects Context:** Display editor content statistics with live updates
- **Learn Context:** Show lesson content and student progress
- **Studio Context:** Display lesson draft information for instructors

## Getting Started

### Install Dependencies

```bash
npm install
# or
pnpm install
```

### Development Server

Start the local development server with hot reload:

```bash
npm run dev
```

This will open `http://localhost:3002` with a mock sandbox environment for testing.

### Build

Create a production build:

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload (port 3002) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint code with ESLint |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run type-check` | TypeScript type checking |

## Project Structure

```
demo-tenant/
├── .github/workflows/
│   └── deploy.yml        # CI/CD pipeline
├── src/
│   ├── index.tsx         # Miniapp component (production)
│   └── dev.tsx           # Development entry point
├── index.html            # Dev server HTML
├── vite.config.ts        # Vite configuration
├── package.json          # 👈 Includes miniapp metadata in "klynt" section
├── tsconfig.json
├── .eslintrc.cjs         # ESLint config
└── .prettierrc           # Prettier config
```

## Development

The miniapp uses `React.createElement` directly (no JSX) to avoid bundling React code. The sandbox runtime provides React globally.

During development (`npm run dev`), a mock sandbox bridge is provided in `src/dev.tsx` for testing.

## Deployment

This miniapp uses GitHub Actions for automated deployment:

1. Push to `main` or create a tag (e.g., `v2.0.1`)
2. GitHub Action automatically:
   - Validates `manifest.json`
   - Bundles with esbuild
   - Runs security scanning
   - Uploads to Klynt (if approved)

### GitHub Secrets Required

Add these to your repository secrets:

- `KLYNT_API_KEY` - API key for deployment
- `KLYNT_TENANT_ID` - Target tenant ID
- `KLYNT_API_URL` - Klynt API endpoint

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **ESLint** - Code linting
- **Prettier** - Code formatting

## License

MIT
