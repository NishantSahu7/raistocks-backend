import "dotenv/config";
import mongoose from "mongoose";
import Support from "./src/models/supportModel.js";
import Client from "./src/models/clientModel.js";
import { sendResolutionEmail } from "./src/utils/emailService.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const testSupportFlow = async () => {
  await connectDB();

  try {
    // Create a test client
    const testClient = await Client.create({
      name: "Test Client",
      email: "rukshandanadir@gmail.com",
      subscription: "Basic",
      daysLeft: 30,
    });
    console.log("Test client created:", testClient._id);

    // Create a support ticket
    const ticket = await Support.create({
      client: "Test Client",
      subject: "Test Issue",
      category: "Technical",
      opened: new Date(),
      status: "Pending",
      userId: testClient._id,
      email: "rukshandanadir@gmail.com",
    });
    console.log("Test ticket created:", ticket._id);

    // Simulate resolving the ticket (this calls sendResolutionEmail)
    console.log("Resolving ticket...");
    await sendResolutionEmail(
      "rukshandanadir@gmail.com",
      "Test Issue",
      "Test Client"
    );
    console.log("Email sent via direct call");

    // Clean up
    await Support.findByIdAndDelete(ticket._id);
    await Client.findByIdAndDelete(testClient._id);
    console.log("Test data cleaned up");
  } catch (error) {
    console.error("Test error:", error);
  } finally {
    mongoose.connection.close();
  }
};

testSupportFlow();
