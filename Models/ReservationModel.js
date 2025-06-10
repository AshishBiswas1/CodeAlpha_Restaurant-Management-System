const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'A reservation must have a customer name.'],
    minlength: [
      3,
      'The length of the customer name must be at least 3 characters.'
    ]
  },
  contactNumber: {
    type: String,
    required: [true, 'A reservation must have a contact Number.'],
    minlength: [
      10,
      'The length of the phone number must be at least 10 characters.'
    ]
  },
  reservationDate: {
    type: Date,
    required: [true, 'A reservation must have a reservation date.'],
    default: Date.now
  },
  reservationTime: {
    type: String,
    required: [true, 'A reservation must have a reservation time.'],
    enum: ['Morning', 'Afternoon', 'Evening']
  },
  status: {
    type: Boolean,
    required: [true, 'A reservation must have a reservation status.'],
    default: false
  }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
