const Order = require('./../Models/OrderModel');
const catchAsync = require('./../utility/catchAsync');
const AppError = require('./../utility/appError');
const MenuItem = require('./../Models/MenuItemModel');

exports.getAllOrder = catchAsync(async (req, res, next) => {
  const order = await Order.find();

  if (order.length === 0) {
    return next(new AppError('No Orders where found!', 404));
  }

  res.status(200).json({
    status: 'Success',
    total: order.length,
    data: {
      order
    }
  });
});

exports.getOneOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('No Order found by that ID!', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      order
    }
  });
});

exports.placeOrder = catchAsync(async (req, res, next) => {
  const order = await Order.create(req.body);

  res.status(201).json({
    status: 'Success',
    data: {
      order
    }
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const { item: incomingItems } = req.body;

  if (
    !incomingItems ||
    !Array.isArray(incomingItems) ||
    incomingItems.length === 0
  ) {
    return next(
      new AppError(
        'Please provide a non-empty array of items (with id and quantity).',
        400
      )
    );
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError('No Order found by that ID to update!', 404));
  }

  // Only set the raw IDs and quantities, allow the schema to enrich them
  order.item = incomingItems;

  await order.save(); // this triggers the pre('save') hook to enrich

  res.status(200).json({
    status: 'Success',
    message: 'Order updated successfully.',
    data: {
      order
    }
  });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return next('No Order found by that ID to cancel', 404);
  }

  res.status(204).json({
    status: 'Success',
    message: 'Your Order was cancelled',
    data: null
  });
});
