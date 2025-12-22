import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function requireRole(role: string) {
  const session = await requireAuth();
  if (session.user!.role !== role) throw new Error("Forbidden");
  return session;
}
