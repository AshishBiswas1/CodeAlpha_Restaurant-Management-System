const express = require('express');
const reservationController = require('./../Controllers/reservationController');
const authController = require('./../Controllers/authController');

const router = express.Router();

router.post(
  '/book',
  authController.protect,
  reservationController.bookReservation
);

router.use(
  authController.protect,
  authController.restrictTo('admin', 'manager')
);

router.route('/').get(reservationController.getAllReservations);

router
  .route('/:id')
  .get(reservationController.getReservation)
  .patch(reservationController.updateReservation)
  .delete(reservationController.deleteReservation);

module.exports = router;
