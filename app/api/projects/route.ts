import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/projects — list all projects owned by the authenticated user
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(projects);
}

// POST /api/projects — create a new project for the authenticated user
export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let name: string | undefined;
  let id: string | undefined;

  try {
    const body = await request.json();
    name = typeof body?.name === "string" ? body.name.trim() : undefined;
    id = typeof body?.id === "string" ? body.id.trim() : undefined;
  } catch {
    // Body may be empty or non-JSON — that is fine; name stays undefined
  }

  const project = await prisma.project.create({
    data: {
      ...(id ? { id } : {}),
      ownerId: userId,
      name: name || "Untitled Project",
    },
  });

  return NextResponse.json(project, { status: 201 });
}
