export type ProposalStatus = "DRAFT" | "SENT" | "VIEWED" | "ACCEPTED" | "EXPIRED";

export interface Feature {
  title: string;
  body: string;
}

export interface SitePage {
  num: string;
  name: string;
  description: string;
}

export interface LineItem {
  label: string;
  amount: string;
  period?: string;
}

export interface AddOn {
  title: string;
  adSpend?: string;
  management?: string;
  body?: string;
}

export interface ProposalData {
  id: string;
  token: string;
  status: ProposalStatus;
  agencyId: string;
  title: string;
  clientName: string;
  clientEmail: string;
  preparedBy: string;
  agencyName: string;
  refNumber: string;
  validDays: number;
  createdAt: string;
  sentAt?: string | null;
  expiresAt?: string | null;
  logoUrl?: string | null;
  brief?: { eyebrow?: string; heading?: string; paragraphs?: string[] } | null;
  features?: Feature[] | null;
  sitePages?: SitePage[] | null;
  lineItems?: LineItem[] | null;
  addOns?: AddOn[] | null;
  paymentTerms?: { terms?: string[]; note?: string } | null;
  acceptance?: {
    fullName: string;
    position?: string | null;
    signedDate: string;
    serverTimestamp: string;
  } | null;
}
