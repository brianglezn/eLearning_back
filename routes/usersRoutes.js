import express from 'express';
import { getAllUsers, getUserById, loginUser, registerUser } from '../controllers/usersController.js';

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/login', loginUser);
router.post('/register', registerUser);

export default router;
