import "dotenv/config"; // ✅ Load environment variables at the very top
import express from "express";
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
import tradeRoutes from "./routes/tradeRoutes.js";
import tradeActionsRoutes from "./routes/tradeActionsRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import tradeDiaryRoutes from "./routes/tradeDiaryRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import clientAuthRoutes from "./routes/clientAuthRoutes.js";
import marketSetupRoutes from "./routes/marketsetupRoutes.js";
import tradeSetupRoutes from "./routes/tradesetupRoutes.js";
import tradeStrategyRoutes from "./routes/tradeStrategyRoutes.js";
import planSubscriptionRoutes from "./routes/planSubscriptionRoutes.js";
import cookieParser from "cookie-parser";

connectDB();

const app = express();

app.use(cookieParser());
// ✅ Enable CORS (allow requests from frontend)
const whitelist = [
  "https://fantastic-kelpie-7dc39f.netlify.app",
  "https://unique-youtiao-11d4e5.netlify.app",
  "https://classy-begonia-022eef.netlify.app",
  "https://fantastic-kelpie-7dc39f.netlify.app",
  "https://sensational-maamoul-174c61.netlify.app",
  "https://chipper-rugelach-27e08f.netlify.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow server-to-server / Postman
    if (whitelist.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ Parse JSON bodies (should be before your routes)
app.use(express.json());

// ✅ Serve static files from uploads directory (for backward compatibility, but images are now on Cloudinary)
// app.use("/uploads", express.static("uploads"));

// ✅ Your routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users/market-trend", marketTrendRoutes);
app.use("/api/users/market-phase", marketPhaseRoutes);
app.use("/api/admin/leads", leadRoutes);
app.use("/api/crm", crmRoutes);
app.use("/api/market-insights", marketInsightRoutes);
app.use("/api/marketsetup", marketSetupRoutes);
app.use("/api/research-reports", researchReportRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/trade-actions", tradeActionsRoutes);
app.use("/api/plan-subscriptions", planSubscriptionRoutes);

app.use("/api/subscription", subscriptionRoutes);
app.use("/api/trade-diary", tradeDiaryRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/clients", clientRoutes);
app.use("/client/auth", clientAuthRoutes);
app.use("/api/tradesetup", tradeSetupRoutes);
app.use("/api/trade-strategies", tradeStrategyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
