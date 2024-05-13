import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../bdd/db.json');

function readDB() {
    const jsonData = fs.readFileSync(dbPath);
    return JSON.parse(jsonData);
}

export function getAllCourses(req, res) {
    const data = readDB();
    res.status(200).json(data.courses);
}

export function getCoursesById(req, res) {
    const { id } = req.params;
    const data = readDB();
    const course = data.courses.find(c => c.id.toString() === id);

    if (course) {
        res.status(200).json(course);
    } else {
        res.status(404).send('Curso no encontrado');
    }
}
