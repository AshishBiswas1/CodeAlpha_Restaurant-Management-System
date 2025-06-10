const Table = require('./../Models/TableModel');
const catchAsync = require('./../utility/catchAsync');
const AppError = require('./../utility/appError');

exports.getAllTables = catchAsync(async (req, res, next) => {
  const table = await Table.find();

  res.status(200).json({
    stauts: 'Success',
    length: table.length,
    data: {
      table
    }
  });
});

exports.getTable = catchAsync(async (req, res, next) => {
  const table = await Table.findById(req.params.id);

  if (!table) {
    return next(new AppError('Nod table found with that ID', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      table
    }
  });
});

exports.bookTable = catchAsync(async (req, res, next) => {
  const { tableNumber, capacity, location } = req.body;

  const table = await Table.create({
    tableNumber,
    capacity,
    location
  });

  res.status(201).json({
    status: 'Success',
    data: {
      table
    }
  });
});

exports.updateTable = catchAsync(async (req, res, next) => {
  const updateTable = await Table.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!updateTable) {
    return next(new AppError('No table found with that ID', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      updateTable
    }
  });
});

exports.deleteTable = catchAsync(async (req, res, next) => {
  const deletedTable = await Table.findByIdAndDelete(req.params.id);

  if (!deletedTable) {
    return next(new AppError('No table found with that ID', 404));
  }

  res.status(204).json({
    status: 'Success',
    message: 'Table deleted'
  });
});
