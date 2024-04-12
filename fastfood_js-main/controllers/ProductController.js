class ProductController {
  Index(req, res) {
    res.render('products/index', { title: 'List Product' });
  }
  Update(req, res) {
    res.render('products/update', { title: 'Update Product' });
  }
}

module.exports = new ProductController();
