import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

// Dashboard (Admin) authentication
export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.adminToken;
  if (!token) return next(new ErrorHandler("Dashboard User is not authenticated!", 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);
  if (!req.user || req.user.role !== "Admin")
    return next(new ErrorHandler("Admin not authorized!", 403));

  next();
});

// Frontend (Patient) authentication
export const isPatientAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.patientToken;
  if (!token) return next(new ErrorHandler("User is not authenticated!", 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);
  if (!req.user || req.user.role !== "Patient")
    return next(new ErrorHandler("Patient not authorized!", 403));

  next();
});
