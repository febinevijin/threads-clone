import express from 'express';
import path from 'path';
import fs from 'fs';
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
import dotenv from 'dotenv';
// dotenv.config({
//   path: path.resolve(__dirname, '../.env'),
// });
dotenv.config();

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';

import connectDB from './config/connectDb.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import { appConfig } from './config/appConfig.js';

import authRouter from './router/authRouter.js';
import userRouter from './router/userRouter.js';
import postRouter from './router/postRouter.js';
import messageRouter from './router/messageRouter.js';
import { app, server } from './socket/socket.js';

connectDB();
const __dirname = path.resolve();
// const app = express(); no need this , already initialized server.js
const whitelist = appConfig.whiteList.split(',');

app.set('trust proxy', 1); // trust first proxy

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      // for mobile app and postman client
      return callback(null, true);
    }
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Increase the payload limit for express.json() and retain the type configuration
app.use(
  express.json({
    limit: '10mb', // Set the desired limit, e.g., 10MB
    type: ['application/json', 'text/plain'],
  }),
);

// Increase the payload limit for express.urlencoded()
app.use(
  express.urlencoded({
    limit: '10mb', // Set the desired limit, e.g., 10MB
    extended: true,
  }),
);
app.use(cookieParser());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(morgan('tiny'));
app.get('/check', async (req, res) => {
  return res.status(200).send('server live!');
});

// routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/messages', messageRouter);

app.use(notFound);
app.use(errorHandler);



// http://localhost:5000 => backend,frontend

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '/frontend/dist')));

//   // react app

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
//   });
// }

console.log('NODE_ENV:', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  const staticFilesPath = path.join(__dirname, '/frontend/dist');
  console.log('Static files directory:', staticFilesPath);

  app.use(express.static(staticFilesPath));

  // Catch-all route to serve the index.html file
  app.get('*', async(req, res) => {
    console.log('Serving the index.html file for route:', req.originalUrl);
    const indexPath = await path.resolve(__dirname, 'frontend', 'dist', 'index.html');
    console.log('Index file path:', indexPath);
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Error serving index.html:', err);
        res.status(500).send(err);
      }
    });
  });
}


const distPath = path.join('./frontend/dist');
fs.readdir(distPath, (err, files) => {
  if (err) {
    console.log('Error reading dist directory', err);
  } else {
    console.log('Dist directory contents:', files);
  }
});

const PORT = appConfig.port;

server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
