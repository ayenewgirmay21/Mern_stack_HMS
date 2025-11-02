import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "MERN_STACK_HOSPITAL_MANAGEMENT_SYSTEM",
    })
    .then(() => console.log("✅ Connected to database!"))
    .catch((err) => console.error(`❌ Error connecting to database: $(err)`));
};