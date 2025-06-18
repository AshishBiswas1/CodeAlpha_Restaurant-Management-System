const Reservation = require('../Models/ReservationModel');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');

// Utility function to update outdated reservations (safe & clean)
const cancelOutdatedReservations = async () => {
  const now = new Date();
  await Reservation.updateMany(
    {
      status: { $in: ['Pending', 'Confirmed'] },
      reservationDate: { $lt: new Date(now.getTime() - 2 * 60 * 60 * 1000) }
    },
    { status: 'Cancelled' }
  );
};

exports.getAllReservations = catchAsync(async (req, res, next) => {
  await cancelOutdatedReservations();

  const reservation = await Reservation.find();

  res.status(200).json({
    status: 'Success',
    total: reservation.length,
    data: {
      reservation
    }
  });
});

exports.getReservation = catchAsync(async (req, res, next) => {
  await cancelOutdatedReservations();

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

exports.bookReservation = catchAsync(async (req, res, next) => {
  const newReservation = await Reservation.create(req.body);

  res.status(201).json({
    status: 'Success',
    data: {
      reservation: newReservation
    }
  });
});

exports.updateReservation = catchAsync(async (req, res, next) => {
  const reservation = await Reservation.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

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

exports.deleteReservation = catchAsync(async (req, res, next) => {
  const reservation = await Reservation.findByIdAndDelete(req.params.id);

  if (!reservation) {
    return next(new AppError('No reservation found with that ID', 404));
  }

  res.status(204).json({
    status: 'Success',
    data: null
  });
});
