const mongoose = require('mongoose');
const MenuItem = require('./MenuItemModel');
const AppError = require('./../utility/appError');

const orderSchema = mongoose.Schema({
  item: [
    {
      id: mongoose.Schema.Types.Mixed,
      name: String,
      price: Number,
      quantity: {
        type: Number,
        required: true
      }
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
  placedAt: {
    type: Date,
    default: Date.now
  },
  servedAt: {
    type: Date,
    default: null
  },
  updatedAt: Date
});

orderSchema.pre('save', async function (next) {
  if (!this.isModified('item')) return next();

  const enrichedItems = [];

  for (const [index, obj] of this.item.entries()) {
    const id = obj.id || obj.itemId; // fallback in case client sends itemId
    const quantity = obj.quantity;

    if (!id) {
      return next(new AppError(`Missing item ID at index ${index}`, 400));
    }

    const item = await MenuItem.findById(id);
    if (!item) {
      return next(new AppError(`Menu item with ID ${id} not found`, 400));
    }

    enrichedItems.push({
      name: item.name,
      price: item.price,
      quantity
    });
  }

  this.item = enrichedItems;

  this.totalAmount = parseFloat(
    enrichedItems.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)
  );

  next();
});

orderSchema.pre('save', function (next) {
  if (!this.servedAt) this.servedAt = new Date();

  this.updatedAt = this.isModified() ? new Date() : undefined;

  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
