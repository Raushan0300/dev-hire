import {Router} from 'express';
import {registerUser} from '../controllers/clientController.js';

const router = Router();

router.post('/register', registerUser);

export default router;