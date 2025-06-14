const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const MenuItemRouter = require('./Router/MenuItemRouter');
const OrderRouter = require('./Router/OrderRouter');
const UserRouter = require('./Router/UserRouter');
const TableRouter = require('./Router/tableRouter');
const AppError = require('./utility/appError');
const globalErrorHandeler = require('./Controllers/errorController');
const app = express();

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(
  express.json({
    limit: '50kb'
  })
);

// Data Snitization against NoSQL query injection
app.use(mongoSanitize());

// Data Snitization against XSS
app.use(xss());

app.use(
  hpp({
    whitelist: ['price']
  })
);

app.use(express.static(`${__dirname}/public`));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour.'
});

app.use('/api', limiter);

app.use('/api/Resturent-Management/menu', MenuItemRouter);
app.use('/api/Resturent-Management/order', OrderRouter);
app.use('/api/Resturent-Management/user', UserRouter);
app.use('/api/Resturent-Management/table', TableRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandeler);

module.exports = app;
