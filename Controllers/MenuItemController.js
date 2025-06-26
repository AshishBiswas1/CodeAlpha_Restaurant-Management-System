const MenuItem = require('../Models/MenuItemModel');
const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./../utility/catchAsync');
const AppError = require('./../utility/appError');
const APIFeatures = require('./../utility/apiFeatures');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
exports.uploadItemPhoto = upload.single('image');

exports.resizeItemPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `Item-${req.params.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/image/menuItem/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

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
  const filteredBody = filterObj(req.body, 'name', 'veg', 'price', 'category');

  if (req.file) filteredBody.image = req.file.filename;

  const updateOneItem = await MenuItem.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true
    }
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
