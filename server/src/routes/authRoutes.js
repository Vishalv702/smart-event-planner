import express from 'express';
import { register, login } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get("/verify", protect, (req, res) => {
  res.status(200).json({ message: "Token verified successfully", user: req.user });
});

export default router;