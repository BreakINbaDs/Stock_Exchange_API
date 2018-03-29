
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var StockExchangeSchema = new Schema({
  coutries:[String],
  budget: Number,
  bId: Number,
  category: [String]
});

var LogSchema = new Schema ({
  log_base_targeting: [String],
  log_budget_check: [String],
  log_bId_check: [String],
  log_shortlist: String,
  date: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Stock', StockExchangeSchema);
module.exports = mongoose.model('Logs', LogSchema);