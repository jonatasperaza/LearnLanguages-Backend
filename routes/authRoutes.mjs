import express from 'express';
import { register, login, forgetPassword, resetPassword } from '../controllers/authController.mjs';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forget', forgetPassword);
router.patch('/reset', resetPassword);

export default router;
