import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import cloudinary from "cloudinary";

// ============================ ADD NEW ADMIN ============================
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, password } = req.body;

  if (!firstName || !lastName || !email || !phone || !password) {
    return next(new ErrorHandler("Please fill all required fields", 400));
  }

  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) {
    return next(new ErrorHandler("Admin already exists with this email", 400));
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    role: "Admin",
  });

  res.status(201).json({
    success: true,
    message: "New admin added successfully!",
    admin,
  });
});

// ============================ ADD NEW DOCTOR ============================
export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    nic,
    dob,
    gender,
    doctorDepartment,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !doctorDepartment
  ) {
    return next(new ErrorHandler("Please fill all required fields", 400));
  }

  // Check existing doctor
  const existingDoctor = await User.findOne({ email });
  if (existingDoctor) {
    return next(new ErrorHandler("Doctor already exists with this email", 400));
  }

  // Check for avatar image
  if (!req.files || !req.files.docAvatar) {
    return next(new ErrorHandler("Doctor avatar image is required", 400));
  }

  const file = req.files.docAvatar;

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jfif"];
  if (!allowedTypes.includes(file.mimetype)) {
    return next(
      new ErrorHandler("Invalid image format. Use JPG, PNG, WEBP, or JFIF.", 400)
    );
  }

  let docAvatar = { public_id: "", url: "" };

  try {
    const uploadResult = await cloudinary.v2.uploader.upload(
      file.tempFilePath,
      {
        folder: "MediServe/Doctors",
        resource_type: "image",
      }
    );

    docAvatar.public_id = uploadResult.public_id;
    docAvatar.url = uploadResult.secure_url;
  } catch (err) {
    console.error("❌ Cloudinary Upload Error:", err);
    return next(
      new ErrorHandler("Image upload failed. Please try again.", 500)
    );
  }

  // Save doctor in DB
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    doctorDepartment,
    role: "Doctor",
    docAvatar,
  });

  res.status(201).json({
    success: true,
    message: "Doctor registered successfully!",
    doctor,
  });
});

// ============================ GET ALL DOCTORS ============================
export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});
