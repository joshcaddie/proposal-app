import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { sendProposalEmail } from "@/lib/email";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const proposal = await prisma.proposal.findFirst({
    where: { id: params.id, agencyId: userId },
  });
  if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + proposal.validDays);

  await prisma.proposal.update({
    where: { id: proposal.id },
    data: { status: "SENT", sentAt: new Date(), expiresAt },
  });

  const proposalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/p/${proposal.token}`;

  await sendProposalEmail({
    clientEmail: proposal.clientEmail,
    clientName: proposal.clientName,
    agencyName: proposal.agencyName,
    proposalTitle: proposal.title,
    proposalUrl,
  });

  return NextResponse.json({ ok: true });
}
