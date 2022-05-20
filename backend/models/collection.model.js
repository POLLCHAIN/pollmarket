const mongoose = require('mongoose');

const itemCollectionSchema = new mongoose.Schema({
  address: {type: String, lowercase: true}, //every single collection has its own address
  timestamp: {type: Number, index: true},
  ownerAddress: {type: String, lowercase: true}, //address of the owner
  type: String, // single, multi
  name: String,
  uri: String,
  description: String,
  image: String,
  short_url: String,
  isPublic: {type: Boolean, default: false },
  
  isVerified: {type: Boolean, default: false },  
});

const ItemCollection = mongoose.model('ItemCollection', itemCollectionSchema);

module.exports = ItemCollection;
