// models/Inventory.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Vegetable', 'Meat', 'Dairy', 'Grain', 'Beverage', 'Other'],
    default: 'Other'
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    enum: ['kg', 'liters', 'pieces', 'grams', 'packs'],
    default: 'pieces'
  },
  costPerUnit: {
    type: Number,
    required: true,
    min: [0, 'Cost must be non-negative']
  },
  supplier: {
    type: String,
    default: 'Unknown'
  },
  expiryDate: {
    type: Date
  },
  shelf: {
    type: String,
    required: [true, 'Shelf information is required']
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

inventorySchema.pre('save', function (next) {
  this.lastUpdated = Date.now();
  next();
});

const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports = Inventory;
