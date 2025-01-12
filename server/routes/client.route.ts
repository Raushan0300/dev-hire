import express from 'express';

const router = express.Router();

import { availableDevelopersController, clientProfileController } from '../controllers/client.profile.controller.js';
import { isAuth } from '../middleware/auth.js';

router.get('/profile', isAuth, clientProfileController);
router.get('/developers', isAuth, availableDevelopersController);

export default router;