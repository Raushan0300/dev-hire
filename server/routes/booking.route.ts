import express from "express";

import { createBookingController } from "../controllers/booking.controller.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", isAuth, createBookingController);

export default router;