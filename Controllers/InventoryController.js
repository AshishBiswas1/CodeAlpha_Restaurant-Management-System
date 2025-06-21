const Inventory = require('./../Models/InverntoryModdel');
const catchAsync = require('./../utility/catchAsync');
const AppError = require('./../utility/appError');

exports.getAllInventory = catchAsync(async (req, res, next) => {
  const inventory = await Inventory.find();

  res.status(200).json({
    status: 'Success',
    data: {
      inventory
    }
  });
});

exports.getOneInventoryItem = catchAsync(async (req, res, next) => {
  const inventory = await Inventory.findById(req.params.id);

  if (!inventory) {
    return next(new AppError('No Item with that ID was found', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      inventory
    }
  });
});

exports.createInventory = catchAsync(async (req, res, next) => {
  const newInventory = await Inventory.create(req.body);

  res.status(201).json({
    status: 'Success',
    data: {
      inventory: newInventory
    }
  });
});

exports.updateInventory = catchAsync(async (req, res, next) => {
  const updatedInventroy = await Inventory.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      runValidators: true,
      new: true
    }
  );

  if (!updatedInventroy) {
    return next(new AppError('No Item with that ID was found', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      inventory: updatedInventroy
    }
  });
});

exports.deleteItemInventory = catchAsync(async (req, res, next) => {
  const deleteInventory = await Inventory.findByIdAndDelete(req.params.id);

  if (!deleteInventory) {
    return next(new AppError('No Item with that ID was found', 404));
  }

  res.status(204).json({
    status: 'Success',
    data: null
  });
});
