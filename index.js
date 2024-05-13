import dotenv from 'dotenv';
import express, { json } from 'express';
import cors from 'cors';

import coursesRoutes from './routes/coursesRoutes.js';
import usersRoutes from './routes/usersRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

app.use(coursesRoutes);
app.use(usersRoutes);

app.get('/', (req, res) => {
    res.send('¡Servidor de e-learning funcionando!');
});

app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'Pong' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
