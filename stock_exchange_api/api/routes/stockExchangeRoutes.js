'use strict';
module.exports = function(app) {
  var stockExchange = require('../controllers/stockExchangeController');

  // stockExchage Route
  app.route('/:countrycode&:Category&:BaseBid').get(stockExchange.list_result);
};
