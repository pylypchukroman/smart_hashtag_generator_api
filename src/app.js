import cors from 'cors';
import express from 'express';

import hashtagRoutes from './routes/hashtagRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim())
  : [];

const corsOptions = allowedOrigins.length
  ? {
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        const error = new Error('Not allowed by CORS');
        error.statusCode = 403;
        callback(error);
      },
    }
  : {
      origin: true,
    };

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', hashtagRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
