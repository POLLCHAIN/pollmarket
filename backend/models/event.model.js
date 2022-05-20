const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  id: {type: String, index: true},
  timestamp: {type: Number, index: true},
  itemCollection: {type: String, index: true, lowercase: true},
  tokenId: {type: Number, index: true},
  action: String,
  actionAddress: {type: String, index: true, lowercase: true},  
  params: {type: String, default: '' }
});

eventSchema.index({ id: 1, tokenId: 1 , itemCollection: 1});
const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
