import { redirect } from "next/navigation"
import { AccessDenied } from "@/components/editor/access-denied"
import { WorkspaceShell } from "@/components/editor/workspace-shell"
import {
  getCurrentClerkIdentity,
  hasProjectAccess,
} from "@/lib/project-access"

interface EditorRoomPageProps {
  params: Promise<{ roomID: string }>
}

export default async function EditorRoomPage({ params }: EditorRoomPageProps) {
  const { roomID } = await params

  // ── Auth check ─────────────────────────────────────────────
  const identity = await getCurrentClerkIdentity()
  if (!identity) {
    redirect("/sign-in")
  }

  // ── Access check ───────────────────────────────────────────
  const { project, access, isOwner } = await hasProjectAccess(
    roomID,
    identity.userId,
    identity.allEmails
  )

  if (!project || !access) {
    return <AccessDenied />
  }

  // ── Workspace shell ────────────────────────────────────────
  return (
    <WorkspaceShell
      projectId={project.id}
      projectName={project.name}
      isOwner={isOwner}
    />
  )
}
