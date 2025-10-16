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
 import globalMarketRoutes from "./routes/globalMarketRoutes.js";
 import vixRoutes from "./routes/vixRoutes.js"
 import tradeRoutes from "./routes/tradeRoutes.js"
 import tradeActionsRoutes from "./routes/tradeActionsRoutes.js";


dotenv.config();
connectDB();

const app = express();

// ✅ Enable CORS (allow requests from frontend)
const whitelist = [
  "https://unique-youtiao-11d4e5.netlify.app",
  "https://classy-begonia-022eef.netlify.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow server-to-server / Postman
    if (whitelist.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
};

app.use(cors(corsOptions));

// ✅ Parse JSON bodies
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


 


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
