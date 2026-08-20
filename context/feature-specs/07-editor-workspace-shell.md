Build the '/editor/[roomID]' workspace shell with server-side access checks. No canvas logic yet.

## Access 
'/editor/[roomID]' must be server component.

## Before Rendering:

- unauthenticated redirected to '/sign-in'
- user without project access sees 'AccessDenied'
- non-existent projects also show 'AccessDenied'

Create 'components/editor/access-denied.tsx' to display access denied message with a button to go back to the dashboard with 
- centered layout
- lock icon
- short message 
- link back '/editor


## Acces Helpers
create 'lib/project-access.ts' with helpers for:

- getting current clerk identity: 'userId' + primary email
- checking project access by owner or collaborator

## Layout

Build a full-viewport workspace layout with: 
- Top bar showing the project name
- navbar actions: share button and AI sidebar toggle
- existing 'ProjectSidebar' on the left side
- current room higlighted in the sidebar
- central canvas placeholder with dark background and centered message
-   right sidebar placeholder for future AI chat.

The canvas area should fill the remaining space

## Scope 

Do not add real canvas logic, liveblocks, AI chat or sharing behaviour yet 

## Check when done

- '/editor/[roomID]' builds successfully
- access helper exists outside the page comment
- 'AccessDenied' is used for missing or unauthorized project
- workspace layout renders with current project context
- no Type Script error

