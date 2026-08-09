"use client"

import { useState } from "react"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { CreateProjectDialog } from "@/components/editor/dialogs/create-project-dialog"
import { RenameProjectDialog } from "@/components/editor/dialogs/rename-project-dialog"
import { DeleteProjectDialog } from "@/components/editor/dialogs/delete-project-dialog"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"
import { MOCK_PROJECTS } from "@/lib/projects"

interface EditorShellProps {
  children: React.ReactNode
}

export function EditorShell({ children }: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const dialogs = useProjectDialogs()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed top navbar */}
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Floating sidebar — overlays the canvas, never pushes it */}
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projects={MOCK_PROJECTS}
        onNewProject={dialogs.openCreate}
        onRename={dialogs.openRename}
        onDelete={dialogs.openDelete}
      />

      {/* Editor canvas — offset by navbar height only */}
      <main className="flex-1 pt-12">
        {children}
      </main>

      {/* ── Dialogs — mounted at shell level, overlay everything ── */}
      <CreateProjectDialog
        open={dialogs.kind === "create"}
        nameValue={dialogs.nameValue}
        slug={dialogs.slug}
        isLoading={dialogs.isLoading}
        onNameChange={dialogs.setNameValue}
        onSubmit={dialogs.submitCreate}
        onClose={dialogs.close}
      />

      <RenameProjectDialog
        open={dialogs.kind === "rename"}
        nameValue={dialogs.nameValue}
        isLoading={dialogs.isLoading}
        onNameChange={dialogs.setNameValue}
        onSubmit={dialogs.submitRename}
        onClose={dialogs.close}
      />

      <DeleteProjectDialog
        open={dialogs.kind === "delete"}
        project={dialogs.target}
        isLoading={dialogs.isLoading}
        onConfirm={dialogs.submitDelete}
        onClose={dialogs.close}
      />
    </div>
  )
}
