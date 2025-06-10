const User = require('./../Models/UserModel');
const catchAsync = require('./../utility/catchAsync');
const AppError = require('./../utility/appError');

exports.getAllUser = catchAsync(async (req, res, next) => {
  const user = await User.find();

  res.status(200).json({
    status: 'Success',
    total: user.length,
    data: {
      user
    }
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('The user with that id was not found!', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      user
    }
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmpassword, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    confirmpassword,
    role
  });

  res.status(201).json({
    status: 'Success',
    data: {
      user
    }
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new AppError('No User found by that ID', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      user
    }
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No User found by that ID', 404));
  }

  res.status(200).json({
    status: 'Success',
    message: 'User deleted'
  });
});
