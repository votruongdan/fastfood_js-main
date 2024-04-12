const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const { Authorize } = require('../middleware');

router.get('/', Authorize, CategoryController.Index);

module.exports = router;
