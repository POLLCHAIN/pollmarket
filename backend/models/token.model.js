const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  timestamp: {type: Number, index: true},
  address: {type: String, index: true, lowercase: true},
  name: String,
  symbol: String,
  decimal: Number,
  rate: Number // token USD rate
});

tokenSchema.index({ timestamp: 1, address: 1 });
const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;
