<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Application Building Context

Read all six context files in the context/ directory in the following order before implementing any features:

1. 'context/project-overview.md' - product definition, goals, features and scope
2. 'context/architecture.md' - system structure, boundaries, storage model, and invariants
3. 'context/ui-context.md' - theme, colours, typography, canvas design and component conventions
4. 'context/ai-workflow-rules.md' - development workflow, scoping rules and delivery guidelines
5. 'context/progress-tracker.md' - current phase, open questions, completed work and next steps
6. 'context/code-standards.md' - implementation rules and conventions

Update 'context/progress-tracker.md' after each feature implementation.

If implementation changes the architecture, scope or standards documented in the context files, update the releveant files before continuing