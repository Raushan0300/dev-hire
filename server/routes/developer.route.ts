import express from "express";
import { developerAvailabilityController } from "../controllers/developerAvalability.controller.js";
import { isAuth } from "../middleware/auth.js";
import { developerProfileController, updateDeveloperProfileController } from "../controllers/developer.profile.controller.js";


const router = express.Router();


router.post("/availability", isAuth, developerAvailabilityController);
router.get("/profile", isAuth,developerProfileController);
router.post("/update-profile", isAuth,updateDeveloperProfileController);

export default router;