import express from "express";
import { developerAvailabilityController, developerSetUnavailaibitycontroller, getDeveloperAvailability } from "../controllers/developerAvalability.controller.js";
import { isAuth } from "../middleware/auth.js";
import {
  developerProfileController,
  updateDeveloperProfileController,
} from "../controllers/developer.profile.controller.js";
import { findDeveloper } from "../controllers/find.developer.controller.js";

const router = express.Router();

router.post("/availability", isAuth, developerAvailabilityController);
router.get("/profile", isAuth, developerProfileController);
router.post("/update-profile", isAuth, updateDeveloperProfileController);
router.get("/find-developer", isAuth, findDeveloper);

router.post("/set-unavailability", isAuth, developerSetUnavailaibitycontroller);
router.get("/unavailability", isAuth, getDeveloperAvailability);

export default router;
