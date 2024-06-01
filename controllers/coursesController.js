import { ObjectId } from 'mongodb';
import { client, DB_NAME } from '../bdd/database.js';

const db = client.db(DB_NAME);
const coursesCollection = db.collection('courses');
const usersCollection = db.collection('users');

export async function getAllCourses(req, res) {
    try {
        console.log('Fetching all courses');
        const courses = await coursesCollection.find().toArray();
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
}

export async function getCoursesById(req, res) {
    const { id } = req.params;
    try {
        console.log(`Fetching course with id: ${id}`);
        const course = await coursesCollection.findOne({ _id: new ObjectId(id) });

        if (course) {
            res.status(200).json(course);
        } else {
            res.status(404).send('Course not found');
        }
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ message: 'Error fetching course', error: error.message });
    }
}

export async function getCoursesByUser(req, res) {
    const { userId } = req.params;
    console.log(`Fetching courses for user with id: ${userId}`);
    try {
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found:', user);
        console.log('Courses purchased:', user.courses_purchased);

        if (!user.courses_purchased || user.courses_purchased.length === 0) {
            console.log('No courses purchased by user');
            return res.status(200).json([]);
        }

        const courseIds = user.courses_purchased.map(id => {
            return (typeof id === 'string') ? new ObjectId(id) : id;
        });
        console.log('Course IDs:', courseIds);

        const courses = await coursesCollection.find({ _id: { $in: courseIds } }).toArray();
        console.log('Courses found:', courses);

        res.status(200).json(courses);
    } catch (error) {
        console.log('Error fetching courses:', error.message);
        res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
}
