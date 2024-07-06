const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const globalErrorHandler = require('./controllers/errorController');
const complaintRouter = require('./routes/complaintRoutes');
const responseRouter = require('./routes/responseRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.enable('trust proxy');

app.use(
  cors({
    origin: 'https://ccms-frontend.netlify.app',
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  })
);

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

app.use('/api/v1/complaints', complaintRouter);
app.use('/api/v1/responses', responseRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
