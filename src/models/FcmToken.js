const mongoose = require('mongoose');

const fcmTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('FcmToken', fcmTokenSchema);

