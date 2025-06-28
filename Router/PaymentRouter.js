const express = require('express');
const paymentController = require('../Controllers/paymentController');
const authController = require('../Controllers/authController');

const router = express.Router();

router.get(
  '/checkout/:orderId',
  authController.protect,
  paymentController.getCheckoutSession
);

router.post('/record', paymentController.createPaymentRecord);
router.patch('/update-status', paymentController.updatePaymentStatus);

// Optional admin routes
router.get('/', paymentController.getAllPayments);
router.get('/:sessionId', paymentController.getPaymentBySessionId);

module.exports = router;
