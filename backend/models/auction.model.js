const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  id: {type: String, index: true},
  timestamp: {type: Number, index: true},
  auctionId: {type: Number, index: true},
  itemCollection: {type: String, index: true, lowercase: true},
  tokenId: {type: Number, index: true},
  startTime: {type: Number, index: true},
  endTime: {type: Number, index: true},
  tokenAdr: {type: String, lowercase: true},
  tokenSymbol: String,
  startPrice: {type: Number, index: true},
  creator: {type: String, lowercase: true,}, 
  owner: {type: String, lowercase: true,},
  active: {type: Boolean, default: true },  
  lastPrice: {type: Number, index: true}, // last bid price
  bidded: {type: Boolean, default: false }, // bidded status. true: at least 1 bid
});


auctionSchema.index({ auctionId: 1, tokenId: 1 , itemCollection: 1});

const Auction = mongoose.model('Auction', auctionSchema);
module.exports = Auction;
