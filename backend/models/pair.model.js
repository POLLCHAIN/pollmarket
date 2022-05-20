const mongoose = require('mongoose');
var Mixed = mongoose.Schema.Types.Mixed;

const pairSchema = new mongoose.Schema({
  id: {type: String, index: true},
  timestamp: {type: Number, index: true},
  pairId: {type: Number, index: true},
  itemCollection: {type: String, index: true, lowercase: true},
  tokenId: {type: Number, index: true},
  type: String,
  creator: {type: String, lowercase: true,}, //address of the creator
  owner: {type: String, lowercase: true,},
  tokenAdr: {type: String, lowercase: true},
  tokenSymbol: String,
  balance: Number,
  price: Number,
  usdPrice: Number,
  creatorFee: Number,
  bValid: Boolean  
});


pairSchema.index({ pairId: 1, tokenId: 1 , itemCollection: 1});
pairSchema.index({ tokenId: 1, pairId: 1, owner: 1, itemCollection: 1 }, { unique: true });

pairSchema.pre("update", function(next) {
  this.getUpdate().updated_at = new Date();
  next();
});

const Pair = mongoose.model('Pair', pairSchema);

module.exports = Pair;
