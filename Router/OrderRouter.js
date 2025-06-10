const express = require('express');
const OurderController = require('./../Controllers/orderController');

const router = express.Router();

router.route('/')
.get(OurderController.getAllOrder)
.post(OurderController.placeOrder);

router.route('/:id')
.get(OurderController.getOneOrder)
.patch(OurderController.updateOrder)
.delete(OurderController.cancelOrder);

module.exports = router;