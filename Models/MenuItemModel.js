const mongoose = require('mongoose');
const slugify = require('slugify');

const menuItemSchema = mongoose.Schema ({
  name: {
    type: String,
    required: [true, 'Please enter your Name!'],
    unique: true,
    maxlength: [20, 'The max length of the Name must be 20 characters.'],
    minlength: [8, 'The min length of the Name must be 8 character.']
  },
  veg: {
    type: Boolean,
    default: true
  },
  slug: {
    type: String
  },
  price: {
    type: Number,
    required: [true, 'A menu item must have a price.']
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Appetizers',
      'Main Course',
      'Desserts',
      'Beverages',
      'Salads',
      'Soups',
      'Breads',
      'Rice',
      'Pasta',
      'Combos',
      'Kids',
      'Special'
    ]
  },
  availability: {
    type: Boolean,
    default: true
  },
  image: String

});

menuItemSchema.pre('save', function(next) {
  if(this.name) {
    this.slug = slugify(this.name, {lower: true, strict: true});
  }
  next();
})

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;