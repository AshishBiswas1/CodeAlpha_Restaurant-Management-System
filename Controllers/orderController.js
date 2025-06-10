const Order = require('./../Models/OrderModel');
const catchAsync = require('./../utility/catchAsync');
const AppError = require('./../utility/appError');

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
  let { item: incomingItems } = req.body;

  if (
    !incomingItems ||
    !Array.isArray(incomingItems) ||
    incomingItems.length === 0
  ) {
    return next(
      new AppError(
        'Please provide a non-empty array of items to update the order.',
        400
      )
    );
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError('No Order found by that id to update!', 404));
  }

  // Convert incoming item names to lowercase for easy matching
  const incomingNames = incomingItems
    .map((i) => i.name?.toLowerCase())
    .filter(Boolean);

  if (incomingNames.length !== incomingItems.length) {
    return next(new AppError('Each item must have a valid name.', 400));
  }

  // Step 1: Remove items from order that are NOT in incomingItems
  order.item = order.item.filter((existingItem) =>
    incomingNames.includes(existingItem.name.toLowerCase())
  );

  // Step 2: Add new items or update existing ones
  for (const newItem of incomingItems) {
    const index = order.item.findIndex(
      (i) => i.name.toLowerCase() === newItem.name.toLowerCase()
    );

    if (index !== -1) {
      // 🔄 Fully replace the item to avoid stale fields
      order.item[index] = {
        name: newItem.name,
        quantity: newItem.quantity ?? 1,
        price: newItem.price ?? 0
      };
    } else {
      order.item.push({
        name: newItem.name,
        quantity: newItem.quantity ?? 1,
        price: newItem.price ?? 0
      });
    }
  }

  // Step 3: Recalculate totalAmount
  order.totalAmount = order.item.reduce((sum, itm) => {
    const quantity = typeof itm.quantity === 'number' ? itm.quantity : 1;
    const price = typeof itm.price === 'number' ? itm.price : 0;
    return sum + quantity * price;
  }, 0);

  order.updatedAt = new Date();
  await order.save();

  res.status(200).json({
    status: 'Success',
    message: 'Order updated (items replaced)',
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
