// server/models/tokens.js
// Mongoose model storing FCM tokens with unique index

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  token: { type: String, unique: true, index: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Token', TokenSchema);
