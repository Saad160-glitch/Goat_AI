Add a 'share' button to the editor navbar that opens the share dialog.

Owner can :

- invite collaborators by email
- view current collaborators
- remove collaborators
- copy the project link with temporary 'Copied!' feedback.

Collaborators can only:

- view the collaborators list
- not invite, remove or manage access

## Clerk User Data

Collaborators are stored by email in the database.

Use clerk backend api to enrich collaborator emails with:

- display name 
- avatar image

If clerk user is not found for a email fall back to showing the email only.

## Implementation

Add the reqire api logic for:

- listing collaborators
- removing collaborators
- inviting collaborators

Enforce  ownership server-side for invite and remove actions.

Do not add a local user table

## Check when done

- when all the above tasks are done successfully
- 'npm run build' passes