const mongoose = require('mongoose');

const chartSchema = new mongoose.Schema({
  Modelno: {
    type: String,
    required: true
  },
  userId: {
    type: String
  },
  Quantity: {
    type: Number,
    required: true,
    default: 0
  },
  soldQuantity: {
    type: Number,
    default: 0
  },
  Costprice: {
    type: Number,
    required: true
  },
  Sellingprice: {
    type: Number,
    default: 1
  },
  Date: {
    type: Date,
    default: Date.now()
  },
  supplierPan: {
    type: String,
    default: ''
  },
  estimatedProfit: {
    type: Number,
    default: 0
  },
  actualProfit: {
    type: Number,
    default: 0
  },
  handAmount: {
    type: Number,
    default: 0
  }
});

const chartModel = mongoose.model('chartModel', chartSchema);
module.exports = chartModel;
