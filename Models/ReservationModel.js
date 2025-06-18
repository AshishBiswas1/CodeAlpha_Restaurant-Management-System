const mongoose = require('mongoose');
const Table = require('./TableModel');

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
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: [true, 'A reservation must have a table.']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

// Auto-set reservationTime if not set
reservationSchema.pre('save', function (next) {
  if (!this.reservationTime) {
    const hours = this.reservationDate.getHours();
    this.reservationTime =
      hours < 12 ? 'Morning' : hours < 18 ? 'Afternoon' : 'Evening';
  }
  next();
});

// Check availability and set status
reservationSchema.pre('save', async function (next) {
  const Reservation = mongoose.model('Reservation');

  const startOfDay = new Date(this.reservationDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(this.reservationDate);
  endOfDay.setHours(23, 59, 59, 999);

  const existing = await Reservation.findOne({
    table: this.table,
    reservationDate: { $gte: startOfDay, $lte: endOfDay },
    reservationTime: this.reservationTime,
    status: { $in: ['Confirmed'] }
  });

  if (!existing) {
    this.status = 'Confirmed';
    await Table.findByIdAndUpdate(this.table, { isAvailable: false });
  } else {
    this.status = 'Pending';
  }

  next();
});

// Cancel old Pending reservations
reservationSchema.pre(/^find/, async function (next) {
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
  await mongoose
    .model('Reservation')
    .updateMany(
      { status: 'Pending', createdAt: { $lt: cutoff } },
      { status: 'Cancelled' }
    );
  next();
});

// Auto-populate
reservationSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name email contactNo' }).populate({
    path: 'table',
    select: 'tableNumber capacity location'
  });
  next();
});

// Utilities
async function makeTableAvailable(tableId) {
  await Table.findByIdAndUpdate(tableId, { isAvailable: true });
}

async function promotePendingReservation(doc) {
  if (!doc) return;

  const Reservation = mongoose.model('Reservation');

  const start = new Date(doc.reservationDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(doc.reservationDate);
  end.setHours(23, 59, 59, 999);

  const nextPending = await Reservation.findOne({
    table: doc.table,
    reservationDate: { $gte: start, $lte: end },
    reservationTime: doc.reservationTime,
    status: 'Pending'
  }).sort({ createdAt: 1 });

  if (nextPending) {
    nextPending.status = 'Confirmed';
    await nextPending.save();
    await Table.findByIdAndUpdate(doc.table, { isAvailable: false });
  } else {
    await makeTableAvailable(doc.table);
  }
}

// Handle deletion
reservationSchema.post('findOneAndDelete', async function (doc) {
  if (doc?.status === 'Confirmed') {
    await promotePendingReservation(doc);
  } else if (doc) {
    await makeTableAvailable(doc.table);
  }
});

// Handle update to Cancelled
reservationSchema.post('findOneAndUpdate', async function () {
  const doc = await this.model.findOne(this.getQuery());
  if (doc?.status === 'Cancelled') {
    await promotePendingReservation(doc);
  }
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
