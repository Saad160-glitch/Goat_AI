import { auth, currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export interface Project {
  id: string
  name: string
  slug: string
  isOwned: boolean
}

export function slugifyProjectName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function getOwnedProjects(userId: string): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  })

  return projects.map((p) => ({
    id: p.id,
    name: p.name,
    slug: slugifyProjectName(p.name) || p.id,
    isOwned: true,
  }))
}

export async function getSharedProjects(userEmails: string[]): Promise<Project[]> {
  if (!userEmails || userEmails.length === 0) {
    return []
  }

  const projects = await prisma.project.findMany({
    where: {
      collaborators: {
        some: {
          collaboratorEmail: { in: userEmails },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return projects.map((p) => ({
    id: p.id,
    name: p.name,
    slug: slugifyProjectName(p.name) || p.id,
    isOwned: false,
  }))
}

export async function getProjectsForCurrentUser(): Promise<Project[]> {
  const { userId } = await auth()
  if (!userId) {
    return []
  }

  const user = await currentUser()
  const emails = user?.emailAddresses?.map((e) => e.emailAddress) ?? []

  const [owned, shared] = await Promise.all([
    getOwnedProjects(userId),
    getSharedProjects(emails),
  ])

  return [...owned, ...shared]
}
