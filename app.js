import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.use('/api', apiRoutes);

app.use(errorHandler);

export default app;
