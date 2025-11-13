import cron from "node-cron";
import Client from "../models/clientModel.js";
import { sendEmail } from "../utils/emailService.js";


// ⏰ Run daily at midnight.    cron.schedule("0 0 * * *", ...)
                        // run everyminutes. cron.schedule("*/1 * * * *", ...)

cron.schedule("0 0 * * *", async () => {
  console.log("🕛 Running daily subscription manager...");

  try {
    // Find all active paying clients
    const activeClients = await Client.find({
      daysLeft: { $gt: 0 },
      status: { $ne: "Expired" },
    });

    for (const client of activeClients) {
      client.daysLeft -= 1;

      // Send reminder email if 5 or fewer days left
      if (client.daysLeft > 0 && client.daysLeft <= 5) {
        await sendEmail({
          to: client.email,
          subject: `⏳ Your ${client.subscription} plan expires in ${client.daysLeft} days`,
          html: `
            <h3>Hi ${client.name},</h3>
            <p>Your <b>${client.subscription}</b> plan will expire in <b>${client.daysLeft} days</b>.</p>
            <p>Renew your plan to continue enjoying premium benefits!</p>
            <a href="https://raistocks.com"
               style="background:#007bff;color:#fff;padding:10px 15px;border-radius:5px;text-decoration:none;">
               Renew Now
            </a>
            <br/><br/>
            <p>Thank you for staying with us,</p>
            <p><b>The ${process.env.APP_NAME || "Team"}</b></p>
          `
        });
        console.log(`📧 Reminder sent to ${client.email}`);
      }

      // When plan expires
      if (client.daysLeft <= 0) {
        client.daysLeft = 0;
        client.status = "Expired";

        await sendEmail({
          to: client.email,
          subject: `❌ Your ${client.subscription} plan has expired`,
          html: `
            <h3>Hi ${client.name},</h3>
            <p>Your <b>${client.subscription}</b> subscription has expired.</p>
            <p>Renew now to regain access to your account features.</p>
            <a href="https://raistocks.com"
               style="background:#dc3545;color:#fff;padding:10px 15px;border-radius:5px;text-decoration:none;">
               Renew Now
            </a>
            <br/><br/>
            <p><b>Team ${process.env.APP_NAME || "Support"}</b></p>
          `
        });
        console.log(`❌ Expiration email sent to ${client.email}`);
      }

      await client.save();
    }

    console.log("✅ Daily subscription update completed.");
  } catch (err) {
    console.error("❌ Error in subscription manager cron:", err);
  }
});
