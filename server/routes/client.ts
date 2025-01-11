import express from "express";
import { getProfile, getAvailableDevelopers, getBookings } from "../controllers/clientController.js";

const router = express.Router();

router.get("/profile", getProfile);
router.get("/developers", getAvailableDevelopers);
router.get("/bookings", getBookings);

export default router;