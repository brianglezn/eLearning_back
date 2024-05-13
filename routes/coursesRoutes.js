import express from 'express';

import { getAllCourses, getCoursesById } from '../controllers/coursesController.js';

const router = express.Router();

router.get('/courses', getAllCourses);
router.get('/courses/:id', getCoursesById);

export default router;
