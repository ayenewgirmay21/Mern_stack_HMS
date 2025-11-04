import express from "express";
import {
  login,
  addNewAdmin,
  addNewDoctor,
  getAllDoctors,
  getUserDetails,
  patientRegister,
  logout,
} from "../controller/userController.js";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Patient Register
router.post("/patient/register", patientRegister);

// Login (Admin / Patient)
router.post("/login", login);

// Add Admin (Admin only)
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);

// Add Doctor (Admin only)
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);

// Get All Doctors
router.get("/doctors", getAllDoctors);

// Get User Details
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);

// Logout
router.get("/logout", logout);

export default router;
