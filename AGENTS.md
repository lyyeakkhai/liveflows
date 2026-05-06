<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Setup & Build Instructions
- Run `pnpm install` to install dependencies.
- Run `pnpm dev` to start the Next.js development server.
- Run `pnpm build` to compile the optimized production build.

## Additional Development Information
- **Code Style Check**: We follow the default Next.js ESLint configuration. Run `pnpm lint` to check for style issues.
- **Type Checking**: Run `npx tsc --noEmit` to verify TypeScript types.
- **Formatting**: Tailwind CSS is standard for styling. Refer to `context/ui-context.md` for extended design system rules. 
- **Architecture Context**: Before implementing or altering the architecture, review the design logs in the `context/` folder. Always update `context/progress-tracker.md` after meaningful implementation shifts.

## Application Building Context

Read the following files in order before implementing or making any architectural decision:

1. `context/project-overview.md` — product definition, goals, features, and scope
2. `context/architecture.md` — system structure, boundaries, storage model, and invariants
3. `context/ui-context.md` — theme, colors, typography, and component conventions
4. `context/code-standards.md` — implementation rules and conventions
5. `context/ai-workflow-rules.md` — development workflow, scoping rules, and delivery approach
6. `context/progress-tracker.md` — current phase, completed work, open questions, and next steps
7. `docs/GEMINI.md` — localized documentation and architecture standards

Update `context/progress-tracker.md` after each meaningful implementation change.

If implementation changes the architecture, scope, or standards documented in the context files, update the relevant file before continuing.
