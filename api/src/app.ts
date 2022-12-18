import express, { Response, Request, NextFunction } from 'express';
import cors from 'cors';
import { repos } from './routes/repos';
// import { terrible } from './middleware/terrible';
import { AppError } from './models/AppError';

// CORS header configuration
const corsOptions = {
  methods: 'GET',
  allowedHeaders: 'Content-Type,Authorization',
};
// var jsonParser = bodyParser.json();
export const app = express();

// allow json middleware to parse requests
app.use(express.json());
app.use(express.urlencoded());

// Routes. Note these will fail about 25% due to "terrible" middleware.
app.use('/repos', cors(corsOptions), repos);

// error handling middleware should be loaded after the loading the routes
app.use('/', (err: Error, req: Request, res: Response, next: NextFunction) => {
  const status = err instanceof AppError ? err.status : 500;

  const formattedError: { status: number; message: string } = {
    status,
    message: err.message,
  };

  res.status(status);
  res.json(formattedError);
});
