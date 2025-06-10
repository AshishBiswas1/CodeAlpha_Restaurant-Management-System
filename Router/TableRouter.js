const express = require('express');
const tableController = require('../Controllers/tableController');

const router = express.Router();

router
  .route('/')
  .get(tableController.getAllTables)
  .post(tableController.bookTable);

router
  .route('/:id')
  .get(tableController.getTable)
  .patch(tableController.updateTable)
  .delete(tableController.deleteTable);

module.exports = router;
