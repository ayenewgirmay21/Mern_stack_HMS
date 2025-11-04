import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

// -------------------- CONFIGURE CLOUDINARY --------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------- PATIENT --------------------

// 🧍 Patient Register
export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } = req.body;

  if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password) {
    return next(new ErrorHandler("Please fill all fields!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) return next(new ErrorHandler("User already registered!", 400));

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Patient",
  });

  generateToken(user, "User registered successfully!", 200, res);
});

// 🔐 Login (Patient/Admin/Doctor)
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return next(new ErrorHandler("Please fill all fields!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid email or password!", 400));

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) return next(new ErrorHandler("Invalid email or password!", 400));

  if (role !== user.role) return next(new ErrorHandler(`User not found with this role!`, 400));

  generateToken(user, "Login successful!", 200, res);
});

// -------------------- ADMIN --------------------

// 🧑‍💼 Add New Admin
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } = req.body;

  if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password) {
    return next(new ErrorHandler("Please fill all fields!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) return next(new ErrorHandler("Admin with this email already exists!", 400));

  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Admin",
  });

  res.status(200).json({
    success: true,
    message: "New admin registered successfully!",
    admin,
  });
});

// -------------------- DOCTOR --------------------

// 👨‍⚕️ Add New Doctor
export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || !req.files.docAvatar) {
    return next(new ErrorHandler("Doctor avatar required!", 400));
  }

  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("File format not supported!", 400));
  }

  const { firstName, lastName, email, phone, nic, dob, gender, password, doctorDepartment } = req.body;
  if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password || !doctorDepartment) {
    return next(new ErrorHandler("Please fill all fields!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) return next(new ErrorHandler("Doctor with this email already exists!", 400));

  // Upload avatar to Cloudinary
  const fileBase64 = `data:${docAvatar.mimetype};base64,${docAvatar.data.toString("base64")}`;
  const cloudinaryResponse = await cloudinary.uploader.upload(fileBase64, { folder: "doctors" });

  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Doctor",
    doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(200).json({
    success: true,
    message: "New doctor registered successfully!",
    doctor,
  });
});

// -------------------- GET / FETCH --------------------

// 🩺 Get all doctors
export const getAllDoctors = catchAsyncErrors(async (req, res) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({ success: true, doctors });
});

// 👤 Get user profile
export const getUserDetails = catchAsyncErrors(async (req, res) => {
  const user = req.user;
  res.status(200).json({ success: true, user });
});

// -------------------- LOGOUT --------------------

// 🚪 Logout Admin
export const logoutAdmin = catchAsyncErrors(async (req, res) => {
  res.status(200).cookie("adminToken", "", { httpOnly: true, expires: new Date(Date.now()) }).json({
    success: true,
    message: "Admin logged out successfully!",
  });
});

// 🚪 Logout Patient
export const logoutPatient = catchAsyncErrors(async (req, res) => {
  res.status(200).cookie("patientToken", "", { httpOnly: true, expires: new Date(Date.now()) }).json({
    success: true,
    message: "Patient logged out successfully!",
  });
});
