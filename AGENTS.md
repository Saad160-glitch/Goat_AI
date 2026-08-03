<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Application Building Context

Read all six context files in the context/ directory in the following order before implementing any features:

1. 'context/project_overview.md' - product definition, goala, features and scope
2. 'context/architecture-context.md' - system structure, boundaries, storage model, and invariants
3. 'context/ui-context.md' - theme, colours, topography, canvas design and component conventions
4. 'context/ai_workflow_rules.md' - development workflow, scoping rules and delivery guidelines
5. 'context/progress-tracker.md' - current phase, open questions, completed work and next steps
6. 'context/code-standards.md' - implementation rules and conventions

Update 'context/progress-tracker.md' after each feature implementation.

If implementation changes the architecture, scope or standards documented in the context files, update the releveant files before continuing