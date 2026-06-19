import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, clientName, clientEmail, preparedBy, agencyName, refNumber, validDays } = body;

  const proposal = await prisma.proposal.create({
    data: {
      token: nanoid(16),
      agencyId: userId,
      title,
      clientName,
      clientEmail,
      preparedBy,
      agencyName,
      refNumber,
      validDays: Number(validDays) || 30,
      brief: { eyebrow: "THE BRIEF", heading: `A new ${title.toLowerCase()} for ${clientName}.`, paragraphs: [""] },
      features: [],
      sitePages: [],
      lineItems: [{ label: "Website design & build", amount: "$0 +GST", period: "one-off" }],
      addOns: [],
      paymentTerms: { terms: ["50% Deposit to begin", "50% On completion", "Annual Hosting from go-live"], note: "" },
    },
  });

  return NextResponse.json(proposal, { status: 201 });
}
