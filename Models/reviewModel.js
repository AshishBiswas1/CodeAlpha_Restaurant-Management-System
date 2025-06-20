const mongoose = require('mongoose');
const MenuItem = require('./MenuItemModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review is required']
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    menuItem: {
      type: mongoose.Schema.ObjectId,
      ref: 'MenuItem',
      required: [true, 'Review must belong to a menu item']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({ menuItem: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'menuItem',
    select: 'name'
  }).populate({
    path: 'user',
    select: 'name email'
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (menuItemId) {
  const stats = await this.aggregate([
    {
      $match: { menuItem: menuItemId }
    },
    {
      $group: {
        _id: '$menuItem',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await MenuItem.findByIdAndUpdate(menuItemId, {
      ratingsQuantity: stats[0] ? stats[0].nRating : 0,
      ratingsAverage: stats[0] ? stats[0].avgRating : 4
    });
  } else {
    await MenuItem.findByIdAndUpdate(menuItemId, {
      ratingsQuantity: 0,
      ratingsAverage: 4
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.menuItem);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  if (this.r) {
    await this.r.constructor.calcAverageRatings(this.r.menuItem);
  }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
