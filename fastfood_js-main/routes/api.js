const express = require('express');
const router = express.Router();
const APIController = require('../controllers/APIController');
const { Authorize, Authenticate } = require('../middleware');
const path = require('path');
const multer = require('multer');

// Khởi tạo multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + ext);
  },
});
const upload = multer({ storage: storage });

//POST
router.post('/change-infor', Authenticate, APIController.changeInfor);
router.post('/change-password', Authenticate, APIController.changePassword);
router.post(
  '/update-product',
  Authorize,
  upload.single('image'),
  APIController.updateProduct
);
router.post('/update-category', Authorize, APIController.updateCategory);
router.post('/remove-product', Authorize, APIController.removeProduct);
router.post('/remove-category', Authorize, APIController.removeCategory);
router.post('/checkout', APIController.Checkout);
router.post('/logout', APIController.Logout);
router.post('/login', APIController.Login);
router.post('/register', APIController.Register);

//GET
router.get('/get-name-user', APIController.getNameUser);
router.get('/get-user', APIController.getUser);
router.get('/information', APIController.Infor);
router.get('/clear-cart', APIController.clearCart);
router.get('/remove-from-cart', APIController.removeFromCart);
router.get('/add-to-cart', APIController.addToCart);
router.get('/count-cart', APIController.countCart);
router.get('/cart', APIController.Cart);
router.get('/orders',Authorize, APIController.Orders);
router.get('/order-detail',Authorize, APIController.orderDetail);
router.get('/products', APIController.Products);
router.get('/categories', APIController.Categories);
router.get('/product', APIController.Product);
router.get('/category', APIController.Category);
router.get('/', APIController.Index);

module.exports = router;
