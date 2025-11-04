import express from "express";
import {
  addNewAdmin,
  addNewDoctor,
  getAllDoctors,
  getUserDetails,
  login,
  logout,
  patientRegister,
} from "../controller/userController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

// 🧍 Patient Register
router.post("/patient/register", patientRegister);

// 🔐 Login (for all roles)
router.post("/login", login);

// 🧑‍💼 Add New Admin (only Admin can add)
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);

// 👨‍⚕️ Add New Doctor (only Admin can add)
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);

// 🩺 Get All Doctors
router.get("/doctors", getAllDoctors);

// 👤 Get Profile (based on who’s logged in)
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);

// 🚪 Logout routes (unified)
router.get("/logout", logout);

export default router;
