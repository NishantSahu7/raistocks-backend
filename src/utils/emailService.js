// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// /* -----------------------------------------------------------
//  📩 1. Send Ticket Resolution Email
// ----------------------------------------------------------- */
// export const sendResolutionEmail = async (to, subject, clientName) => {
//   const html = `
//     <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
//       <h2 style="color: #4CAF50;">Hello ${clientName || "Valued User"},</h2>
//       <p>We’re writing to let you know that your issue regarding
//       <strong>"${subject}"</strong> has been successfully <strong>resolved</strong>.</p>

//       <p>If you have any additional concerns or experience the same issue again,
//       please don’t hesitate to contact us.</p>

//       <p>Thank you for your patience and for being part of our community!</p>

//       <br/>
//       <p style="font-style: italic;">– The Support Team</p>
//     </div>
//   `;

//   console.log("📧 Sending resolution email to:", to);
//   console.log("📄 Subject:", subject);
//   console.log("👤 Client Name:", clientName);

//   try {
//     const data = await resend.emails.send({
//       from: process.env.FROM_EMAIL, // Must be verified in Resend
//       to: [to],
//       subject: `Issue Resolved: ${subject}`,
//       html,
//     });
//     console.log("✅ Resolution email sent successfully:", data.id);
//   } catch (error) {
//     console.error("❌ Error sending resolution email:", error);
//     throw error;
//   }
// };

// /* -----------------------------------------------------------
//  📩 2. Send Reply Email (Admin reply to client)
// ----------------------------------------------------------- */
// export const sendReplyEmail = async (clientEmail, ticketSubject, clientName, replyMessage) => {
//   const html = `
//     <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
//       <h2 style="color: #4CAF50;">Hello ${clientName || "User"},</h2>
//       <p>There’s a new reply to your ticket regarding <strong>"${ticketSubject}"</strong>:</p>
//       <blockquote style="border-left: 4px solid #4CAF50; margin: 10px 0; padding-left: 10px;">${replyMessage}</blockquote>
//       <p>If you have any additional questions, feel free to reply to this email.</p>
//       <br/>
//       <p style="font-style: italic;">– The Support Team</p>
//     </div>
//   `;

//   console.log("📧 Sending reply email to:", clientEmail);
//   console.log("📄 Subject:", ticketSubject);

//   try {
//     const data = await resend.emails.send({
//       from: process.env.FROM_EMAIL,
//       to: [clientEmail],
//       subject: `Reply: ${ticketSubject}`,
//       html,
//     });
//     console.log("✅ Reply email sent successfully:", data.id);
//   } catch (err) {
//     console.error("❌ Error sending reply email:", err);
//     throw err;
//   }
// };

// /* -----------------------------------------------------------
//  📩 3. Send Ticket Creation Confirmation Email
// ----------------------------------------------------------- */
// export const sendTicketCreationEmail = async (to, clientName, subject, ticketId) => {
//   const html = `
//     <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
//       <h2 style="color: #4CAF50;">Hello ${clientName || "User"},</h2>
//       <p>Thank you for reaching out to us. Your support ticket has been successfully created.</p>

//       <p><strong>Ticket ID:</strong> ${ticketId}</p>
//       <p><strong>Subject:</strong> ${subject}</p>

//       <p>Our support team will review your issue and get back to you shortly.</p>

//       <br/>
//       <p>We appreciate your patience.</p>
//       <p style="font-style: italic;">– The Support Team</p>
//     </div>
//   `;

//   console.log("📧 Sending ticket creation email to:", to);
//   console.log("🆔 Ticket ID:", ticketId);
//   console.log("📄 Subject:", subject);

//   try {
//     const data = await resend.emails.send({
//       from: process.env.FROM_EMAIL, // Must be a verified sender
//       to: [to],
//       subject: `Ticket #${ticketId} Created Successfully`,
//       html,
//     });
//     console.log("✅ Ticket creation email sent successfully:", data.id);
//   } catch (error) {
//     console.error("❌ Error sending ticket creation email:", error);
//     throw error;
//   }
// };
// utils/emailService.js
import { Resend } from "resend";
import {
  ticketResolutionTemplate,
  ticketReplyTemplate,
  ticketCreationTemplate,
  planExpiryReminderTemplate,
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



