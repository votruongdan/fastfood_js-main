const express = require('express');
const router = express.Router();
const DefaultController = require('../controllers/DefaultController');
const { Authenticate, LoggedIn } = require('../middleware');

router.get('/login', LoggedIn, DefaultController.Login);
router.get('/register', LoggedIn, DefaultController.Register);
router.get('/information', Authenticate, DefaultController.Information);
router.get('/cart', DefaultController.Cart);
router.get('/orders', DefaultController.Orders);
router.get('/', DefaultController.Index);

module.exports = router;
