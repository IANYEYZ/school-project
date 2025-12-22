// app/export/page.tsx
"use client";

import { useState } from "react";

export default function ExportPage() {
  const [classId, setClassId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [period, setPeriod] = useState<"BOTH" | "NOON" | "AFTER_SCHOOL">("BOTH");

  function buildUrl() {
    const params = new URLSearchParams();
    if (classId) params.set("classId", classId);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (period) params.set("period", period);
    return `/api/export-scores?${params.toString()}`;
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">导出成绩 (CSV)</h1>

      <div>
        <label className="block mb-1">班级 ID (留空 = 全部)</label>
        <input
          type="text"
          value={classId}
          onChange={e => setClassId(e.target.value)}
          className="w-full rounded border-gray-300"
          placeholder="例如: cmf…（复制 class id）"
        />
      </div>

      <div className="flex gap-2">
        <div>
          <label className="block mb-1">开始日期</label>
          <input
            type="date"
            value={from}
            onChange={e => setFrom(e.target.value)}
            className="rounded border-gray-300"
          />
        </div>
        <div>
          <label className="block mb-1">结束日期</label>
          <input
            type="date"
            value={to}
            onChange={e => setTo(e.target.value)}
            className="rounded border-gray-300"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1">包含时间段</label>
        <select
          value={period}
          onChange={e => setPeriod(e.target.value as any)}
          className="rounded border-gray-300"
        >
          <option value="BOTH">全部</option>
          <option value="NOON">中午</option>
          <option value="AFTER_SCHOOL">放学后</option>
        </select>
      </div>

      <a
        href={buildUrl()}
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        下载 CSV
      </a>
    </div>
  );
}
