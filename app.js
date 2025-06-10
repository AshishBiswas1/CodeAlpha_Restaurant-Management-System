const express = require('express');
const morgan = require('morgan');
const MenuItemRouter = require('./Router/MenuItemRouter');
const OrderRouter = require('./Router/OrderRouter');
const UserRouter = require('./Router/UserRouter');
const TableRouter = require('./Router/tableRouter');
const AppError = require('./utility/appError');
const globalErrorHandeler = require('./Controllers/errorController');
const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/Resturent-Management/menu', MenuItemRouter);
app.use('/api/Resturent-Management/order', OrderRouter);
app.use('/api/Resturent-Management/user', UserRouter);
app.use('/api/Resturent-Management/table', TableRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandeler);

module.exports = app;
