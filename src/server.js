import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // ✅ import CORS
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import marketTrendRoutes from "./routes/marketTrendRoutes.js";
import marketPhaseRoutes from "./routes/marketPhaseRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import crmRoutes from "./routes/crmRoutes.js";
import connectDB from "./config/db.js";
import marketInsightRoutes from "./routes/marketInsightRoutes.js";
 import researchReportRoutes from "./routes/researchReportRoutes.js"; 

dotenv.config();
connectDB();

const app = express();

// ✅ Enable CORS (allow requests from frontend)
 
app.use(
  cors({
    origin: ["https://unique-youtiao-11d4e5.netlify.app/admin/dashboard"], // 👈 your live frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


// ✅ Parse JSON bodies
app.use(express.json());

// ✅ Your routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users/market-trend", marketTrendRoutes);
app.use("/api/users/market-phase", marketPhaseRoutes);
app.use("/api/admin/leads", leadRoutes);
app.use("/api/admin/user-management", crmRoutes);
app.use("/api/market-insights", marketInsightRoutes);
app.use("/api/research-reports", researchReportRoutes);

 


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
