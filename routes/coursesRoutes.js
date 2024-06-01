import express from 'express';

import { getAllCourses, getCoursesById, getCoursesByUser } from '../controllers/coursesController.js';

const router = express.Router();

router.get('/courses', getAllCourses);
router.get('/courses/:id', getCoursesById);
router.get('/user/:userId/courses', (req, res) => {
    console.log(`GET /api/user/${req.params.userId}/courses`);
    getCoursesByUser(req, res);
});

export default router;
