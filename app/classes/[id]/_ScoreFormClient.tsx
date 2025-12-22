"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function ScoreFormClient({ classId }: { classId: string }) {
  // ✅ ALL hooks first
  const { data: session, status } = useSession();

  const [noon, setNoon] = useState("");
  const [after, setAfter] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const canEdit =
    session?.user?.role === "ADMIN" ||
    session?.user?.role === "EDITOR";

  // Optional: loading state
  if (status === "loading") {
    return (
      <div className="rounded border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
        权限检查中…
      </div>
    );
  }

  // Read-only users
  if (!canEdit) {
    return (
      <div className="rounded border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
        🔒 登录后可修改成绩
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);

    const body: any = { classId };
    if (noon) body.noon = parseInt(noon, 10);
    if (after) body.after = parseInt(after, 10);

    const res = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setBusy(false);

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setMsg("失败: " + (j.error ?? "未知错误"));
    } else {
      setMsg("保存成功");
      window.location.reload();
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 max-w-sm">
      <div>
        <label className="block text-sm font-medium">中午成绩</label>
        <input
          type="number"
          value={noon}
          onChange={(e) => setNoon(e.target.value)}
          className="mt-1 block w-full rounded border border-gray-300 px-2 py-1"
          placeholder="例如 85"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">放学后成绩</label>
        <input
          type="number"
          value={after}
          onChange={(e) => setAfter(e.target.value)}
          className="mt-1 block w-full rounded border border-gray-300 px-2 py-1"
          placeholder="例如 90"
        />
      </div>

      <button
        type="submit"
        disabled={busy}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {busy ? "保存中…" : "保存今日成绩"}
      </button>

      {msg && <p className="text-sm mt-1">{msg}</p>}
    </form>
  );
}
