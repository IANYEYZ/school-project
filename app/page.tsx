// app/page.tsx
import { prisma } from "@/lib/prisma";
import { startOfToday, subDays } from "date-fns";
import Container from "@/components/Container";
import Card from "@/components/Card";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const today = startOfToday();
  const weekAgo = subDays(today, 7);

  const classes = await prisma.class.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const todaysScores = await prisma.score.findMany({
    where: { date: today },
  });

  const weeklyScores = await prisma.score.findMany({
    where: { date: { gte: weekAgo } },
  });

  const todayMap = new Map<string, { noon?: number; after?: number }>();
  for (const s of todaysScores) {
    if (!todayMap.has(s.classId)) todayMap.set(s.classId, {});
    const rec = todayMap.get(s.classId)!;
    if (s.period === "NOON") rec.noon = s.value;
    else if (s.period === "AFTER_SCHOOL") rec.after = s.value;
  }

  const weekMap = new Map<string, { sum: number; count: number }>();
  for (const s of weeklyScores) {
    if (!weekMap.has(s.classId)) weekMap.set(s.classId, { sum: 0, count: 0 });
    const rec = weekMap.get(s.classId)!;
    rec.sum += s.value;
    rec.count += 1;
  }

  function fmtAvg(classId: string) {
    const r = weekMap.get(classId);
    if (!r || r.count === 0) return "—";
    return (r.sum / r.count).toFixed(1);
  }

  return (
    <Container className="space-y-8 py-6">
      <h1 className="text-3xl font-semibold">班级评分仪表盘</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => {
          const t = todayMap.get(cls.id);

          return (
            <Card key={cls.id}>
              <h2 className="text-xl font-medium mb-2">{cls.name}</h2>

              <div className="text-sm space-y-1">
                <p>
                  <span className="text-gray-500">今日中午：</span>
                  <span className="font-medium">{t?.noon ?? "未填写"}</span>
                </p>
                <p>
                  <span className="text-gray-500">今日放学：</span>
                  <span className="font-medium">{t?.after ?? "未填写"}</span>
                </p>
                <p className="mt-2">
                  <span className="text-gray-500">本周平均：</span>
                  <span className="text-lg font-bold">{fmtAvg(cls.id)}</span>
                </p>
              </div>

              <a
                href={`/classes/${cls.id}`}
                className="inline-block mt-4 text-blue-600 hover:underline text-sm"
              >
                查看详情 →
              </a>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}
