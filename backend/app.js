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

// 🌱 Load env
config({ path: "./config/config.env" });

// 🧠 Database connection
dbConnection();

// 🍪 Parse cookies & JSON
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📂 File uploads
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// 🧩 CORS fix
app.use(
  cors({
    origin: [
      "http://localhost:5173", // frontend
      "http://localhost:5174", // dashboard
      process.env.FRONTEND_URL,
      process.env.DASHBOARD_URL,
      "https://mern-mediserve.onrender.com", // deployed
    ],
    credentials: true, // important to allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 📡 API routes
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

// 🏗️ Frontend & Dashboard static
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public/frontend")));
app.use("/dashboard", express.static(path.join(__dirname, "public/dashboard")));

// SPA routing
app.get("/dashboard/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/dashboard", "index.html"));
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/frontend", "index.html"));
});

// ⚠️ Error middleware
app.use(errorMiddleware);

export default app;
