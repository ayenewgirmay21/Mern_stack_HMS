import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// 🌱 Load environment variables
config({ path: "./config/config.env" });

// 🧠 Connect to database
dbConnection();

// 🍪 Parse cookies & JSON
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📂 File uploads (temporary storage)
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// 🧩 CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local frontend
      "http://localhost:5174", // local dashboard
      process.env.FRONTEND_URL,
      process.env.DASHBOARD_URL,
      "https://mern-mediserve.onrender.com", // deployed frontend
    ],
    credentials: true, // allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 📡 Serve uploaded images (local storage)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 📡 API routes
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

// 🏗️ Serve frontend and dashboard static files
app.use(express.static(path.join(__dirname, "public/frontend")));
app.use("/dashboard", express.static(path.join(__dirname, "public/dashboard")));

// 🟢 SPA routing for Dashboard
app.get("/dashboard/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/dashboard", "index.html"));
});

// 🟢 SPA routing for Frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/frontend", "index.html"));
});

// ⚠️ Error Middleware (last)
app.use(errorMiddleware);

export default app;
