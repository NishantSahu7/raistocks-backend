// import "dotenv/config"; // ✅ Load environment variables at the very top
// import express from "express";
// import cors from "cors"; // ✅ import CORS
// import userRoutes from "./routes/userRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";
// import marketTrendRoutes from "./routes/marketTrendRoutes.js";
// import marketPhaseRoutes from "./routes/marketPhaseRoutes.js";
// import leadRoutes from "./routes/leadRoutes.js";
// import crmRoutes from "./routes/crmRoutes.js";
// import connectDB from "./config/db.js";
// import marketInsightRoutes from "./routes/marketInsightRoutes.js";
// import researchReportRoutes from "./routes/researchReportRoutes.js";
// import tradeRoutes from "./routes/tradeRoutes.js";
// import tradeActionsRoutes from "./routes/tradeActionsRoutes.js";
// import subscriptionRoutes from "./routes/subscriptionRoutes.js";
// import tradeDiaryRoutes from "./routes/tradeDiaryRoutes.js";
// import supportRoutes from "./routes/supportRoutes.js";
// import clientRoutes from "./routes/clientRoutes.js";
// import clientAuthRoutes from "./routes/clientAuthRoutes.js";
// import marketSetupRoutes from "./routes/marketsetupRoutes.js";
// import tradeSetupRoutes from "./routes/tradesetupRoutes.js";
// import tradeStrategyRoutes from "./routes/tradeStrategyRoutes.js";
// import planSubscriptionRoutes from "./routes/planSubscriptionRoutes.js";
// import cookieParser from "cookie-parser";
// import invoiceRoutes from "./routes/invoiceRoutes.js";
// import { getDashboardStats } from "./controllers/dashboardController.js";
// import fileUpload from "express-fileupload";
// import kycRoutes from "./routes/kycRoutes.js";
// import "./cronJobs/subscriptionManager.js";
// import { Server } from "socket.io";


// connectDB();

// const app = express();

// app.use(cookieParser());
// // ✅ Enable CORS (allow requests from frontend)
// const whitelist = [
//   "https://fantastic-kelpie-7dc39f.netlify.app",
//   "https://unique-youtiao-11d4e5.netlify.app",
//   "https://classy-begonia-022eef.netlify.app",
//   "https://fantastic-kelpie-7dc39f.netlify.app",
//   "https://sensational-maamoul-174c61.netlify.app",
//   "https://chipper-rugelach-27e08f.netlify.app",
//   "http://localhost:5173",
//   "http://localhost:3000",
//   "http://localhost:5174",
//   "http://localhost:5175",
//   "http://localhost:5176",
//   "https://hc8lbxls-5000.inc1.devtunnels.ms",
// ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin) return callback(null, true); // allow server-to-server / Postman
//     if (whitelist.includes(origin)) return callback(null, true);
//     return callback(new Error("Not allowed by CORS"));
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//   credentials: true,
// };

// app.use(cors(corsOptions));
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });
// // Store connected clients
// global.onlineUsers = new Map();
// io.on("connection", (socket) => {
//   console.log("Client connected:", socket.id);

//   socket.on("registerUser", (userId) => {
//     onlineUsers.set(userId, socket.id);
//   });


// socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
// });
// export const sendNotification = (userId, message) => {
//   const socketId = onlineUsers.get(userId);
//   if (socketId) {
//     io.to(socketId).emit("notification", message);
//   }
// };  // ✅ Parse JSON bodies (should be before your routes)
// app.use(express.json());
// app.use(
//   fileUpload({
//     useTempFiles: true, // saves uploaded files temporarily
//     tempFileDir: "/tmp/",
//   })
// );
// // ✅ Serve static files from uploads directory (for backward compatibility, but images are now on Cloudinary)
// // app.use("/uploads", express.static("uploads"));

// // ✅ Your routes
// app.use("/api/users", userRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/users/market-trend", marketTrendRoutes);
// app.use("/api/users/market-phase", marketPhaseRoutes);
// app.use("/api/admin/leads", leadRoutes);
// app.use("/api/crm", crmRoutes);
// app.use("/api/market-insights", marketInsightRoutes);
// app.use("/api/marketsetup", marketSetupRoutes);
// app.use("/api/research-reports", researchReportRoutes);
// app.use("/api/trades", tradeRoutes);
// app.use("/api/trade-actions", tradeActionsRoutes);
// app.use("/api/plan-subscriptions", planSubscriptionRoutes);

// app.use("/api/subscription", subscriptionRoutes);
// app.use("/api/trade-diary", tradeDiaryRoutes);
// app.use("/api/support", supportRoutes);
// app.use("/api/clients", clientRoutes);
// app.use("/client/auth", clientAuthRoutes);
// app.use("/api/tradesetup", tradeSetupRoutes);
// app.use("/api/trade-strategies", tradeStrategyRoutes);
// app.use("/api/invoice", invoiceRoutes);
// app.use("/api/dashboard", getDashboardStats);
// app.use("/api/kyc", kycRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

// ------------ Import All Routes ---------------
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import marketTrendRoutes from "./routes/marketTrendRoutes.js";
import marketPhaseRoutes from "./routes/marketPhaseRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import crmRoutes from "./routes/crmRoutes.js";
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
import invoiceRoutes from "./routes/invoiceRoutes.js";
import kycRoutes from "./routes/kycRoutes.js";
import { getDashboardStats } from "./controllers/dashboardController.js";
import "./cronJobs/subscriptionManager.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import coupanRoutes from "./routes/couponRoutes.js";
// -------------------------------------------------
connectDB();
const app = express();

// ---------- CORS SETUP ----------
// const whitelist = [
//   "https://fantastic-kelpie-7dc39f.netlify.app",
//   "https://unique-youtiao-11d4e5.netlify.app",
//   "https://classy-begonia-022eef.netlify.app",
//   "https://sensational-maamoul-174c61.netlify.app",
//   "https://chipper-rugelach-27e08f.netlify.app",
//   "http://localhost:5173",
//   "http://localhost:3000",
//   "http://localhost:5174",
//   "http://localhost:5175",
//   "http://localhost:5176",
//   "https://www.dashboard.raistocks.com",
//   "https://www.crm.raistocks.com"
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || whitelist.includes(origin)) callback(null, true);
//       else callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//   })
// );
 app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);


// ------------ MIDDLEWARES --------------
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(express.json());
app.use(cookieParser());


// ------------ REGISTER ROUTES ----------
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
app.use("/api/invoice", invoiceRoutes);
app.use("/api/dashboard", getDashboardStats);
app.use("/api/kyc", kycRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/coupons", coupanRoutes);
// ------------ HTTP + SOCKET.IO SETUP ------------
const server = http.createServer(app);

//  export const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost:5173",
//       "http://localhost:5174",
//       "http://localhost:5175",
//       "https://your-railway-domain.up.railway.app",
//       "https://www.dashboard.raistocks.com",
//       "https://www.crm.raistocks.com"
//     ],
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });
export const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store connected clients
global.onlineUsers = new Map();

// Socket IO Connection
io.on("connection", (socket) => {
  console.log("Client Connected:", socket.id);

  socket.on("registerUser", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Client Disconnected:", socket.id);
  });
});

// // 🔥 Send notification to a specific user
// export const sendNotification = (userId, message) => {
//   const socketId = onlineUsers.get(userId);
//   if (socketId) io.to(socketId).emit("notification", message);
// };

// 🔥 Send notification to ALL clients
export const sendNotificationToAll = (message) => {
  io.emit("notification", message);
};

// ------------ START SERVER -------------
const PORT = process.env.PORT || 8000;
server.listen(PORT, () =>
  console.log(`Server + Socket.io running on port ${PORT}`)
);
