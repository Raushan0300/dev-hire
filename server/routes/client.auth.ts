import express from "express";
import { clientLoginController, clientSignupController } from "../controllers/auth.client.controller.js";

const router = express.Router();

router.post("/signup", clientSignupController);
router.post("/login", clientLoginController);

export default router;