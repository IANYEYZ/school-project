// app/api/export-scores/route.ts
import { prisma } from "@/lib/prisma";
import { ScorePeriod } from "@prisma/client";
import { parseISO } from "date-fns";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const classId = url.searchParams.get("classId");    // optional
  const fromDate = url.searchParams.get("from");
  const toDate = url.searchParams.get("to");
  const period = url.searchParams.get("period");      // "NOON", "AFTER_SCHOOL" or "BOTH"

  // Build where clause
  const where: any = {};
  if (classId) where.classId = classId;
  if (fromDate || toDate) {
    where.date = {};
    if (fromDate) where.date.gte = parseISO(fromDate);
    if (toDate) where.date.lte = parseISO(toDate);
  }
  if (period && period !== "BOTH") {
    where.period = period as ScorePeriod;
  }

  const scores = await prisma.score.findMany({
    where,
    orderBy: [{ classId: "asc" }, { date: "asc" }, { period: "asc" }],
  });

  // Build CSV string
  const header = ["classId", "date", "period", "value", "createdAt"];
  const lines = scores.map(s =>
    [
      `"${s.classId}"`,
      `"${s.date.toISOString().split("T")[0]}"`,
      `"${s.period}"`,
      s.value,
      `"${s.createdAt.toISOString()}"`
    ].join(",")
  );
  const csv = [header.join(","), ...lines].join("\n");

  const filename = `scores_export_${Date.now()}.csv`;
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
