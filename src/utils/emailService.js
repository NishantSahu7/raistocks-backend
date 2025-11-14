import { Resend } from "resend";
import {
  ticketResolutionTemplate,
  ticketReplyTemplate,
  ticketCreationTemplate,
  planExpiryReminderTemplate,
  kycApprovedTemplate
} from "./emailTemplates.js";

const resend = new Resend(process.env.RESEND_API_KEY);

// 🟢 1. Send Ticket Resolution Email
export const sendResolutionEmail = async (to, subject, clientName) => {
  const html = ticketResolutionTemplate(clientName, subject);
  await sendEmail(to, `Issue Resolved: ${subject}`, html);
};

// 🟢 2. Send Reply Email
export const sendReplyEmail = async (clientEmail, ticketSubject, clientName, replyMessage) => {
  const html = ticketReplyTemplate(clientName, ticketSubject, replyMessage);
  await sendEmail(clientEmail, `Reply: ${ticketSubject}`, html);
};

// 🟢 3. Send Ticket Creation Email
export const sendTicketCreationEmail = async (to, clientName, subject, ticketId) => {
  const html = ticketCreationTemplate(clientName, subject, ticketId);
  await sendEmail(to, `Ticket #${ticketId} Created Successfully`, html);
};

// 🟢 4. Send Plan Expiry Reminder Email
export const sendPlanExpiryReminderEmail = async (to, clientName, planName, daysLeft) => {
  const html = planExpiryReminderTemplate(clientName, planName, daysLeft);
  await sendEmail(to, `Your ${planName} Plan Expires in ${daysLeft} Days`, html);
};

// 🧩 Helper Function
export const sendEmail = async (to, subject, html) => {
  try {
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL, // verified in Resend
      to: [to],
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to} with subject "${subject}" | ID: ${data.id}`);
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error);
  }
};


import { kycApprovedTemplate } from "./emailTemplates.js";

// 🟢 Send KYC Approved Email
export const sendKycApprovedEmail = async (to, clientName) => {
  const html = kycApprovedTemplate(clientName);
  await sendEmail(to, `Your KYC Has Been Approved 🎉`, html);
};

