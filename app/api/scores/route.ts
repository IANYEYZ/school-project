// app/api/scores/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ScorePeriod } from "@prisma/client";
import { startOfToday } from "date-fns";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    // Check session to ensure only logged-in users can create/modify scores
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { classId, noon, noonNote, after, afterNote } = await req.json();
    const date = startOfToday();

    const ops: Promise<any>[] = [];

    if (typeof noon === "number") {
      ops.push(
        prisma.score.upsert({
          where: {
            classId_date_period: { classId, date, period: ScorePeriod.NOON },
          },
          update: { value: noon, note: noonNote || null },
          create: { classId, date, period: ScorePeriod.NOON, value: noon, note: noonNote || null },
        })
      );
    }
    if (typeof after === "number") {
      ops.push(
        prisma.score.upsert({
          where: {
            classId_date_period: { classId, date, period: ScorePeriod.AFTER_SCHOOL },
          },
          update: { value: after, note: afterNote || null },
          create: { classId, date, period: ScorePeriod.AFTER_SCHOOL, value: after, note: afterNote || null },
        })
      );
    }

    await Promise.all(ops);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Error in /api/scores:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
