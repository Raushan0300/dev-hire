import express from "express";
import { developerLoginController, developerSignupController } from "../controllers/auth.developer.controller.js";

const router = express.Router();

router.post("/signup", developerSignupController);
router.post("/login", developerLoginController);

export default router;