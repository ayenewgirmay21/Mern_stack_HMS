import express from "express";
import {
  addNewAdmin,
  addNewDoctor,
  getAllDoctors,
  getUserDetails,
  login,
  logoutAdmin,
  logoutPatient,
  patientRegister,
} from "../controller/userController.js";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// 🧍 Patient register
router.post("/patient/register", patientRegister);

// 🔐 Login (all roles)
router.post("/login", login);

// 🧑‍💼 Add Admin (admin only)
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);

// 👨‍⚕️ Add Doctor (admin only)
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);

// 🩺 Get all doctors
router.get("/doctors", getAllDoctors);

// 👤 Profile routes
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);

// 🚪 Logout
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);

export default router;
