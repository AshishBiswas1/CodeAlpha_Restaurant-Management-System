const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Payment must be linked to an order']
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Payment must be linked to a user']
    },
    stripeSessionId: {
      type: String,
      required: true
    },
    stripePaymentIntentId: {
      type: String
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'inr'
    },
    status: {
      type: String,
      enum: ['paid', 'unpaid', 'failed'],
      default: 'unpaid'
    },
    paymentMethod: {
      type: String // e.g. 'card', 'upi', 'netbanking'
    },
    paidAt: Date
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
