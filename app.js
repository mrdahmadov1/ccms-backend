const express = require('express');
const morgan = require('morgan');
const globalErrorHandler = require('./controllers/errorController');
const complaintRouter = require('./routes/complaintRoutes');
const responseRouter = require('./routes/responseRoutes');

const app = express();

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/api/v1/complaints', complaintRouter);
app.use('/api/v1/responses', responseRouter);

app.use(globalErrorHandler);

module.exports = app;
