import express from 'express';
import { getDeveloperPublicProfileController } from '../controllers/public.developer.profile.controller.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/developer/:email', isAuth, getDeveloperPublicProfileController);

export default router;