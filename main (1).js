// models/HealthScore.js
const mongoose = require('mongoose');

const healthScoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true, min: 0, max: 100 },
  status: { type: String, enum: ['Excellent', 'Good', 'Fair', 'Poor'] },
  blockchainHash: { type: String, required: true },
  blockchainVerified: { type: Boolean, default: false },
  insights: [{
    type: String,
    priority: { type: String, enum: ['high', 'medium', 'low'] },
    category: String
  }],
  calculatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HealthScore', healthScoreSchema);
