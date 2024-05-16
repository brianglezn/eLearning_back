import express from 'express';
import { getAllUsers, getUserById, loginUser, registerUser } from '../controllers/usersController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

router.get('/users', authenticateToken, getAllUsers);
router.get('/users/:id', authenticateToken, getUserById);
router.post('/login', loginUser);
router.post('/register', registerUser);

export default router;
