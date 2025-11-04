import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

// Admin authentication
export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.adminToken;
  if (!token) return next(new ErrorHandler("Dashboard User not authenticated!", 401));

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch {
    return next(new ErrorHandler("Invalid or expired token!", 401));
  }

  const user = await User.findById(decoded.id);
  if (!user) return next(new ErrorHandler("Admin not found!", 404));
  if (user.role !== "Admin") return next(new ErrorHandler("Admin not authorized!", 403));

  req.user = user;
  next();
});

// Patient authentication
export const isPatientAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.patientToken;
  if (!token) return next(new ErrorHandler("User not authenticated!", 401));

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch {
    return next(new ErrorHandler("Invalid or expired token!", 401));
  }

  const user = await User.findById(decoded.id);
  if (!user) return next(new ErrorHandler("Patient not found!", 404));
  if (user.role !== "Patient") return next(new ErrorHandler("Patient not authorized!", 403));

  req.user = user;
  next();
});
