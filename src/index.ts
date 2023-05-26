/* eslint-disable @typescript-eslint/no-var-requires */
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import authRouter from './routes/authRouter';
import indexRouter from './routes/indexRouter';
import authMiddleware from './middleware/authMiddleware';
import blogRouter from './routes/blogRouter';

const swaggerDocument = require('./swagger.json'); // Путь к вашему файлу Swagger YAML

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/auth', authRouter);
app.use('/blog', authMiddleware, blogRouter);
app.use('*', indexRouter);

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
