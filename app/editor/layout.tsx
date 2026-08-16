import { EditorShell } from "@/components/editor/editor-shell"
import { getProjectsForCurrentUser } from "@/lib/projects"

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const projects = await getProjectsForCurrentUser()

  return <EditorShell projects={projects}>{children}</EditorShell>
}
