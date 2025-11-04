import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

// ---------------- Patient Register ----------------
export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } = req.body;
  if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password)
    return next(new ErrorHandler("Please fill all fields!", 400));

  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new ErrorHandler("User already registered!", 400));

  const user = await User.create({ firstName, lastName, email, phone, nic, dob, gender, password, role: "Patient" });
  generateToken(user, "Patient", res, "Patient registered successfully!");
});

// ---------------- Login ----------------
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) return next(new ErrorHandler("Fill all fields!", 400));

  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid credentials!", 400));

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return next(new ErrorHandler("Invalid credentials!", 400));
  if (user.role !== role) return next(new ErrorHandler(`User role mismatch!`, 400));

  generateToken(user, role, res, "Login successful!");
});

// ---------------- Add Admin ----------------
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } = req.body;
  if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password)
    return next(new ErrorHandler("Fill all fields!", 400));

  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) return next(new ErrorHandler("Admin already exists!", 400));

  const admin = await User.create({ firstName, lastName, email, phone, nic, dob, gender, password, role: "Admin" });
  res.status(201).json({ success: true, message: "Admin registered successfully!", admin });
});

// ---------------- Add Doctor ----------------
export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || !req.files.docAvatar)
    return next(new ErrorHandler("Doctor avatar required!", 400));

  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/jfif"];
  if (!allowedFormats.includes(docAvatar.mimetype))
    return next(new ErrorHandler("Unsupported file format!", 400));

  const { firstName, lastName, email, phone, nic, dob, gender, password, doctorDepartment } = req.body;
  if (!firstName || !lastName || !email || !phone || !password || !doctorDepartment)
    return next(new ErrorHandler("Please fill all required fields!", 400));

  const existingDoctor = await User.findOne({ email });
  if (existingDoctor) return next(new ErrorHandler("Doctor already exists!", 400));

  let uploadResult;
  try {
    uploadResult = await cloudinary.uploader.upload(
      `data:${docAvatar.mimetype};base64,${docAvatar.data.toString("base64")}`,
      { folder: "doctors" }
    );
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    return next(new ErrorHandler("Image upload failed!", 500));
  }

  const doctor = await User.create({
    firstName, lastName, email, phone, nic, dob, gender, password,
    role: "Doctor",
    doctorDepartment,
    docAvatar: { public_id: uploadResult.public_id, url: uploadResult.secure_url },
  });

  res.status(201).json({ success: true, message: "Doctor registered successfully!", doctor });
});

// ---------------- Get All Doctors ----------------
export const getAllDoctors = catchAsyncErrors(async (req, res) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({ success: true, doctors });
});

// ---------------- Get User Details ----------------
export const getUserDetails = catchAsyncErrors(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// ---------------- Logout ----------------
export const logout = catchAsyncErrors(async (req, res) => {
  res
    .cookie("adminToken", "", { httpOnly: true, expires: new Date(0), secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" })
    .cookie("patientToken", "", { httpOnly: true, expires: new Date(0), secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" })
    .status(200).json({ success: true, message: "Logged out successfully!" });
});
