
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var StockSchema = new Schema({
  countries:[String],
  budget: Number,
  bId: Number,
  category: [String]
});

module.exports = mongoose.model('Stock', StockSchema);
