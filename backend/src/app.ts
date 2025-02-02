import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat.routes';
import ollamaRoutes from './routes/ollama.routes';
import { errorHandler } from './middleware/error';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRoutes);
app.use('/api/ollama', ollamaRoutes);

app.use(errorHandler);

export { app };
