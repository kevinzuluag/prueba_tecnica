import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './src/routes/userRoutes.js';
import { errorHandler, notFoundHandler } from './src/middlewares/errorHandler.js';

const app = express();
const FRONTEND_PORT = 5173;

app.use(cors({ origin: `http://localhost:${FRONTEND_PORT}` }));
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api', (req, res) => res.json({ message: 'User Explorer API', docs: '/api/users' }));

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
