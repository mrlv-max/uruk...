// models/Vitals.js
const mongoose = require('mongoose');

const vitalsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodPressure: {
    systolic: Number,
    diastolic: Number
  },
  heartRate: Number,
  temperature: Number,
  bloodSugar: Number,
  oxygenLevel: Number,
  weight: Number,
  height: Number,
  bmi: Number,
  aiAnalysis: String,
  blockchainHash: String,
  recordedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vitals', vitalsSchema);
