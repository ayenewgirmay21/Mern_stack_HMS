import express from "express";
import {
  addNewAdmin,
  addNewDoctor,
  getAllDoctors,
} from "../controller/userController.js";

import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

// ============================ ADMIN ROUTES ============================

// 🧑‍💼 Add a new admin (Dashboard)
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);

// ============================ DOCTOR ROUTES ============================

// 🩺 Add a new doctor (Dashboard)
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);

// 🩺 Get all doctors (Frontend & Dashboard)
router.get("/doctors", getAllDoctors);

export default router;
