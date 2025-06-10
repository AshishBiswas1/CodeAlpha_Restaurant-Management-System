const express = require('express');
const MenuItemController = require('./../Controllers/MenuItemController');
const authController = require('./../Controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(MenuItemController.getAllMenuItems)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'manager', 'owner'),
    authController.protect,
    MenuItemController.createItem
  );

router.use(
  authController.protect,
  authController.restrictTo('admin', 'manager', 'owner')
);
router
  .route('/:id')
  .get(MenuItemController.getOneMenuItem)
  .patch(MenuItemController.updateItem)
  .delete(MenuItemController.deleteItem);

module.exports = router;
