"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"
import { CreateProjectDialog } from "@/components/editor/dialogs/create-project-dialog"

export default function EditorPage() {
  const dialogs = useProjectDialogs()

  return (
    <>
      {/* Editor home — centered CTA */}
      <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-3rem)] gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create a project or open an existing one
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          Start a new architecture workspace or choose a project from the
          sidebar.
        </p>
        <Button
          id="home-new-project-btn"
          className="mt-2 gap-2"
          onClick={dialogs.openCreate}
        >
          <Plus className="h-4 w-4" />
          New project
        </Button>
      </div>

      {/* Dialogs — rendered at page level so they overlay everything */}
      <CreateProjectDialog
        open={dialogs.kind === "create"}
        nameValue={dialogs.nameValue}
        slug={dialogs.slug}
        isLoading={dialogs.isLoading}
        onNameChange={dialogs.setNameValue}
        onSubmit={dialogs.submitCreate}
        onClose={dialogs.close}
      />
    </>
  )
}
