import express from 'express';

import { getAllCourses, getCoursesById, getCoursesByUser } from '../controllers/coursesController.js';

const router = express.Router();

router.get('/courses', getAllCourses);
router.get('/courses/:id', getCoursesById);
router.get('/user/:userId/courses', getCoursesByUser);

export default router;
