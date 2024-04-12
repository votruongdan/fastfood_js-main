class CategoryController {
  Index(req, res) {
    res.render('categories/index', { title: 'List Category' });
  }
}

module.exports = new CategoryController();
