import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../bdd/db.json');

function writeDB(data) {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(dbPath, jsonData, 'utf8');
}

function readDB() {
    const jsonData = fs.readFileSync(dbPath);
    return JSON.parse(jsonData);
}

export function getAllUsers(req, res) {
    const data = readDB();
    res.status(200).json(data.users);
}

export function getUserById(req, res) {
    const { id } = req.params;
    const data = readDB();
    const user = data.users.find(u => u.id.toString() === id);

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).send('Usuario no encontrado');
    }
}

export async function loginUser(req, res) {
    const { email, password } = req.body;
    const data = readDB();

    const user = data.users.find(u => u.email === email);

    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            res.status(200).json({ message: "Login successful!", user });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } else {
        res.status(404).send('User not found');
    }
}

export async function registerUser(req, res) {
    const { username, email, password } = req.body;
    const data = readDB();

    if (data.users.some(user => user.email === email)) {
        return res.status(409).send('Email already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
        id: data.users.length + 1,
        username,
        email,
        password: hashedPassword,
        role: 'student',
        courses_purchased: []
    };

    data.users.push(newUser);
    writeDB(data);

    res.status(201).json({ message: "User registered successfully!", user: newUser });
}
