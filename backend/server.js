import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import app from "./app.js";
import cors from "cors";

dotenv.config({ path: "./config/config.env" });

// CORS setup for frontend and dashboard
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
  credentials: true
}));

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Start server
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`🛠️  Dashboard URL: ${process.env.DASHBOARD_URL}`);
});
