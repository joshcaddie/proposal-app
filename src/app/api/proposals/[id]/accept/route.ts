import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAcceptanceEmails } from "@/lib/email";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { fullName, position, signatureText, signedDate } = body;

  if (!fullName || !signatureText) {
    return NextResponse.json({ error: "Name and signature are required." }, { status: 400 });
  }

  const proposal = await prisma.proposal.findFirst({
    where: { token: id },
  });

  if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (proposal.status === "ACCEPTED") return NextResponse.json({ error: "Already accepted." }, { status: 409 });
  if (proposal.status === "EXPIRED") return NextResponse.json({ error: "This proposal has expired." }, { status: 410 });

  const ip = req.headers.get("x-forwarded-for") ?? "";
  const ua = req.headers.get("user-agent") ?? "";

  await prisma.acceptance.create({
    data: { proposalId: proposal.id, fullName, position, signatureText, signedDate, ipAddress: ip, userAgent: ua },
  });

  await prisma.proposal.update({
    where: { id: proposal.id },
    data: { status: "ACCEPTED" },
  });

  await prisma.proposalEvent.create({
    data: { proposalId: proposal.id, type: "ACCEPTED", ipAddress: ip, userAgent: ua },
  });

  const proposalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/p/${proposal.token}`;

  // Get agency email from Clerk or fallback — for now use a placeholder
  const agencyEmail = process.env.FROM_EMAIL || "agency@example.com";

  await sendAcceptanceEmails({
    clientEmail: proposal.clientEmail,
    agencyEmail,
    clientName: fullName,
    agencyName: proposal.agencyName,
    proposalTitle: proposal.title,
    signedAt: signedDate,
    proposalUrl,
  });

  return NextResponse.json({ ok: true, fullName, signedDate });
}
