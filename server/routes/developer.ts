import express from "express";
import { 
  getProfile, 
  updateAvailability, 
  getBookings, 
  updateProfile 
} from "../controllers/developerController.js";

const router = express.Router();

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/availability", updateAvailability);
router.get("/bookings", getBookings);

export default router;