import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/symbol', userRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
