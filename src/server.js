import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js"; // ✅ correct relative path
import adminRoutes from "./routes/adminRoutes.js";
import marketTrendRoutes from "./routes/marketTrendRoutes.js";
import marketPhaseRoutes from "./routes/marketPhaseRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";

import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users/market-trend", marketTrendRoutes);
app.use("/api/users/market-phase", marketPhaseRoutes);
app.use("/api/admin/leads", leadRoutes); // ← new route



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
