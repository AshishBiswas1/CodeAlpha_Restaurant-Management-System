const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A reservation must have a customer.']
    },
    reservationDate: {
      type: Date,
      required: [true, 'A reservation must have a reservation date.'],
      default: Date.now
    },
    reservationTime: {
      type: String,
      enum: ['Morning', 'Afternoon', 'Evening']
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled'],
      default: 'Pending'
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

reservationSchema.pre('save', function (next) {
  if (!this.reservationTime) {
    const hours = this.reservationDate.getHours();
    if (hours < 12) {
      this.reservationTime = 'Morning';
    } else if (hours < 18) {
      this.reservationTime = 'Afternoon';
    } else {
      this.reservationTime = 'Evening';
    }
  }
  next();
});

reservationSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email contactNo'
  });
  next();
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
