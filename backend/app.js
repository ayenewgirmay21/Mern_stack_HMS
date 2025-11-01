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

// 🧩 Enable CORS for your frontend & dashboard URLs
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://mern-mediserve.onrender.com", // ✅ Add your production URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


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

// 🧠 Database Connection
dbConnection();

// 📡 API Routes
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

// ⚙️ Serve Frontend and Dashboard (for Render deployment)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve frontend at root
app.use(express.static(path.join(__dirname, "public/frontend")));

// ✅ Serve dashboard at /dashboard
app.use("/dashboard", express.static(path.join(__dirname, "public/dashboard")));

// 🟢 Dashboard SPA routing
app.get("/dashboard/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/dashboard", "index.html"));
});

// 🟢 Frontend SPA routing (catch-all)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/frontend", "index.html"));
});

// ⚠️ Error Middleware (should be last)
app.use(errorMiddleware);

export default app;
