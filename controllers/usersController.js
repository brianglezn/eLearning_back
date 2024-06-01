import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { client, DB_NAME } from '../bdd/database.js';

const db = client.db(DB_NAME);
const usersCollection = db.collection('users');

export async function getAllUsers(req, res) {
    try {
        console.log('Fetching all users');
        const users = await usersCollection.find().toArray();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
}

export async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        console.log(`Login attempt for email: ${email}`);
        const user = await usersCollection.findOne({ email });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                console.log('Login successful');
                res.status(200).json({ message: "Login successful!", user, token });
            } else {
                console.log('Invalid credentials');
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            console.log('User not found');
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
}

export async function registerUser(req, res) {
    const { username, name, surname, email, password } = req.body;

    try {
        console.log(`Registering user with email: ${email}`);
        const existingUser = await usersCollection.findOne({ email });

        if (existingUser) {
            console.log('Email already exists');
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
        console.log('User registered successfully');
        res.status(201).json({ message: "User registered successfully!", user: result.ops[0] });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
}

export async function getUserByToken(req, res) {
    const token = req.headers.authorization.split(' ')[1];
    try {
        console.log('Verifying token');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await usersCollection.findOne({ _id: new ObjectId(decoded.id) });

        if (user) {
            res.status(200).json(user);
        } else {
            console.log('User not found');
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.log('Invalid token');
        res.status(401).send('Invalid token');
    }
}
