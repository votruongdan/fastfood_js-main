class DefaultController {
  Index(req, res) {
    res.render('defaults/home', { title: 'Home' });
  }
  Information(req, res) {
    res.render('defaults/information', { title: 'Information' });
  }
  Cart(req, res) {
    res.render('defaults/cart', { title: 'Cart' });
  }
  Orders(req, res) {
    res.render('defaults/orders', { title: 'Orders' });
  }
  Login(req, res) {
    res.render('defaults/login', { title: 'Login' });
  }
  Register(req, res) {
    res.render('defaults/register', { title: 'Register' });
  }
}

module.exports = new DefaultController();
