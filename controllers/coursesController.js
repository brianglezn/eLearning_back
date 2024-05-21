import { ObjectId } from 'mongodb';
import { client, DB_NAME } from '../bdd/database.js';

const db = client.db(DB_NAME);
const coursesCollection = db.collection('courses');

export async function getAllCourses(req, res) {
    try {
        const courses = await coursesCollection.find().toArray();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
}

export async function getCoursesById(req, res) {
    const { id } = req.params;
    try {
        const course = await coursesCollection.findOne({ _id: new ObjectId(id) });

        if (course) {
            res.status(200).json(course);
        } else {
            res.status(404).send('Course not found');
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching course', error: error.message });
    }
}
