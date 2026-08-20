import { auth, currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

// ── Clerk identity ─────────────────────────────────────────────

export interface ClerkIdentity {
  userId: string
  primaryEmail: string | null
  allEmails: string[]
}

/**
 * Returns the current Clerk user's id and email addresses.
 * Returns null when there is no authenticated session.
 */
export async function getCurrentClerkIdentity(): Promise<ClerkIdentity | null> {
  const { userId } = await auth()
  if (!userId) return null

  const user = await currentUser()
  const allEmails =
    user?.emailAddresses?.map((e) => e.emailAddress) ?? []
  const primaryEmail =
    user?.primaryEmailAddress?.emailAddress ?? allEmails[0] ?? null

  return { userId, primaryEmail, allEmails }
}

// ── Project access ─────────────────────────────────────────────

export interface ProjectAccessResult {
  project: { id: string; name: string; slug: string } | null
  access: boolean
  isOwner: boolean
}

/**
 * Checks whether the given user (by id or email) can access a project.
 * Returns the project record and whether access is granted.
 *
 * Access is granted when:
 *   - the user is the project owner (`ownerId === userId`), or
 *   - one of the user's email addresses is in the project's collaborators list.
 */
export async function hasProjectAccess(
  projectId: string,
  userId: string,
  userEmails: string[]
): Promise<ProjectAccessResult> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { collaborators: true },
  })

  if (!project) {
    return { project: null, access: false, isOwner: false }
  }

  const isOwner = project.ownerId === userId
  const isCollaborator = project.collaborators.some((c) =>
    userEmails.includes(c.collaboratorEmail)
  )

  return {
    project: {
      id: project.id,
      name: project.name,
      slug: project.id, // use id as stable slug for room routing
    },
    access: isOwner || isCollaborator,
    isOwner,
  }
}
