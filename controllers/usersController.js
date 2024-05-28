import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { client, DB_NAME } from '../bdd/database.js';

const db = client.db(DB_NAME);
const usersCollection = db.collection('users');

export async function getAllUsers(req, res) {
    try {
        const users = await usersCollection.find().toArray();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
}

export async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        const user = await usersCollection.findOne({ email });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.status(200).json({ message: "Login successful!", user, token });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
}

export async function registerUser(req, res) {
    const { username, name, surname, email, password } = req.body;

    try {
        const existingUser = await usersCollection.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = {
            username,
            name,
            surname,
            email,
            password: hashedPassword,
            role: 'student',
            courses_purchased: []
        };

        const result = await usersCollection.insertOne(newUser);
        res.status(201).json({ message: "User registered successfully!", user: result.ops[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
}

export async function getUserByToken(req, res) {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await usersCollection.findOne({ _id: new ObjectId(decoded.id) });

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        res.status(401).send('Invalid token');
    }
}

export async function getCoursesByUser(req, res) {
    const { userId } = req.params;
    try {
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const courseIds = user.courses_purchased.map(id => new ObjectId(id));
        const courses = await coursesCollection.find({ _id: { $in: courseIds } }).toArray();

        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
}