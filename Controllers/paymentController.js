const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../Models/OrderModel');
const catchAsync = require('./../utility/catchAsync');
const AppError = require('./../utility/appError');
const Payment = require('./../Models/PaymentModel');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the order
  const order = await Order.findById(req.params.orderId);

  // 2) Create a checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/order/${order._id}`,
    customer_email: req.user.email,
    client_reference_id: req.params.orderId,
    line_items: order.item.map((menuItem) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: menuItem.name
        },
        unit_amount: Math.round(menuItem.price * 100) // Stripe expects integer (in paise)
      },
      quantity: menuItem.quantity
    }))
  });

  await Payment.create({
    orderId: order._id,
    userId: req.user.id,
    stripeSessionId: session.id,
    amount: order.totalAmount,
    status: 'unpaid'
  });

  // 3) Send session to client
  res.status(200).json({
    status: 'success',
    session
  });
});

// Create a new payment entry (called when Checkout session is created)
exports.createPaymentRecord = catchAsync(async (req, res, next) => {
  const { orderId, userId, stripeSessionId, amount, currency } = req.body;

  const payment = await Payment.create({
    orderId,
    userId,
    stripeSessionId,
    amount,
    currency: currency || 'inr',
    status: 'unpaid'
  });

  res.status(201).json({
    status: 'success',
    data: {
      payment
    }
  });
});

// Update payment status (e.g., from Stripe webhook)
exports.updatePaymentStatus = catchAsync(async (req, res, next) => {
  const { stripeSessionId, status, stripePaymentIntentId } = req.body;

  const payment = await Payment.findOne({ stripeSessionId });
  if (!payment) return next(new AppError('Payment not found', 404));

  payment.status = status;
  if (status === 'paid') payment.paidAt = new Date();
  if (stripePaymentIntentId)
    payment.stripePaymentIntentId = stripePaymentIntentId;

  await payment.save();

  res.status(200).json({
    status: 'success',
    data: {
      payment
    }
  });
});

// Optional: Get all payments (for admin)
exports.getAllPayments = catchAsync(async (req, res, next) => {
  const payments = await Payment.find().populate('orderId userId');

  res.status(200).json({
    status: 'success',
    results: payments.length,
    data: {
      payments
    }
  });
});

// Optional: Get one payment by session ID
exports.getPaymentBySessionId = catchAsync(async (req, res, next) => {
  const payment = await Payment.findOne({
    stripeSessionId: req.params.sessionId
  });

  if (!payment)
    return next(new AppError('No payment found with this session ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      payment
    }
  });
});
