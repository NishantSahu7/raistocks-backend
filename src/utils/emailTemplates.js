// utils/emailTemplates.js

// 🟢 1. Ticket Resolution Email
export const ticketResolutionTemplate = (clientName, subject) => `
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

// 🟢 2. Ticket Reply Email
export const ticketReplyTemplate = (clientName, ticketSubject, replyMessage) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color: #4CAF50;">Hello ${clientName || "User"},</h2>
    <p>There’s a new reply to your ticket regarding <strong>"${ticketSubject}"</strong>:</p>
    <blockquote style="border-left: 4px solid #4CAF50; margin: 10px 0; padding-left: 10px;">
      ${replyMessage}
    </blockquote>
    <p>If you have any additional questions, feel free to reply to this email.</p>
    <br/>
    <p style="font-style: italic;">– The Support Team</p>
  </div>
`;

// 🟢 3. Ticket Creation Email
export const ticketCreationTemplate = (clientName, subject, ticketId) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color: #4CAF50;">Hello ${clientName || "User"},</h2>
    <p>Thank you for reaching out to us. Your support ticket has been successfully created.</p>

    <p><strong>Ticket ID:</strong> ${ticketId}</p>
    <p><strong>Subject:</strong> ${subject}</p>

    <p>Our support team will review your issue and get back to you shortly.</p>

    <br/>
    <p>We appreciate your patience.</p>
    <p style="font-style: italic;">– The Support Team</p>
  </div>
`;

// 🟢 4. Subscription Expiry Reminder Email
export const planExpiryReminderTemplate = (clientName, planName, daysLeft) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color: #f39c12;">Hello ${clientName || "User"},</h2>
    <p>This is a friendly reminder that your <strong>${planName}</strong> plan will expire in 
    <strong>${daysLeft} days</strong>.</p>

    <p>To avoid interruption of services, please renew your plan before the expiry date.</p>

    <p><a href="https://raistocks.com" 
      style="background: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
      Renew Now
    </a></p>

    <br/>
    <p style="font-style: italic;">– The Support Team</p>
  </div>
`;

// 🟢 5. KYC Approved Email
export const kycApprovedTemplate = (clientName) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color: #4CAF50;">Hello ${clientName || "User"},</h2>

    <p>🎉 Great news! Your <strong>KYC verification</strong> has been 
    <strong style="color:green;">successfully approved</strong>.</p>

    <p>You now have full access to your account and all premium features.</p>

    <br/>
    <p>If you have any questions, feel free to reach out to our support team.</p>

    <p style="font-style: italic;">– The Team</p>
  </div>
`;
