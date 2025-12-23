# Quick Start for React Developers

## TL;DR

```bash
npm install
npm run dev      # Start dev server at http://localhost:3002
npm run build    # Build for production
npm run lint     # Lint code
npm run format   # Format code
```

## What's Different?

This is a **Klynt Miniapp** - a React component that runs inside a sandboxed iframe in the Klynt IDE. Think of it like building a VS Code extension, but with React.

### Key Differences from Regular React Apps:

1. **No JSX** - Uses `React.createElement` directly
   - Why? Avoids bundling React runtime (sandbox provides it globally)
   - Don't worry - you can still write normal React code

2. **External React** - React/ReactDOM are provided by the sandbox
   - They're marked as `external` in `vite.config.ts`
   - Available as `window.React` in production

3. **Sandbox Bridge** - Special API to communicate with the IDE
   ```typescript
   window.__sandboxBridge.getEditorContent()  // Get editor content
   window.__sandboxBridge.emit('message', {}) // Send message to host
   ```

4. **Two Entry Points:**
   - `src/index.tsx` - Production miniapp (no React imports)
   - `src/dev.tsx` - Development with mocks (imports React)

## Development Workflow

### 1. Local Development

```bash
npm run dev
```

Opens `http://localhost:3002` with:
- ✅ Hot reload
- ✅ Mock sandbox bridge
- ✅ TypeScript checking
- ✅ React DevTools support

### 2. Make Changes

Edit `src/index.tsx` - changes appear instantly via HMR.

### 3. Lint & Format

```bash
npm run lint      # Check for issues
npm run format    # Auto-fix formatting
```

### 4. Build & Test

```bash
npm run build     # Creates dist/bundle.js
npm run preview   # Preview production build
```

### 5. Deploy

Push to GitHub - the action automatically deploys:

```bash
git add .
git commit -m "Update miniapp"
git push origin main
```

## File Structure (React Dev POV)

```
demo-tenant/
├── src/
│   ├── index.tsx          # 👈 Your main component (edit this)
│   └── dev.tsx            # Dev harness (usually don't touch)
│
├── index.html             # Dev server HTML
├── vite.config.ts         # Vite config (externals configured)
│
├── package.json           # 👈 Includes miniapp metadata in "klynt" section
├── tsconfig.json          # TypeScript config
├── .eslintrc.cjs         # ESLint rules
├── .prettierrc           # Prettier config
│
└── .github/workflows/
    └── deploy.yml         # CI/CD (auto-deploy on push)
```

## Common Tasks

### Adding Dependencies

```bash
npm install lodash
npm install -D @types/lodash
```

**Important:** Don't add `react` or `react-dom` - they're provided by the sandbox.

### Accessing IDE Features

The sandbox bridge gives you access to IDE features:

```typescript
// Get editor content
const content = await window.__sandboxBridge.getEditorContent();

// Listen for changes
window.__sandboxBridge.onEditorChange((newContent) => {
  console.log('Editor updated:', newContent);
});

// Get runtime context
const context = window.__sandboxBridge.useMiniAppContext();
// context.type: 'projects' | 'learn' | 'studio'
```

### Styling

Use inline styles (like in the demo) or add CSS:

```typescript
// Inline styles (recommended)
const styles = {
  container: { padding: '16px', background: '#1a1a2e' }
};

// Or import CSS
import './styles.css';
```

### Context-Aware UI

Show different UI based on where the miniapp is loaded:

```typescript
const context = window.__sandboxBridge.useMiniAppContext();

if (context.type === 'projects') {
  return <ProjectsView />;
} else if (context.type === 'learn') {
  return <LearnView />;
}
```

## Testing Deployment Locally

Before pushing to GitHub, test the production build:

```bash
# 1. Build
npm run build

# 2. Check output
ls -lh dist/bundle.js

# 3. Preview
npm run preview
```

## Troubleshooting

**"Cannot use import statement outside a module"**
- ✅ Check `"type": "module"` in package.json

**"React is not defined"**
- ✅ In dev mode: Import React in `src/dev.tsx`
- ✅ In production: Use `window.React` (provided by sandbox)

**Build fails with "external module not found"**
- ✅ Check `vite.config.ts` has correct externals

**Hot reload not working**
- ✅ Restart dev server: `npm run dev`

## Need Help?

- See [DEPLOYMENT.md](./DEPLOYMENT.md) for GitHub Actions setup
- See [README.md](./README.md) for full documentation
- Check `.github/workflows/deploy.yml` for CI/CD config

## Happy Coding! 🚀
