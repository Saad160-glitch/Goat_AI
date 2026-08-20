import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Params = { params: Promise<{ projectId: string; email: string }> };

// DELETE /api/projects/[projectId]/collaborators/[email]
// Removes a collaborator by email. Owner only.
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, email: encodedEmail } = await params;
  const email = decodeURIComponent(encodedEmail).toLowerCase();

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  if (project.ownerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const collaborator = await prisma.projectCollaborator.findUnique({
    where: {
      projectId_collaboratorEmail: {
        projectId,
        collaboratorEmail: email,
      },
    },
  });

  if (!collaborator) {
    return NextResponse.json({ error: "Collaborator not found" }, { status: 404 });
  }

  await prisma.projectCollaborator.delete({
    where: {
      projectId_collaboratorEmail: {
        projectId,
        collaboratorEmail: email,
      },
    },
  });

  return new NextResponse(null, { status: 204 });
}
