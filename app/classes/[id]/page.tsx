// app/classes/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ScoreFormClient from "./_ScoreFormClient";
import { ScorePeriod } from "@prisma/client";
import { startOfToday, subDays } from "date-fns";
import ScoreHistoryChart from "../ScoreHistoryChart";
import Container from "@/components/Container";
import Card from "@/components/Card";

export const dynamic = "force-dynamic";

export default async function ClassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const cls = await prisma.class.findUnique({
    where: { id },
    select: { id: true, name: true },
  });
  if (!cls) return notFound();

  const today = startOfToday();
  const from = subDays(today, 30);

  const scores = await prisma.score.findMany({
    where: { classId: cls.id, date: { gte: from } },
    orderBy: [{ date: "asc" }, { period: "asc" }],
  });

  // Build date → { noon, after }
  const map = new Map<string, { noon: number | null; after: number | null }>();
  scores.forEach(s => {
    const d = s.date.toISOString().split("T")[0];
    if (!map.has(d)) map.set(d, { noon: null, after: null });
    const rec = map.get(d)!;
    if (s.period === ScorePeriod.NOON) rec.noon = s.value;
    else if (s.period === ScorePeriod.AFTER_SCHOOL) rec.after = s.value;
  });

  const dates = Array.from(map.keys());
  const noonData = dates.map(d => map.get(d)!.noon);
  const afterData = dates.map(d => map.get(d)!.after);

  const allValues = scores.map(s => s.value);
  const min = allValues.length ? Math.min(...allValues) : null;
  const max = allValues.length ? Math.max(...allValues) : null;
  const avg = allValues.length
    ? (allValues.reduce((a, b) => a + b, 0) / allValues.length).toFixed(1)
    : null;

  return (
    <Container className="py-6 space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">{cls.name}</h1>
        <p className="text-sm text-gray-500">过去 30 天成绩统计</p>
      </header>

      {/* Input / Update Score Section */}
      <Card>
        <h2 className="text-lg font-medium mb-4">今日成绩 — 输入 / 更新</h2>
        <ScoreFormClient classId={cls.id} />
      </Card>

      {/* History Table */}
      <Card>
        <h2 className="text-lg font-medium mb-4">成绩历史 (表格)</h2>
        {scores.length === 0 ? (
          <p className="text-sm text-gray-500">暂无记录。</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left text-sm font-medium text-gray-700">日期</th>
                  <th className="p-2 text-left text-sm font-medium text-gray-700">中午</th>
                  <th className="p-2 text-left text-sm font-medium text-gray-700">放学后</th>
                </tr>
              </thead>
              <tbody>
                {dates.slice().reverse().map(d => {
                  const rec = map.get(d)!;
                  return (
                    <tr key={d} className="border-b hover:bg-gray-50">
                      <td className="p-2 text-sm text-gray-800">{d}</td>
                      <td className="p-2 text-sm text-gray-800">{rec.noon ?? "-"}</td>
                      <td className="p-2 text-sm text-gray-800">{rec.after ?? "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Chart */}
      <Card>
        <h2 className="text-lg font-medium mb-4">成绩趋势 (图表)</h2>
        {dates.length > 0 ? (
          <div className="h-64">
            <ScoreHistoryChart labels={dates} noonData={noonData} afterData={afterData} />
          </div>
        ) : (
          <p className="text-sm text-gray-500">暂无数据以绘制图表。</p>
        )}
      </Card>

      {/* Stats */}
      <Card>
        <h2 className="text-lg font-medium mb-4">统计</h2>
        <div className="text-sm space-y-1">
          <p>记录天数：{dates.length}</p>
          <p>最低成绩：{min ?? "—"}</p>
          <p>最高成绩：{max ?? "—"}</p>
          <p>平均成绩：{avg ?? "—"}</p>
        </div>
      </Card>
    </Container>
  );
}
