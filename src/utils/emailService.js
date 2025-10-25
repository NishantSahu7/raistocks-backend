import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendResolutionEmail = async (to, subject, clientName) => {
  const mailOptions = {
    from: `"Support Team" <${process.env.SMTP_USER}>`,
    to,
    subject: `Issue Resolved: ${subject}`, // 👈 also appears in email subject line
    html: `
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
    `,
  };

  // (Optional) Log to console to verify email format
  console.log("📧 Sending email to:", to);
  console.log("📄 Subject:", subject);
  console.log("👤 Client Name:", clientName);
  console.log("✅ Email HTML preview:\n", mailOptions.html);

  const info = await transporter.sendMail(mailOptions);
  console.log("✅ Email sent successfully:", info.messageId);
};
