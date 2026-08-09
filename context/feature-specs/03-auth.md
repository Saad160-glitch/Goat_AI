clerk is already installed and connected. Wire it into the Next.js app: provider, auth pages, redirects, route protection and user menu.

## Design

Use clerk's 'dark' theme from '@clerk/ui/themes' as the base.

Override Clerk appearance variables using app's existinf CSS variables. Do not hardcore colors.

### Sign-in and sign-up pages:

- Large screens: simple two panel layout
- left: compact logo, tagline, short text only feature list
- right: centeres Clerk form
- small screens: form only
- no gradients
- no oversized hero sections
- no feature cards
- no scroll-heavy layouts

keep the layout minimal and professional.

## IMplementation

Wrap the root layout with 'ClerkProvider' usinf Clerk's 'dark' theme

Create sign-in and sign-up pages using Clerk's components

Use 'proxy.ts' at the project root, not 'middleware.ts'

Define public routes using the existing sign-in and sign-up env vars. Protect everything else by default.

Update '/':

- authenticated user redirecte to '/editor'
- unauthenticated user to '/sign-in' page

Add clerk's built-in 'UserButton' to the top-right of the editor navbar for profile settings and logout.

Keep Clerk's default user menu and profile flows intact. Do not rebild or heavily customize Clerk internals.

Use existing clerk env vars. Do not rename or invent new one.

## Dependencies

intall: @cler.ui.

## Check When Done

- 'proxy.ts' exists at the rott
- all routes are protected except public auth path
- 'ClerkProvider' wraps the root layout
- 'npm run build' passes
- auth pages use CSS variables with no hardcoded colorsl
