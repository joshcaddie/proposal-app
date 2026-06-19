"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SendButton({ proposalId }: { proposalId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSend() {
    setLoading(true);
    const res = await fetch(`/api/proposals/${proposalId}/send`, { method: "POST" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to send. Check your email config.");
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleSend}
      disabled={loading}
      className="px-5 py-2.5 rounded-full text-sm font-bold text-white"
      style={{ background: "var(--coral)" }}
    >
      {loading ? "Sending…" : "Send to client"}
    </button>
  );
}
