## Goal

Build the '/editor' home screen and add project dialogs/slidebar actions. No API calls or presistence yet.


## Editor Home

Reuse the existing editor layout. Do not modify the navibar or sidebar.

In the centre of the page add:

- heading : 'Create a project or open an existing one'
- description: 'Start a new architecture workspace or choose a project from sidebar'
- 'New project' button with a 'Plus' icon

Keep the layout minimal. Do not wrap this content in cards.

Clicking 'New Project' should open the Create project dialog.


## Dialogs

### Create Project

- project name input
- live slug preview based on the name
- preview updates as the user types

### Rename Project

- prefilled project name input
- current project name shown in the input
- input auto-focuses
- Enter submits

### Delete Project

- destructive confirmation only
- no input
- confirm button uses destructive styling


## Sidebar

Add project item actions:

- rename
- delete

Show action only for owned projects

Hide action for shared/collabrator projects.

On mobile:

- tapping outside the sidebar closes it
- add a backdrop scrim

## Implementation

Create a dedicated hook to manage:
- dialog state
- form state
- loading state

Wire:

- editor home 'New Project' -Create dialog
- project item rename - Rename dialog
- project item delete - Delete dialog
- slidebar create -Create dialog

Use mock projects data only. Do not add API cllas or prsistence.

## Check when done

- sidebar action are wired
- slug preview works
- no TypeScript errors
- no lint errors
