import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import app from "./app.js";

dotenv.config({ path: "./config/config.env" });

// ✅ Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Start the server
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`🛠️  Dashboard URL: ${process.env.DASHBOARD_URL}`);
});
