const MenuItem = require('../Models/MenuItemModel');
const catchAsync = require('./../utility/catchAsync');
const AppError = require('./../utility/appError');
const APIFeatures = require('./../utility/apiFeatures');

exports.getAllMenuItems = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(MenuItem.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const menuItem = await features.query;

  if (!menuItem) {
    return next(new AppError('No Items where found in the menu', 404));
  }

  res.status(200).json({
    total: menuItem.length,
    status: 'Success',
    data: {
      menuItem
    }
  });
});

exports.getOneMenuItem = catchAsync(async (req, res, next) => {
  const oneMenuItem = await MenuItem.findById(req.params.id).populate(
    'reviews'
  );

  if (!oneMenuItem) {
    return next(new AppError('No Item found with that ID', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      oneMenuItem
    }
  });
});

exports.createItem = catchAsync(async (req, res, next) => {
  const createItem = await MenuItem.create(req.body);

  if (!createItem) {
    return next(new AppError('No Item found with that ID', 404));
  }

  res.status(201).json({
    status: 'Success',
    data: {
      createItem
    }
  });
});

exports.updateItem = catchAsync(async (req, res, next) => {
  const updateOneItem = await MenuItem.findByIdAndUpdate(
    req.params.id,
    req.body
  );

  if (!updateOneItem) {
    return next(new AppError('No Item was found by that ID', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      updateOneItem
    }
  });
});

exports.deleteItem = catchAsync(async (req, res, next) => {
  const deleteOneItem = await MenuItem.findByIdAndDelete(req.params.id);

  if (!deleteOneItem) {
    return next(new AppError('No Item found by that ID', 404));
  }

  res.status(204).json({
    status: 'Success',
    message: 'Item Successfully deleted',
    data: null
  });
});
