import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import AcceptancePanel from "./AcceptancePanel";

export const dynamic = "force-dynamic";

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-NZ", { day: "numeric", month: "long", year: "numeric" });
}

export default async function PublicProposalPage({ params }: { params: { token: string } }) {
  const proposal = await prisma.proposal.findUnique({
    where: { token: params.token },
    include: { acceptance: true },
  });

  if (!proposal) notFound();

  // Expire check
  if (proposal.expiresAt && new Date() > proposal.expiresAt && proposal.status !== "ACCEPTED") {
    await prisma.proposal.update({ where: { id: proposal.id }, data: { status: "EXPIRED" } });
  }

  // Log viewed event (fire-and-forget)
  if (proposal.status === "SENT") {
    const hdrs = await headers();
    const ip = hdrs.get("x-forwarded-for") ?? "";
    const ua = hdrs.get("user-agent") ?? "";
    prisma.proposalEvent.create({ data: { proposalId: proposal.id, type: "VIEWED", ipAddress: ip, userAgent: ua } }).catch(() => {});
    prisma.proposal.update({ where: { id: proposal.id }, data: { status: "VIEWED" } }).catch(() => {});
  }

  const brief = proposal.brief as any;
  const features = (proposal.features as any[]) || [];
  const sitePages = (proposal.sitePages as any[]) || [];
  const lineItems = (proposal.lineItems as any[]) || [];
  const addOns = (proposal.addOns as any[]) || [];
  const paymentTerms = proposal.paymentTerms as any;
  const isAccepted = proposal.status === "ACCEPTED";
  const isExpired = proposal.status === "EXPIRED";

  const sentDate = proposal.sentAt ? formatDate(proposal.sentAt) : formatDate(proposal.createdAt);
  const expiryDate = proposal.expiresAt ? formatDate(proposal.expiresAt) : "";

  return (
    <div style={{ background: "var(--page-bg)", minHeight: "100vh", padding: "48px 24px 80px" }}>
      <div style={{ maxWidth: 920, margin: "0 auto", background: "#fff", borderRadius: 20, boxShadow: "0 30px 70px -40px rgba(32,37,42,0.45)", overflow: "hidden" }}>

        {/* Cover */}
        <div style={{ background: "var(--ink)", padding: "64px 64px 56px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48 }}>
            <div style={{ height: 42, display: "flex", alignItems: "center" }}>
              {proposal.logoUrl ? (
                <img src={proposal.logoUrl} alt={proposal.agencyName} style={{ height: 42 }} />
              ) : (
                <span className="font-display font-bold text-xl" style={{ color: "#fff" }}>{proposal.agencyName}</span>
              )}
            </div>
            <div className="font-mono-accent text-right" style={{ fontSize: 12, color: "#a8a3a0", lineHeight: 1.7 }}>
              <div>PROPOSAL · {sentDate}</div>
              <div>REF {proposal.refNumber}</div>
            </div>
          </div>
          <div className="font-mono-accent" style={{ fontSize: 11, color: "var(--coral)", letterSpacing: "0.14em", marginBottom: 16 }}>
            WEBSITE DESIGN &amp; BUILD PROPOSAL
          </div>
          <h1 className="font-display" style={{ fontSize: 50, fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 40 }}>
            {brief?.heading || `A new proposal for ${proposal.clientName}.`}
          </h1>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div>
              <div style={{ fontSize: 11, color: "#6b7177", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 6 }}>PREPARED FOR</div>
              <div style={{ color: "#fff", fontWeight: 600 }}>{proposal.clientName}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#6b7177", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 6 }}>PREPARED BY</div>
              <div style={{ color: "#fff", fontWeight: 600 }}>{proposal.preparedBy}</div>
            </div>
          </div>
        </div>

        {/* 01 · The brief */}
        {brief && (
          <section style={{ padding: "48px 64px 12px" }}>
            <div className="font-mono-accent" style={{ fontSize: 11, color: "var(--coral)", letterSpacing: "0.14em", marginBottom: 12 }}>
              01 · THE BRIEF
            </div>
            <h2 className="font-display" style={{ fontSize: 32, fontWeight: 700, color: "var(--near-black)", marginBottom: 20 }}>
              {brief.heading}
            </h2>
            {(brief.paragraphs || []).map((p: string, i: number) => (
              <p key={i} style={{ fontSize: 16, color: "var(--body-grey)", lineHeight: 1.7, marginBottom: 16 }}>{p}</p>
            ))}
          </section>
        )}

        {/* 02 · What we'll build */}
        {features.length > 0 && (
          <section style={{ padding: "48px 64px 12px" }}>
            <div className="font-mono-accent" style={{ fontSize: 11, color: "var(--coral)", letterSpacing: "0.14em", marginBottom: 12 }}>
              02 · WHAT WE'LL BUILD
            </div>
            <h2 className="font-display" style={{ fontSize: 32, fontWeight: 700, color: "var(--near-black)", marginBottom: 28 }}>
              What we&apos;ll build.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {features.map((f: any, i: number) => (
                <div key={i} style={{ background: "var(--subtle)", border: "1px solid var(--hairline)", borderRadius: 16, padding: 26 }}>
                  <div style={{ width: 36, height: 36, background: "var(--coral-tint)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <span style={{ width: 8, height: 8, background: "var(--coral)", borderRadius: "50%", display: "block" }} />
                  </div>
                  <div className="font-display" style={{ fontWeight: 700, marginBottom: 8, color: "var(--near-black)" }}>{f.title}</div>
                  <div style={{ fontSize: 14.5, color: "var(--body-grey)", lineHeight: 1.6 }}>{f.body}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 03 · Site structure */}
        {sitePages.length > 0 && (
          <section style={{ padding: "48px 64px 12px" }}>
            <div className="font-mono-accent" style={{ fontSize: 11, color: "var(--coral)", letterSpacing: "0.14em", marginBottom: 12 }}>
              03 · SITE STRUCTURE
            </div>
            <h2 className="font-display" style={{ fontSize: 32, fontWeight: 700, color: "var(--near-black)", marginBottom: 28 }}>
              Site structure.
            </h2>
            <div style={{ border: "1px solid var(--hairline)", borderRadius: 16, overflow: "hidden" }}>
              {sitePages.map((p: any, i: number) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "54px 200px 1fr", gap: 0, padding: "16px 24px", borderBottom: i < sitePages.length - 1 ? "1px solid var(--hairline)" : "none", alignItems: "center" }}>
                  <span className="font-mono-accent" style={{ fontSize: 12, color: "var(--muted)" }}>{p.num}</span>
                  <span style={{ fontWeight: 600, color: "var(--near-black)" }}>{p.name}</span>
                  <span style={{ fontSize: 14.5, color: "var(--body-grey)" }}>{p.description}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 04 · Investment */}
        {lineItems.length > 0 && (
          <section style={{ padding: "48px 64px 12px" }}>
            <div className="font-mono-accent" style={{ fontSize: 11, color: "var(--coral)", letterSpacing: "0.14em", marginBottom: 12 }}>
              04 · INVESTMENT
            </div>
            <h2 className="font-display" style={{ fontSize: 32, fontWeight: 700, color: "var(--near-black)", marginBottom: 28 }}>
              Investment.
            </h2>
            <div style={{ border: "1px solid var(--hairline)", borderRadius: 16, overflow: "hidden" }}>
              {lineItems.map((item: any, i: number) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: i < lineItems.length - 1 ? "1px solid var(--hairline)" : "none" }}>
                  <span style={{ fontWeight: 600, color: "var(--near-black)" }}>{item.label}</span>
                  <div className="text-right">
                    <div className="font-display font-bold" style={{ color: "var(--near-black)" }}>{item.amount}</div>
                    {item.period && <div style={{ fontSize: 12, color: "var(--muted)" }}>{item.period}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Add-ons */}
        {addOns.length > 0 && (
          <section style={{ padding: "48px 64px 12px" }}>
            <div style={{ background: "var(--ink)", borderRadius: 16, padding: 28 }}>
              <div className="font-mono-accent" style={{ fontSize: 11, color: "var(--coral)", letterSpacing: "0.14em", marginBottom: 12 }}>
                OPTIONAL ADD-ON
              </div>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${addOns.length}, 1fr)`, gap: 16 }}>
                {addOns.map((addon: any, i: number) => (
                  <div key={i} style={{ background: "#2e3338", border: "1px solid #3a4045", borderRadius: 12, padding: 20 }}>
                    <div style={{ fontWeight: 700, color: "#fff", marginBottom: 6 }}>{addon.title}</div>
                    {addon.adSpend && <div className="font-display font-bold" style={{ fontSize: 24, color: "#fff" }}>{addon.adSpend}</div>}
                    {addon.management && <div style={{ fontSize: 13, color: "#a8a3a0", marginTop: 4 }}>{addon.management}</div>}
                    {addon.body && <div style={{ fontSize: 13, color: "#a8a3a0", marginTop: 4 }}>{addon.body}</div>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 05 · Summary */}
        {paymentTerms && (
          <section style={{ padding: "48px 64px 12px" }}>
            <div className="font-mono-accent" style={{ fontSize: 11, color: "var(--coral)", letterSpacing: "0.14em", marginBottom: 12 }}>
              05 · SUMMARY
            </div>
            <h2 className="font-display" style={{ fontSize: 32, fontWeight: 700, color: "var(--near-black)", marginBottom: 28 }}>
              Summary.
            </h2>
            <div style={{ border: "1px solid var(--hairline)", borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
              {(paymentTerms.terms || []).map((term: string, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 24px", borderBottom: i < paymentTerms.terms.length - 1 ? "1px solid var(--hairline)" : "none", background: i === 0 ? "var(--coral-tint)" : "#fff" }}>
                  <span style={{ fontWeight: 600, color: "var(--near-black)" }}>{term}</span>
                </div>
              ))}
            </div>
            {paymentTerms.note && <p style={{ fontSize: 13, color: "var(--muted)" }}>{paymentTerms.note}</p>}
          </section>
        )}

        {/* 06 · Acceptance panel */}
        <section style={{ padding: "48px 64px 48px" }}>
          <AcceptancePanel
            token={proposal.token}
            clientName={proposal.clientName}
            agencyName={proposal.agencyName}
            isAccepted={isAccepted}
            isExpired={isExpired}
            acceptanceName={proposal.acceptance?.fullName}
            acceptanceDate={proposal.acceptance?.signedDate}
          />
        </section>

        {/* Footer */}
        <div style={{ background: "var(--ink)", padding: "30px 64px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="font-display font-bold" style={{ color: "#fff" }}>{proposal.agencyName}</span>
          <span className="font-mono-accent" style={{ fontSize: 11, color: "#6b7177" }}>
            Proposal valid for {proposal.validDays} days{expiryDate ? ` · Expires ${expiryDate}` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
