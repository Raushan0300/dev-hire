import express from "express";
import { developerAvailabilityController } from "../controllers/developerAvalability.controller.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", isAuth, developerAvailabilityController);

export default router;