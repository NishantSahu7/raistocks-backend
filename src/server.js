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
import globalMarketRoutes from "./routes/globalMarketRoutes.js";
import vixRoutes from "./routes/vixRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";
import tradeActionsRoutes from "./routes/tradeActionsRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import tradeDiaryRoutes from "./routes/tradeDiaryRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import clientAuthRoutes from "./routes/clientAuthRoutes.js";
import cookieParser from "cookie-parser";

connectDB();


const app = express();


app.use(cookieParser());
// ✅ Enable CORS (allow requests from frontend)
const whitelist = [
  "https://unique-youtiao-11d4e5.netlify.app",
  "https://classy-begonia-022eef.netlify.app",
  "https://fantastic-kelpie-7dc39f.netlify.app",
  "https://sensational-maamoul-174c61.netlify.app",
   "https://chipper-rugelach-27e08f.netlify.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
  "http://localhost:5175"

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

// ✅ Your routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users/market-trend", marketTrendRoutes);
app.use("/api/users/market-phase", marketPhaseRoutes);
app.use("/api/admin/leads", leadRoutes);
app.use("/api/crm", crmRoutes);
app.use("/api/market-insights", marketInsightRoutes);
app.use("/api/research-reports", researchReportRoutes);
app.use("/api/globalmarket", globalMarketRoutes);
app.use("/api/vix", vixRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/trade-actions", tradeActionsRoutes);

app.use("/api/subscription", subscriptionRoutes);
app.use("/api/trade-diary", tradeDiaryRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/client/auth", clientAuthRoutes); 





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
