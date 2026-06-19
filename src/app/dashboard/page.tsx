import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "#a8a3a0",
  SENT: "#3b82f6",
  VIEWED: "#f59e0b",
  ACCEPTED: "#1f8a5b",
  EXPIRED: "#d8473b",
};

export default async function DashboardPage() {
  const { userId } = auth();
  if (!userId) return null;

  const proposals = await prisma.proposal.findMany({
    where: { agencyId: userId },
    orderBy: { createdAt: "desc" },
    include: { acceptance: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold" style={{ color: "var(--near-black)" }}>
          Proposals
        </h1>
      </div>

      {proposals.length === 0 ? (
        <div
          className="rounded-2xl border p-12 text-center"
          style={{ background: "#fff", borderColor: "var(--hairline)" }}
        >
          <p style={{ color: "var(--muted)" }}>No proposals yet.</p>
          <Link
            href="/dashboard/proposals/new"
            className="mt-4 inline-block px-6 py-3 rounded-full font-bold text-white text-sm"
            style={{ background: "var(--coral)" }}
          >
            Create your first proposal
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ background: "#fff", borderColor: "var(--hairline)" }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--hairline)" }}>
                {["Title", "Client", "Status", "Created", ""].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {proposals.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--hairline)" }}>
                  <td className="px-6 py-4 font-semibold" style={{ color: "var(--near-black)" }}>
                    {p.title}
                  </td>
                  <td className="px-6 py-4" style={{ color: "var(--body-grey)" }}>
                    {p.clientName}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-2 py-1 rounded text-xs font-bold uppercase"
                      style={{ background: STATUS_COLORS[p.status] + "22", color: STATUS_COLORS[p.status] }}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: "var(--muted)" }}>
                    {new Date(p.createdAt).toLocaleDateString("en-NZ")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/proposals/${p.id}`}
                      className="text-sm font-semibold"
                      style={{ color: "var(--coral)" }}
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
