import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// DELETE handler
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Check session to make sure the user has the correct permissions
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    (session.user as any)?.role !== "ADMIN" &&
    (session.user as any)?.role !== "EDITOR"
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const deletedScore = await prisma.score.delete({
      where: { id },
    });

    return NextResponse.json(deletedScore);
  } catch (error) {
    console.error("Error deleting score:", error);
    return NextResponse.json({ error: "Error deleting score" }, { status: 500 });
  }
}
