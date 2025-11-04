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

// 🧍 Patient Register
router.post("/patient/register", patientRegister);

// 🔐 Login
router.post("/login", login);

// 🧑‍💼 Add New Admin
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);

// 👨‍⚕️ Add New Doctor
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);

// 🩺 Get All Doctors
router.get("/doctors", getAllDoctors);

// 👤 Get Profile
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);

// 🚪 Logout
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);

export default router;
