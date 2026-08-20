import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Params = { params: Promise<{ projectId: string }> };

// ── helpers ────────────────────────────────────────────────────

/** Resolve the authenticated user's emails via Clerk safely. */
async function getUserEmails(userId: string): Promise<string[]> {
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    return user?.emailAddresses?.map((e) => e.emailAddress.toLowerCase()) ?? [];
  } catch (err) {
    console.error("Failed to fetch user emails from Clerk:", err);
    return [];
  }
}

// ── GET /api/projects/[projectId]/collaborators ─────────────────
// Returns the enriched collaborator list. Accessible by owner or any collaborator.
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { collaborators: { orderBy: { createdAt: "asc" } } },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const isOwner = project.ownerId === userId;
    let isCollaborator = false;

    if (!isOwner) {
      const userEmails = await getUserEmails(userId);
      isCollaborator = project.collaborators.some((c) =>
        userEmails.includes(c.collaboratorEmail.toLowerCase())
      );
    }

    if (!isOwner && !isCollaborator) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Enrich each collaborator email with Clerk display data
    let enriched = project.collaborators.map((c) => ({
      email: c.collaboratorEmail,
      displayName: null as string | null,
      imageUrl: null as string | null,
    }));

    try {
      const clerk = await clerkClient();
      enriched = await Promise.all(
        project.collaborators.map(async (c) => {
          try {
            const res = await clerk.users.getUserList({
              emailAddress: [c.collaboratorEmail],
              limit: 1,
            });
            const found = res.data[0] ?? null;
            const displayName = found
              ? ([found.firstName, found.lastName].filter(Boolean).join(" ") ||
                  found.username ||
                  null)
              : null;
            return {
              email: c.collaboratorEmail,
              displayName,
              imageUrl: found?.imageUrl ?? null,
            };
          } catch {
            return { email: c.collaboratorEmail, displayName: null, imageUrl: null };
          }
        })
      );
    } catch (clerkErr) {
      console.error("Clerk enrichment failed, falling back to raw emails:", clerkErr);
    }

    return NextResponse.json({ collaborators: enriched, isOwner });
  } catch (err) {
    console.error("GET /api/projects/[projectId]/collaborators error:", err);
    return NextResponse.json(
      { error: "Failed to load collaborators" },
      { status: 500 }
    );
  }
}

// ── POST /api/projects/[projectId]/collaborators ────────────────
// Invite a collaborator by email. Owner only.
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { collaborators: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.ownerId !== userId) {
      return NextResponse.json({ error: "Only the project owner can invite collaborators" }, { status: 403 });
    }

    let email: string | undefined;
    try {
      const body = await request.json();
      email =
        typeof body?.email === "string" ? body.email.trim().toLowerCase() : undefined;
    } catch {
      // Body may not be valid JSON
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    // Prevent inviting the owner's own email
    const ownerEmails = await getUserEmails(userId);
    if (ownerEmails.includes(email)) {
      return NextResponse.json(
        { error: "You cannot invite yourself" },
        { status: 400 }
      );
    }

    // Prevent duplicate invite
    const alreadyCollaborator = project.collaborators.some(
      (c) => c.collaboratorEmail.toLowerCase() === email
    );
    if (alreadyCollaborator) {
      return NextResponse.json(
        { error: "This person is already a collaborator" },
        { status: 400 }
      );
    }

    const newCollaborator = await prisma.projectCollaborator.create({
      data: { projectId, collaboratorEmail: email },
    });

    return NextResponse.json(newCollaborator, { status: 201 });
  } catch (err) {
    console.error("POST /api/projects/[projectId]/collaborators error:", err);
    return NextResponse.json(
      { error: "Failed to invite collaborator" },
      { status: 500 }
    );
  }
}
