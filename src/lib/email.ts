import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP2GO_HOST,
  port: Number(process.env.SMTP2GO_PORT) || 2525,
  auth: {
    user: process.env.SMTP2GO_USER,
    pass: process.env.SMTP2GO_PASS,
  },
});

interface SendProposalEmailParams {
  clientEmail: string;
  clientName: string;
  agencyName: string;
  proposalTitle: string;
  proposalUrl: string;
}

export async function sendProposalEmail({
  clientEmail,
  clientName,
  agencyName,
  proposalTitle,
  proposalUrl,
}: SendProposalEmailParams) {
  await transporter.sendMail({
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: clientEmail,
    subject: `${agencyName} has sent you a proposal: ${proposalTitle}`,
    html: `
      <p>Hi ${clientName},</p>
      <p>${agencyName} has shared a proposal with you: <strong>${proposalTitle}</strong></p>
      <p><a href="${proposalUrl}" style="background:#f0594c;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:700;">View Proposal</a></p>
      <p>This link is unique to you. The proposal will expire after the validity period.</p>
    `,
  });
}

interface SendAcceptanceEmailParams {
  clientEmail: string;
  agencyEmail: string;
  clientName: string;
  agencyName: string;
  proposalTitle: string;
  signedAt: string;
  proposalUrl: string;
}

export async function sendAcceptanceEmails({
  clientEmail,
  agencyEmail,
  clientName,
  agencyName,
  proposalTitle,
  signedAt,
  proposalUrl,
}: SendAcceptanceEmailParams) {
  const subject = `Proposal accepted: ${proposalTitle}`;
  const html = `
    <p>This is a confirmation that <strong>${clientName}</strong> accepted the proposal <strong>"${proposalTitle}"</strong> on ${signedAt}.</p>
    <p><a href="${proposalUrl}">View accepted proposal</a></p>
    <p>A PDF copy will be attached once your team generates it.</p>
  `;

  await transporter.sendMail({
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: clientEmail,
    subject,
    html,
  });

  await transporter.sendMail({
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: agencyEmail,
    subject: `[Agency] ${subject}`,
    html,
  });
}
