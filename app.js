const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const compression = require('compression');
const morgan = require('morgan');
const globalErrorHandler = require('./controllers/errorController');
const complaintRouter = require('./routes/complaintRoutes');
const responseRouter = require('./routes/responseRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.enable('trust proxy');

app.use(
  cors({
    origin: ['https://ccms-frontend.netlify.app', 'http://localhost:5173'],
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  })
);

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
  keyGenerator: (req) => {
    return req.ip;
  },
  skip: (req) => {
    return req.headers['x-forwarded-for'] === undefined;
  },
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(compression());

app.use('/api/v1/complaints', complaintRouter);
app.use('/api/v1/responses', responseRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
