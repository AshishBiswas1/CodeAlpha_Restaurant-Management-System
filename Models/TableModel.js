const mongoose = require('mongoose');

const tableSchema = mongoose.Schema({
  tableNumber: {
    type: Number,
    required: [true, 'Atable must have a number.'],
    unique: true,
    min: [1, 'Table number must be atleat 1.']
  },
  capacity: {
    type: Number,
    required: [true, 'Table capacity is required.'],
    min: [1, 'A table must have a capacity of atleat 1 person.']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    required: [true, 'A table must have a location.'],
    enum: ['Indoors', 'Outdoors', 'Balcony', 'VIP'],
    default: 'Indoors'
  },
  lastUsedAt: {
    type: Date,
    default: null
  }
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
