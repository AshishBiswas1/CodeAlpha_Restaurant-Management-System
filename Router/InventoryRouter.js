const express = require('express');
const InventoryController = require('./../Controllers/InventoryController');
const authController = require('./../Controllers/authController');

const router = express.Router();

router.use(
  authController.protect,
  authController.restrictTo('admin', 'owner', 'chef')
);

router
  .route('/')
  .get(InventoryController.getAllInventory)
  .post(InventoryController.createInventory);

router
  .route('/:id')
  .get(InventoryController.getOneInventoryItem)
  .patch(InventoryController.updateInventory)
  .delete(InventoryController.deleteItemInventory);

module.exports = router;
