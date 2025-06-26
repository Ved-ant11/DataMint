import express from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getCurrentUser);
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes are working!" });
});

export default router;