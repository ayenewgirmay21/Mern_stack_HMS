import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

import app from "./app.js";
import cloudinary from "cloudinary";

// Cloudinary setup
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Cloudinary configured for: ${process.env.CLOUDINARY_CLOUD_NAME}`);
});
