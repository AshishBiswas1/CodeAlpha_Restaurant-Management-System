const express = require('express');
const tableController = require('../Controllers/tableController');
const authController = require('./../Controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(tableController.getAllTables)
  .post(
    authController.protect,
    authController.restrictTo('owner'),
    tableController.addTable
  );

router.use(
  authController.protect,
  authController.restrictTo('admin', 'manager', 'owner')
);
router
  .route('/:id')
  .get(tableController.getTable)
  .patch(tableController.updateTable)
  .delete(tableController.deleteTable);

module.exports = router;
