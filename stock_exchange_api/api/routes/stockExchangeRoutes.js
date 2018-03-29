'use strict';
module.exports = function(app) {
  var todoList = require('../controllers/stockExchangeController');

  // stockExchage Route
  app.route('/').get(todoList.list_all_tasks);
};

 