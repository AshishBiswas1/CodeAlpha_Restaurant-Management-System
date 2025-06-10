const Reservation = require('../Models/ReservationModel');
const catchAsync = require('./../utility/catchAsync');
const AppError = require('./../utility/appError');

const getAllResservations = catchAsync(async (req, res, next) => {
  const reservation = await Reservation.find();

  res.status(200).json({
    status: 'Success',
    total: reservation.length,
    data: {
      reservation
    }
  });
});

const getReservation = catchAsync(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    return next(new AppError('No reservation found with that ID', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      reservation
    }
  });
});

const bookReservation = catchAsync(async (req, res, next) => {});
