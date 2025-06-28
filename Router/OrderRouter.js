const express = require('express');
const OrderController = require('./../Controllers/orderController');
const authController = require('./../Controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('manager', 'owner', 'admin'),
    OrderController.getAllOrder
  )
  .post(OrderController.placeOrder);

router
  .route('/:id')
  .get(OrderController.getOneOrder)
  .patch(OrderController.updateOrder)
  .delete(OrderController.cancelOrder);

module.exports = router;
