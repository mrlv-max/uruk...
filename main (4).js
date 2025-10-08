// models/AmbulanceBooking.js
const mongoose = require('mongoose');

const ambulanceBookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ambulanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance' },
  emergencyType: { 
    type: String, 
    enum: ['cardiac', 'accident', 'respiratory', 'other'],
    required: true 
  },
  pickupLocation: {
    address: String,
    coordinates: [Number]
  },
  destinationHospital: {
    name: String,
    address: String,
    coordinates: [Number]
  },
  status: { 
    type: String, 
    enum: ['requested', 'assigned', 'en_route', 'arrived', 'completed', 'cancelled'],
    default: 'requested'
  },
  patientCondition: String,
  estimatedArrival: Date,
  actualArrival: Date,
  fare: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AmbulanceBooking', ambulanceBookingSchema);
