# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- In Progress

## Current Goal

- Building core application features on top of the
  design system foundation.

## Completed

- **Design System & UI Primitives (spec: 01-design-system)**
  - Installed and configured `shadcn/ui` (v4.16.1) with
    Tailwind v4 + Next.js 16 App Router
  - Added shadcn components: Button, Card, Dialog, Input,
    Tabs, Textarea, ScrollArea
  - Installed `lucide-react` (stroke-based icon library)
  - Created `lib/utils.ts` with reusable `cn()` helper
    (clsx + tailwind-merge)
  - Updated `app/globals.css` with shadcn design tokens
    (light + dark OKLCH palette, radius scale)
  - Forced dark mode via `dark` class on `<html>` in
    `app/layout.tsx` — no light styling appears
  - `npm run build` passes cleanly

- **Editor Chrome (spec: 02-editor)**
  - Created `components/editor/editor-navbar.tsx` — fixed
    h-12 top bar with `PanelLeftOpen`/`PanelLeftClose`
    sidebar toggle (left section); right section empty
  - Created `components/editor/project-sidebar.tsx` —
    floating overlay sidebar (`position: fixed`, CSS
    translate slide animation, does not push content);
    "Projects" header + close button, shadcn `Tabs`
    (My Projects / Shared) with empty placeholder states,
    full-width "New Project" button at bottom
  - Wired both components into `app/page.tsx` with shared
    `useState` for sidebar open/close
  - Dialog pattern already supported by existing
    `components/ui/dialog.tsx` — no additional work needed

- **Auth (spec: 03-auth)**
  - Installed `@clerk/ui` for themes (`dark` + `shadcn`)
  - `proxy.ts` at project root — protected-first; only
    `/sign-in(.*)` and `/sign-up(.*)` are public
  - `ClerkProvider` wraps the root layout body with
    `dark` theme from `@clerk/ui/themes`
  - Added `@import "@clerk/ui/themes/shadcn.css"` to
    `globals.css` so Clerk forms inherit shadcn tokens
  - Created `app/(auth)/sign-in/[[...sign-in]]/page.tsx`
    — two-panel layout on large screens (logo + tagline
    + feature list left, Clerk `<SignIn />` right);
    form-only on small screens; no gradients or heavy
    hero sections; all colours via CSS variables
  - Created `app/(auth)/sign-up/[[...sign-up]]/page.tsx`
    — mirrors sign-in layout with Clerk `<SignUp />`
  - `app/page.tsx` now server-redirects: authenticated →
    `/editor`, unauthenticated → `/sign-in`
  - Added `UserButton` to top-right of `EditorNavbar`
    for profile settings and logout
  - Added Clerk URL env vars to `.env.local`
    (`NEXT_PUBLIC_CLERK_SIGN_IN_URL`,
    `NEXT_PUBLIC_CLERK_SIGN_UP_URL`,
    `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`,
    `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`)
  - `npm run build` passes cleanly

- **Editor Home + Project Dialogs (spec: 04-project-dialoge)**
  - Created `lib/projects.ts` — `Project` type + 5 mock
    entries (3 owned, 2 shared)
  - Created `hooks/use-project-dialogs.ts` — centralised
    hook for dialog kind, target project, form value,
    loading state, and live slug derivation
  - Created `components/editor/dialogs/create-project-dialog.tsx`
    — name input + live slug preview below input
  - Created `components/editor/dialogs/rename-project-dialog.tsx`
    — prefilled input, `autoFocus`, Enter submits
  - Created `components/editor/dialogs/delete-project-dialog.tsx`
    — destructive confirm, no input
  - Updated `app/editor/page.tsx` — centered heading +
    description + "New Project" button → Create dialog
  - Updated `components/editor/project-sidebar.tsx` —
    project list with name + slug, ⋯ action menu
    (rename / delete) for owned projects only; shared
    projects show no actions; mobile backdrop scrim +
    tap-outside closes sidebar
  - Updated `components/editor/editor-shell.tsx` — wires
    single `useProjectDialogs` instance; all three dialogs
    rendered at shell level; mock projects passed to sidebar
  - `npm run build` passes cleanly

- **Project API Routes (spec: 05-project-apiis)**
  - Created `app/api/projects/route.ts` —
    `GET` returns all owned projects (ordered by
    `createdAt` desc); `POST` creates a project with
    `ownerId = userId`, defaulting name to
    `"Untitled Project"` when omitted
  - Created `app/api/projects/[projectId]/route.ts` —
    `PATCH` renames (owner-only); `DELETE` deletes
    (owner-only); both return `404` if project is
    missing and `403` if caller is not the owner
  - All four handlers return `401` for unauthenticated
    requests; Clerk `userId` used as `ownerId` throughout
  - No UI wiring — backend only
  - Installed `@prisma/client@7` (was missing from
    `package.json`; generated client requires it)
  - Removed dead Accelerate branch from `lib/prisma.ts`
    (`@prisma/extension-accelerate` is not installed;
    Turbopack static-analysed the dead `require()` and
    errored)
  - `npm run build` passes cleanly

- **Wire Editor Home & Project Actions (spec: 06-wire-editor-home)**
  - Updated `lib/projects.ts` with server-side project data
    helpers (`getProjectsForCurrentUser()`, `getOwnedProjects()`,
    `getSharedProjects()`, and `slugifyProjectName()`) querying
    Prisma directly with Clerk auth
  - Updated `app/editor/layout.tsx` to be an async Server Component
    that fetches projects server-side on initial load without
    client-side waterfalls and passes them down to `EditorShell`
  - Created `hooks/use-project-actions.ts` managing:
    - Create: dialog state, name input, short random suffix generator,
      derived room ID slug preview, `POST /api/projects` call, and
      redirect to `/editor/${project.id}`
    - Rename: target project state, `PATCH /api/projects/[id]`,
      dialog close, and `router.refresh()`
    - Delete: target project state, `DELETE /api/projects/[id]`,
      active workspace redirect to `/editor`, and `router.refresh()`
  - Re-exported `useProjectActions` as `useProjectDialogs` in
    `hooks/use-project-dialogs.ts` for clean backward compatibility
  - Updated `app/api/projects/route.ts` to accept optional `id` parameter
    in `POST` body so Liveblocks room ID and Prisma project ID stay aligned
  - Updated dialogs (`CreateProjectDialog`, `RenameProjectDialog`,
    `DeleteProjectDialog`) to display room ID preview, target project name,
    and visual loading states
  - Updated `components/editor/project-sidebar.tsx` and `ProjectItem` to
    navigate to `/editor/${project.id}` on click while retaining action
    dropdown menus
  - `npm run build` passes cleanly

- **Editor Workspace Shell (spec: 07-editor-workspace-shell)**
  - Created `lib/project-access.ts` with:
    - `getCurrentClerkIdentity()` — returns `{ userId, primaryEmail,
      allEmails }` using Clerk `auth()` + `currentUser()`
    - `hasProjectAccess()` — queries Prisma for the project, checks
      owner (`ownerId === userId`) or collaborator email match;
      returns `{ project, access }` tuple
  - Created `components/editor/access-denied.tsx` — centered
    full-viewport layout with `LockKeyhole` icon, short message, and
    a `buttonVariants`-styled back-to-dashboard link
  - Created `app/editor/[roomID]/page.tsx` — async server component:
    unauthenticated → `redirect('/sign-in')`; missing or unauthorized
    project → `<AccessDenied />`; authorized → renders `<WorkspaceShell />`
  - Created `components/editor/workspace-shell.tsx` — client component
    filling the `main` area with: workspace top bar (project name,
    Share button placeholder, AI sidebar toggle), dark canvas placeholder,
    and collapsible right AI sidebar placeholder
  - Updated `components/editor/project-sidebar.tsx` — `ProjectItem`
    now uses `usePathname()` to auto-highlight the active project
    (`bg-accent`) with no prop drilling
  - `npm run build` passes cleanly; `/editor/[roomID]` is a dynamic
    server-rendered route (`ƒ`)

- **Share Dialog (spec: 08-share-dialog)**
  - Created `components/editor/dialogs/share-dialog.tsx` — client
    component with:
    - Share button (`Share2` icon) in the workspace navbar that opens
      a shadcn `Dialog`
    - Owner: email input + `UserPlus` button to invite collaborators
      (Enter key submits); inline invite error display
    - Owner: per-collaborator remove button (X icon, hover-reveals,
      red on hover) with `Loader2` spinner during removal
    - Both owner and collaborator: enriched collaborator list showing
      Clerk avatar (`imageUrl`) or initials fallback, display name,
      and email; falls back to email-only if Clerk user not found
    - Both: copy-project-link row with temporary "Copied!" feedback
      (2 s) using `Check` icon, falling back to email when no Clerk
      user is found
  - Wired `<ShareDialog projectId isOwner projectName />` into
    `components/editor/workspace-shell.tsx` navbar (right section)
  - Created `app/api/projects/[projectId]/collaborators/route.ts`:
    - `GET` — lists collaborators enriched via Clerk
      `getUserList({ emailAddress })`; accessible by owner or any
      collaborator; returns `{ collaborators, isOwner }`
    - `POST` — invite by email (owner-only, server-enforced);
      validates email format; rejects self-invite and duplicate invite
  - Created `app/api/projects/[projectId]/collaborators/[email]/route.ts`:
    - `DELETE` — removes collaborator by email (owner-only,
      server-enforced); decodes URI-encoded email param
  - `ProjectCollaborator` model already in schema + migration
    (`prisma/models/project.prisma`,
    `prisma/migrations/20260809182258_init_project_models`)
  - `npm run build` passes cleanly; all three collaborator routes
    appear in the build manifest as dynamic (`ƒ`)

## In Progress

- None.

## Next Up

- Next feature spec (09-…)

## Open Questions

- No unresolved questions at this time.

## Architecture Decisions

- **Dark-only theme**: Added the `dark` class permanently
  to `<html>` in `layout.tsx`. shadcn tokens default to
  light; forcing `.dark` ensures all components render
  with the dark palette from day one. Light mode is not
  in scope.
- **shadcn components are protected**: Files in
  `components/ui/*` are generated by the CLI and must
  not be modified manually.
- **Floating sidebar overlay**: `ProjectSidebar` uses
  `position: fixed` and CSS `translateX` transitions so it
  floats above the canvas without reflowing layout.
  Opening the sidebar never shifts page content.
- **Auth middleware — protected-first**: `proxy.ts` uses
  the protected-first strategy (`!isPublicRoute →
  auth.protect()`). All routes are locked down by
  default; only the Clerk auth paths are public. Route
  `'/'` itself now redirects server-side so no auth
  logic is needed there.
- **Clerk theme stacking**: `ClerkProvider` uses
  `dark` theme. The shadcn CSS import overlays shadcn
  tokens on top so Clerk components inherit the same
  design system tokens as the rest of the app. No
  hardcoded colours anywhere in auth pages.
- **proxy.ts over middleware.ts**: Next.js 16 uses
  `proxy.ts` as the middleware filename. The skill docs
  confirm `proxy.ts` replaces `middleware.ts` from
  Next.js 16+.
- **Server-side access gate on workspace routes**: `app/editor/[roomID]/page.tsx`
  is an async server component. It calls `getCurrentClerkIdentity()` before
  rendering anything — unauthenticated sessions are redirected at the RSC
  level, not via middleware alone. This keeps the access pattern consistent
  with the protected-first middleware strategy.
- **`buttonVariants` on Link for CTA links**: The shadcn `Button` in this
  project is built on `@base-ui/react/button` and does not support
  `asChild`. When a button-styled link is needed, apply `buttonVariants()`
  directly to a `<Link>` element instead.
- **Active sidebar highlight via `usePathname`**: `ProjectItem` reads
  `usePathname()` internally to derive its own active state — no prop
  drilling or context needed. The component is already a client component
  so this adds no extra `'use client'` boundaries.

## Session Notes

- shadcn init also added `tw-animate-css` and
  `shadcn/tailwind.css` imports to `globals.css`.
- Font variables (`--font-geist-sans`, `--font-geist-mono`)
  are set in `layout.tsx` and wired in globals.css via
  `--font-sans` / `--font-mono`.
