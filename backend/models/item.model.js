const mongoose = require('mongoose');
var Mixed = mongoose.Schema.Types.Mixed;

const itemSchema = new mongoose.Schema({
  id: {type: String, index: true},
  timestamp: {type: Number, index: true},
  itemCollection: {type: String, lowercase: true},
  tokenId: {type: Number, index: true},
  type: String, // item type multi/single
  creator: {type: String, lowercase: true},
  uri: String, // item metadata information
  supply: Number,
  royalty: Number,  

  name: { type: String, required: true, index: true },
  description: String, //item description
  category: String, //item category
  image: String, //item cover image
  file: String, //item main file
  asset_type: String, //item main file type
  attributes: { type: Mixed, default: []}, //item properties

  usdPrice: Number, //for filter
  auctionEndTimestamp: Number, 
  holders: [{address: {type: String, lowercase: true}, balance: Number}],
  likes: [{type: String, lowercase: true, default: []}] //addresses
});


itemSchema.index({ name: 1, tokenId: 1 });
itemSchema.index({ tokenId: 1, name: 1, itemCollection: 1 }, { unique: true });
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
