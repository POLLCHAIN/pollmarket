const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  address: {type: String, lowercase: true}, //user address
  nonce: { type: Number, defuault: Math.floor(Math.random() * 1000000) },
  name: String,
  bio: String,
  emailAddress: String,
  personalLink : String,
  profilePic: String,
  last_login: { type: Date },
  following: [{type: String, lowercase: true, default: []}], //following addresses,
  followers: [{type: String, lowercase: true, default: []}] //followers addresses
});

userSchema.index({ address: 1 }, { unique: true });
const User = mongoose.model('User', userSchema);

module.exports = User;
