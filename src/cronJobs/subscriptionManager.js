import cron from "node-cron";
import Client from "../models/clientModel.js";
import { sendPlanExpiryReminderEmail } from "../utils/emailService.js";

 // // ⏰ Run daily at midnight.    cron.schedule("0 0 * * *", ...)
//                         // run everyminutes. cron.schedule("*/1 * * * *", ...)
cron.schedule("0 0 * * *", async () => {
  console.log("🕛 Running Subscription Cron...");

  try {
    // Fetch active clients
    const activeClients = await Client.find({
      daysLeft: { $gt: 0 },
      status: { $ne: "Expired" },
    });

    for (const client of activeClients) {
      // Decrease 1 day
      client.daysLeft -= 1;

      console.log(`🔄 Updating ${client.email} | Days Left: ${client.daysLeft}`);

      /* ---------------------------------------------------
       📩 1. Reminder Email (5 days → 1 day)
      ----------------------------------------------------*/
     
      if (client.daysLeft > 0 && client.daysLeft <= 30) {
  console.log("📧 Sending reminder email to:", client.email);

  await sendPlanExpiryReminderEmail(
    client.email,
    client.name,
    client.subscription,
    client.daysLeft
  );
 console.log("📨 Calling sendPlanExpiryReminderEmail...", client.email, client.daysLeft);

}


      

      // Save updated client
      await client.save();
    }

    console.log("✅ Cron cycle completed");
  } catch (err) {
    console.error("❌ Cron Error:", err.message);
  }
});

