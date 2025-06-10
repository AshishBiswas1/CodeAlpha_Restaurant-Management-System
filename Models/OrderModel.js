const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  item: [
    {
      name: String,
      quatity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  status: {
    type: String,
    enum: ['Pending', 'preparing', 'Served', 'Completed', 'Cancelled']
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Partial']
  },
  placedAt: Date,
  servedAt: {
    type: Date,
    default: null
  },
  updatedAt: {
    type: Date
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
