import { auth } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SendButton from "./SendButton";

export default async function ProposalDetailPage({ params }: { params: { id: string } }) {
  const { userId } = auth();
  const proposal = await prisma.proposal.findFirst({
    where: { id: params.id, agencyId: userId! },
    include: { acceptance: true, events: { orderBy: { createdAt: "desc" } } },
  });
  if (!proposal) notFound();

  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/p/${proposal.token}`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/dashboard" className="text-sm" style={{ color: "var(--muted)" }}>← Dashboard</Link>
      </div>
      <div className="rounded-2xl border p-8" style={{ background: "#fff", borderColor: "var(--hairline)" }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold" style={{ color: "var(--near-black)" }}>{proposal.title}</h1>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Client: {proposal.clientName} · {proposal.clientEmail}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase" style={{ background: "var(--coral-tint)", color: "var(--coral)" }}>
            {proposal.status}
          </span>
        </div>

        <div className="space-y-2 text-sm" style={{ color: "var(--body-grey)" }}>
          <p><strong>Ref:</strong> {proposal.refNumber}</p>
          <p><strong>Prepared by:</strong> {proposal.preparedBy}</p>
          <p><strong>Valid for:</strong> {proposal.validDays} days</p>
          <p><strong>Created:</strong> {new Date(proposal.createdAt).toLocaleDateString("en-NZ")}</p>
          {proposal.sentAt && <p><strong>Sent:</strong> {new Date(proposal.sentAt).toLocaleDateString("en-NZ")}</p>}
        </div>

        {proposal.acceptance && (
          <div className="mt-6 p-4 rounded-xl" style={{ background: "#e8f5ef", border: "1px solid #a7d7bc" }}>
            <p className="text-sm font-bold" style={{ color: "var(--success)" }}>
              ✓ Accepted by {proposal.acceptance.fullName} on {proposal.acceptance.signedDate}
            </p>
          </div>
        )}

        <div className="mt-6 flex gap-3 flex-wrap">
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full border text-sm font-semibold"
            style={{ borderColor: "var(--hairline)", color: "var(--near-black)" }}
          >
            Preview →
          </a>
          {proposal.status === "DRAFT" && <SendButton proposalId={proposal.id} />}
        </div>
      </div>
    </div>
  );
}
