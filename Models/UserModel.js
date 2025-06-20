const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your Full Name!'],
      minlength: [6, 'The length of Name must be 6 characters minimum!'],
      maxlength: [20, 'The length of Name must be 20 characters maximum!']
    },
    email: {
      type: String,
      required: [true, 'User must have an email!'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid Email!']
    },
    contactNo: {
      type: Number,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v.toString());
        },
        message: 'Phone number must be of 10 digits!'
      }
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'chef', 'waiter', 'owner', 'manager'],
      default: 'user'
    },
    password: {
      type: String,
      required: [true, 'Please enter your Password!'],
      minlength: 8,
      select: false
    },
    confirmpassword: {
      type: String,
      required: [true, 'Please Confirm your Password!'],
      minlength: 8,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Password and ConfirmPassword do not match'
      },
      select: false
    },
    isActive: {
      type: Boolean,
      default: true,
      select: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    passwordChangedAt: {
      type: Date
    },
    passwordResetToken: {
      type: String
    },
    passwordResetExpires: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Encrypt PASSWORD BEFORE SAVING
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmpassword = undefined;
  next();
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000; //Token is issued after the password was changed
  }
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Check PASSWORD Validity
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWT_EXPIRES_IN) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWT_EXPIRES_IN < changedTimeStamp;
  }
  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

userSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
