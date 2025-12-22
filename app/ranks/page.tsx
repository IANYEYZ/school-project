// app/ranks/page.tsx
import { prisma } from "@/lib/prisma";
import { startOfWeek, startOfToday } from "date-fns";
import Container from "@/components/Container";
import Card from "@/components/Card";
import RankBarChart from "./RankBarChart";

export const dynamic = "force-dynamic";

export default async function RankPage() {
  const today = startOfToday();
  const monday = startOfWeek(today, { weekStartsOn: 1 });

  const classes = await prisma.class.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const weekScores = await prisma.score.findMany({
    where: { date: { gte: monday, lte: today } },
  });

  const map = new Map<
    string,
    { sum: number; count: number; noonToday: number | null; afterToday: number | null }
  >();

  for (const cls of classes) {
    map.set(cls.id, { sum: 0, count: 0, noonToday: null, afterToday: null });
  }

  weekScores.forEach((s) => {
    const entry = map.get(s.classId);
    if (!entry) return;

    entry.sum += s.value;
    entry.count++;

    const isToday = s.date.toDateString() === today.toDateString();
    if (isToday) {
      if (s.period === "NOON") entry.noonToday = s.value;
      if (s.period === "AFTER_SCHOOL") entry.afterToday = s.value;
    }
  });

  const ranks = classes.map((cls) => {
    const r = map.get(cls.id)!;
    const avg = r.count > 0 ? r.sum / r.count : null;
    return {
      id: cls.id,
      name: cls.name,
      avg,
      noonToday: r.noonToday,
      afterToday: r.afterToday,
      count: r.count,
    };
  });

  ranks.sort((a, b) => {
    if (a.avg === null && b.avg === null) return 0;
    if (a.avg === null) return 1;
    if (b.avg === null) return -1;
    return b.avg - a.avg;
  });

  // For bar chart
  const labels = ranks.map((r) => r.name);
  const data = ranks.map((r) => (r.avg !== null ? Number(r.avg.toFixed(1)) : 0));

  // Build CSV link
  const csvParams = new URLSearchParams();
  csvParams.set("from", monday.toISOString().split("T")[0]);
  csvParams.set("to", today.toISOString().split("T")[0]);
  const csvUrl = `/api/export-scores?${csvParams.toString()}`;

  return (
    <Container className="py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">本周班级排名</h1>

        <a
          href={csvUrl}
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
        >
          导出本周排名 CSV
        </a>
      </div>

      <Card>
        {ranks.length === 0 ? (
          <p className="text-sm text-gray-500">暂无成绩数据。</p>
        ) : (
          <div className="h-64">
            <RankBarChart labels={labels} data={data} />
          </div>
        )}
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">名次</th>
                <th className="p-2 text-left">班级</th>
                <th className="p-2 text-left">平均成绩</th>
                <th className="p-2 text-left">今日中午</th>
                <th className="p-2 text-left">今日放学</th>
                <th className="p-2 text-left">记录天数</th>
              </tr>
            </thead>
            <tbody>
              {ranks.map((r, idx) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2">{r.name}</td>
                  <td className="p-2 font-medium">
                    {r.avg !== null ? r.avg.toFixed(1) : "—"}
                  </td>
                  <td className="p-2">{r.noonToday ?? "—"}</td>
                  <td className="p-2">{r.afterToday ?? "—"}</td>
                  <td className="p-2">{r.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Container>
  );
}
