const mongoose = require('mongoose');
const slugify = require('slugify');

const menuItemSchema = mongoose.Schema(
  {
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
    ratingsAverage: {
      type: Number,
      default: 4,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    image: {
      type: String,
      default: 'default.jpg'
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

menuItemSchema.index({ price: 1, category: 1, ratingsAverage: -1 });
menuItemSchema.index({ slug: 1 });

menuItemSchema.pre('save', function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Virtual populate for reviews
menuItemSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'menuItem',
  localField: '_id'
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
