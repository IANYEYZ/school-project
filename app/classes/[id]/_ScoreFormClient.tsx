"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function ScoreFormClient({ classId }: { classId: string }) {
  // ✅ ALL hooks first
  const { data: session, status } = useSession();

  const [noon, setNoon] = useState("");
  const [after, setAfter] = useState("");
  const [noonNote, setNoonNote] = useState("");
  const [afterNote, setAfterNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const canEdit =
    session?.user?.role === "ADMIN" ||
    session?.user?.role === "EDITOR";

  const noonNum = noon ? parseInt(noon, 10) : null;
  const afterNum = after ? parseInt(after, 10) : null;

  const noonError = noonNum !== null && (noonNum < 0 || noonNum > 10);
  const afterError = afterNum !== null && (afterNum < 0 || afterNum > 10);

  const isValid = !noonError && !afterError && (noonNum !== null || afterNum !== null);

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
    if (noonNote) body.noonNote = noonNote;
    if (after) body.after = parseInt(after, 10);
    if (afterNote) body.afterNote = afterNote;

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
          min="0"
          max="10"
          className={`mt-1 block w-full rounded border px-2 py-1 ${
            noonError
              ? "border-red-500 bg-red-50"
              : "border-gray-300"
          }`}
          placeholder="例如 8 (0-10)"
        />
        {noonError && (
          <p className="text-xs text-red-600 mt-1">成绩必须在 0 到 10 之间</p>
        )}
        <textarea
          value={noonNote}
          onChange={(e) => setNoonNote(e.target.value)}
          className="mt-2 block w-full rounded border border-gray-300 px-2 py-1 text-sm"
          placeholder="中午备注 (可选)"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">放学后成绩</label>
        <input
          type="number"
          value={after}
          onChange={(e) => setAfter(e.target.value)}
          min="0"
          max="10"
          className={`mt-1 block w-full rounded border px-2 py-1 ${
            afterError
              ? "border-red-500 bg-red-50"
              : "border-gray-300"
          }`}
          placeholder="例如 9 (0-10)"
        />
        {afterError && (
          <p className="text-xs text-red-600 mt-1">成绩必须在 0 到 10 之间</p>
        )}
        <textarea
          value={afterNote}
          onChange={(e) => setAfterNote(e.target.value)}
          className="mt-2 block w-full rounded border border-gray-300 px-2 py-1 text-sm"
          placeholder="放学后备注 (可选)"
          rows={2}
        />
      </div>

      <button
        type="submit"
        disabled={busy || !isValid}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {busy ? "保存中…" : "保存今日成绩"}
      </button>

      {msg && <p className="text-sm mt-1">{msg}</p>}
    </form>
  );
}
