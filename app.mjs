import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { injectSpeedInsights } from '@vercel/speed-insights';
import authRoutes from './routes/authRoutes.mjs';
import testRoutes from './routes/testRoutes.mjs';
import errorHandler from './middlewares/errorMiddleware.mjs';
import './config/dotenv.mjs';

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando');
});

injectSpeedInsights();

app.use(errorHandler);

export default app;
