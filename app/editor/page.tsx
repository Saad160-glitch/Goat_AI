import { OpenCreateButton } from "./open-create-button"

export default function EditorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-3rem)] gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Create a project or open an existing one
      </h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        Start a new architecture workspace or choose a project from the
        sidebar.
      </p>
      {/*
        The "New project" button that triggers the Create dialog lives in
        EditorShell (shell-level dialogs) via ProjectSidebar's onNewProject.
        We surface a second entry point here by dispatching a custom event
        that EditorShell listens for — keeping dialog state in one place.
      */}
      <OpenCreateButton />
    </div>
  )
}
