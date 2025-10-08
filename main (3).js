// models/Ambulance.js
const mongoose = require('mongoose');

const ambulanceSchema = new mongoose.Schema({
  ambulanceId: { type: String, required: true, unique: true },
  name: String,
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['Available', 'En Route', 'Busy', 'Standby'], 
    default: 'Available' 
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  },
  facilities: [String],
  contactNumber: String,
  vehicleNumber: String,
  createdAt: { type: Date, default: Date.now }
});

ambulanceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Ambulance', ambulanceSchema);
