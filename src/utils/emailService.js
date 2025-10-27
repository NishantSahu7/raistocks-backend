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
