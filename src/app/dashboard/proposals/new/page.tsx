"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProposalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    const res = await fetch("/api/proposals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) { setError("Something went wrong."); setLoading(false); return; }
    const data = await res.json();
    router.push(`/dashboard/proposals/${data.id}`);
  }

  const field = (name: string, label: string, type = "text", placeholder = "") => (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>{label}</label>
      <input
        name={name} type={type} required={["title","clientName","clientEmail","preparedBy","agencyName","refNumber"].includes(name)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border text-sm"
        style={{ border: "1px solid var(--hairline)", background: "var(--subtle)", fontFamily: "Manrope, sans-serif" }}
      />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold mb-8" style={{ color: "var(--near-black)" }}>New Proposal</h1>
      <form onSubmit={handleSubmit} className="rounded-2xl border p-8 space-y-5" style={{ background: "#fff", borderColor: "var(--hairline)" }}>
        {field("title", "Proposal title", "text", "e.g. Website Design & Build")}
        {field("clientName", "Client name", "text", "e.g. Aquifer Mapping")}
        {field("clientEmail", "Client email", "email", "client@example.com")}
        {field("preparedBy", "Prepared by", "text", "Your name")}
        {field("agencyName", "Agency name", "text", "Caddie Digital")}
        {field("refNumber", "Reference number", "text", "e.g. CD-2026-001")}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>Valid for (days)</label>
          <input name="validDays" type="number" defaultValue={30} className="w-full px-4 py-3 rounded-xl border text-sm" style={{ border: "1px solid var(--hairline)", background: "var(--subtle)" }} />
        </div>
        {error && <p className="text-sm" style={{ color: "var(--coral-hover)" }}>{error}</p>}
        <button type="submit" disabled={loading} className="w-full py-4 rounded-full font-bold text-white" style={{ background: "var(--coral)" }}>
          {loading ? "Creating…" : "Create Proposal"}
        </button>
      </form>
    </div>
  );
}
