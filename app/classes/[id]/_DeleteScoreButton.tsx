"use client";

import { useState } from "react";

export default function DeleteScoreButton({ scoreId }: { scoreId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("确定要删除这个成绩吗？")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/scores/${scoreId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert("删除失败: " + (data.error ?? "未知错误"));
      } else {
        alert("删除成功");
        window.location.reload();
      }
    } catch (error) {
      alert("删除失败");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="ml-2 text-xs text-red-600 hover:text-red-800 disabled:opacity-50 underline"
      title="删除成绩"
    >
      {isDeleting ? "删除中..." : "删除"}
    </button>
  );
}
