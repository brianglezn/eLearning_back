import express from 'express';
import { getAllUsers, getUserByToken, loginUser, registerUser } from '../controllers/usersController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/users', authenticateToken, getAllUsers);
router.get('/user', authenticateToken, getUserByToken);

export default router;
