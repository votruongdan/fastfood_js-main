function route(app) {
  app.use('/product', require('./product'));
  app.use('/category', require('./category'));
  app.use('/api', require('./api'));
  app.use('/', require('./default'));
}

module.exports = route;
