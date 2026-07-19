import express from "express";
import { scanResume, getATSReports, getATSReportById } from "../controllers/atsController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all ATS routes
router.use(protect);

router.post("/scan", scanResume);
router.get("/reports", getATSReports);
router.get("/reports/:id", getATSReportById);

export default router;
