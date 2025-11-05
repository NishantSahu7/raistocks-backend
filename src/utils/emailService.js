import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResolutionEmail = async (to, subject, clientName) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #4CAF50;">Hello ${clientName || "Valued User"},</h2>
      <p>We’re writing to let you know that your issue regarding
      <strong>"${subject}"</strong> has been successfully <strong>resolved</strong>.</p>

      <p>If you have any additional concerns or experience the same issue again,
      please don’t hesitate to contact us.</p>

      <p>Thank you for your patience and for being part of our community!</p>

      <br/>
      <p style="font-style: italic;">– The Support Team</p>
    </div>
  `;

  // Log to console to verify email format
  console.log("📧 Sending email to:", to);
  console.log("📄 Subject:", subject);
  console.log("👤 Client Name:", clientName);
  console.log("✅ Email HTML preview:\n", html);

  try {
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL, // Must be a verified sender in Resend
      to: [to],
      subject: `Issue Resolved: ${subject}`,
      html: html,
    });
    console.log("✅ Email sent successfully:", data.id);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error; // Re-throw to handle in controller
  }
};

// utils/emailService.js
export const sendReplyEmail = async (clientEmail, ticketSubject, clientName, replyMessage) => {
  try {
    console.log("📧 Sending reply email to:", clientEmail);
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #4CAF50;">Hello ${clientName},</h2>
        <p>There is a new reply to your ticket regarding <strong>"${ticketSubject}"</strong>:</p>
        <blockquote style="border-left: 4px solid #4CAF50; margin: 10px 0; padding-left: 10px;">${replyMessage}</blockquote>
        <p>If you have any additional questions, feel free to reply to this email.</p>
        <br/>
        <p style="font-style: italic;">– The Support Team</p>
      </div>
    `;

    // replace this with your actual email sending code
    console.log("✅ Email HTML preview:\n", htmlContent);

    // pretend sending email, e.g., using nodemailer
    // await transporter.sendMail({ to: clientEmail, subject: `Reply: ${ticketSubject}`, html: htmlContent });

    console.log("✅ Email sent successfully");
  } catch (err) {
    console.error("❌ Error sending reply email:", err);
    throw err;
  }
};

