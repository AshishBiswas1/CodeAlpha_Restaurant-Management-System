const express = require('express');
const MenuItemController = require('./../Controllers/MenuItemController');
const authController = require('./../Controllers/authController');
const reviewRouter = require('./ReviewRouter');

const router = express.Router();

router.use('/:menuItemId/reviews', reviewRouter);

router
  .route('/')
  .get(MenuItemController.getAllMenuItems)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'manager', 'owner'),
    authController.protect,
    MenuItemController.createItem
  );

router.use(authController.protect);
router
  .route('/:id')
  .get(MenuItemController.getOneMenuItem)
  .patch(
    authController.restrictTo('admin', 'manager', 'owner'),
    MenuItemController.updateItem
  )
  .delete(
    authController.restrictTo('admin', 'manager', 'owner'),
    MenuItemController.deleteItem
  );

module.exports = router;
