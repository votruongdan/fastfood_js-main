const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { Authorize } = require('../middleware');

router.get('/update', Authorize, ProductController.Update);
router.get('/', Authorize, ProductController.Index);

module.exports = router;
