import "dotenv/config";
import { sendResolutionEmail } from "./src/utils/emailService.js";

const testEmail = async () => {
  try {
    console.log("Testing email send to rukshandanadir@gmail.com...");
    await sendResolutionEmail(
      "rukshandanadir@gmail.com",
      "Test Subject",
      "Test Client"
    );
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

testEmail();
