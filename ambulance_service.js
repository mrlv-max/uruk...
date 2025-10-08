
// ========================================
// AMBULANCE SERVICE
// Port: 3003 | Database: PostgreSQL + Redis
// ========================================

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { Pool } = require('pg');
const Redis = require('redis');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 3003;
const JWT_SECRET = process.env.JWT_SECRET || 'uruk_health_secret_2025';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Database connections
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const redis = Redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

redis.on('error', (err) => console.error('Redis error:', err));
redis.on('connect', () => console.log('✅ Connected to Redis'));

// Google Maps API configuration
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Socket authentication middleware
const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return next(new Error('Authentication error'));
    }
    socket.userId = user.userId;
    socket.userType = user.userType;
    next();
  });
};

// Utility functions
class LocationService {
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  }

  static deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  static async getRouteDetails(origin, destination) {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (response.data.routes && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        return {
          distance: route.legs[0].distance,
          duration: route.legs[0].duration,
          polyline: route.overview_polyline.points
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting route details:', error);
      return null;
    }
  }

  static async findNearbyHospitals(lat, lng, radius = 10) {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius * 1000}&type=hospital&key=${GOOGLE_MAPS_API_KEY}`
      );

      return response.data.results.map(hospital => ({
        id: hospital.place_id,
        name: hospital.name,
        location: hospital.geometry.location,
        rating: hospital.rating || 0,
        vicinity: hospital.vicinity,
        isOpen: hospital.opening_hours?.open_now || null
      }));
    } catch (error) {
      console.error('Error finding nearby hospitals:', error);
      return [];
    }
  }
}

class AmbulanceMatchingService {
  static async findNearestAmbulance(pickupLat, pickupLng, emergencyType = 'general') {
    try {
      // Get all available ambulances from Redis
      const availableAmbulances = await redis.hgetall('available_ambulances');

      if (!availableAmbulances || Object.keys(availableAmbulances).length === 0) {
        return null;
      }

      let nearestAmbulance = null;
      let minDistance = Infinity;

      for (const [ambulanceId, ambulanceData] of Object.entries(availableAmbulances)) {
        const ambulance = JSON.parse(ambulanceData);

        // Calculate distance
        const distance = LocationService.calculateDistance(
          pickupLat, pickupLng,
          ambulance.lat, ambulance.lng
        );

        // Check if this ambulance is better suited
        if (distance < minDistance && this.isAmbulanceCompatible(ambulance, emergencyType)) {
          minDistance = distance;
          nearestAmbulance = {
            ...ambulance,
            distance: distance,
            estimatedTime: Math.round((distance / 40) * 60) // Assuming 40 km/h average speed
          };
        }
      }

      return nearestAmbulance;
    } catch (error) {
      console.error('Error finding nearest ambulance:', error);
      return null;
    }
  }

  static isAmbulanceCompatible(ambulance, emergencyType) {
    // Check ambulance type compatibility with emergency
    const compatibility = {
      'general': ['basic', 'advanced', 'critical'],
      'cardiac': ['advanced', 'critical'],
      'trauma': ['advanced', 'critical'],
      'neonatal': ['critical', 'neonatal']
    };

    return compatibility[emergencyType]?.includes(ambulance.type) || true;
  }
}

// REST API Endpoints

// Book ambulance
app.post('/api/ambulance/book', authenticateToken, async (req, res) => {
  try {
    const {
      pickupAddress,
      pickupLat,
      pickupLng,
      destinationAddress,
      destinationLat,
      destinationLng,
      emergencyType,
      patientInfo,
      contactNumber,
      additionalNotes
    } = req.body;

    // Validate required fields
    if (!pickupLat || !pickupLng || !contactNumber) {
      return res.status(400).json({ error: 'Pickup location and contact number are required' });
    }

    // Find nearest available ambulance
    const nearestAmbulance = await AmbulanceMatchingService.findNearestAmbulance(
      pickupLat, pickupLng, emergencyType
    );

    if (!nearestAmbulance) {
      return res.status(404).json({ 
        error: 'No available ambulances found', 
        message: 'Please try again in a few minutes or contact emergency services directly' 
      });
    }

    // Create booking record
    const booking = await pool.query(`
      INSERT INTO ambulance_bookings 
      (user_id, ambulance_id, pickup_address, pickup_lat, pickup_lng, 
       destination_address, destination_lat, destination_lng, emergency_type, 
       patient_info, contact_number, additional_notes, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending', NOW())
      RETURNING *
    `, [
      req.user.userId, nearestAmbulance.id, pickupAddress, pickupLat, pickupLng,
      destinationAddress, destinationLat, destinationLng, emergencyType,
      JSON.stringify(patientInfo), contactNumber, additionalNotes
    ]);

    // Remove ambulance from available list
    await redis.hdel('available_ambulances', nearestAmbulance.id);

    // Add to active bookings
    await redis.hset('active_bookings', booking.rows[0].id, JSON.stringify({
      ...booking.rows[0],
      ambulance: nearestAmbulance
    }));

    // Notify ambulance driver via socket
    io.to(`ambulance_${nearestAmbulance.id}`).emit('new_booking', {
      bookingId: booking.rows[0].id,
      pickup: { address: pickupAddress, lat: pickupLat, lng: pickupLng },
      destination: { address: destinationAddress, lat: destinationLat, lng: destinationLng },
      emergencyType,
      patientInfo,
      contactNumber,
      estimatedDistance: nearestAmbulance.distance
    });

    // Find nearby hospitals
    const nearbyHospitals = await LocationService.findNearbyHospitals(pickupLat, pickupLng);

    res.status(201).json({
      message: 'Ambulance booked successfully',
      booking: booking.rows[0],
      ambulance: nearestAmbulance,
      nearbyHospitals,
      trackingId: booking.rows[0].id
    });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to book ambulance' });
  }
});

// Get available ambulances
app.get('/api/ambulance/available', authenticateToken, async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Location coordinates required' });
    }

    const availableAmbulances = await redis.hgetall('available_ambulances');
    const ambulancesInRange = [];

    for (const [ambulanceId, ambulanceData] of Object.entries(availableAmbulances)) {
      const ambulance = JSON.parse(ambulanceData);
      const distance = LocationService.calculateDistance(
        parseFloat(lat), parseFloat(lng),
        ambulance.lat, ambulance.lng
      );

      if (distance <= radius) {
        ambulancesInRange.push({
          ...ambulance,
          distance: distance,
          estimatedTime: Math.round((distance / 40) * 60)
        });
      }
    }

    // Sort by distance
    ambulancesInRange.sort((a, b) => a.distance - b.distance);

    res.json({
      availableCount: ambulancesInRange.length,
      ambulances: ambulancesInRange,
      searchRadius: radius
    });

  } catch (error) {
    console.error('Error fetching available ambulances:', error);
    res.status(500).json({ error: 'Failed to fetch available ambulances' });
  }
});

// Track ambulance
app.get('/api/ambulance/track/:bookingId', authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Get booking from active bookings
    const bookingData = await redis.hget('active_bookings', bookingId);

    if (!bookingData) {
      return res.status(404).json({ error: 'Booking not found or completed' });
    }

    const booking = JSON.parse(bookingData);

    // Get real-time ambulance location
    const ambulanceLocation = await redis.hget('ambulance_locations', booking.ambulance.id);
    const currentLocation = ambulanceLocation ? JSON.parse(ambulanceLocation) : null;

    res.json({
      bookingId,
      status: booking.status,
      ambulance: {
        ...booking.ambulance,
        currentLocation
      },
      pickup: {
        address: booking.pickup_address,
        lat: booking.pickup_lat,
        lng: booking.pickup_lng
      },
      destination: {
        address: booking.destination_address,
        lat: booking.destination_lat,
        lng: booking.destination_lng
      },
      estimatedArrival: booking.estimated_arrival,
      lastUpdated: new Date()
    });

  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({ error: 'Failed to track ambulance' });
  }
});

// Get booking history
app.get('/api/ambulance/history', authenticateToken, async (req, res) => {
  try {
    const bookings = await pool.query(
      `SELECT * FROM ambulance_bookings 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 20`,
      [req.user.userId]
    );

    res.json({
      bookings: bookings.rows,
      total: bookings.rowCount
    });

  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch booking history' });
  }
});

// Driver endpoints
app.post('/api/ambulance/driver/status', authenticateToken, async (req, res) => {
  try {
    const { available, lat, lng, ambulanceType = 'basic' } = req.body;

    if (req.user.userType !== 'driver') {
      return res.status(403).json({ error: 'Access denied. Driver access required.' });
    }

    const ambulanceData = {
      id: req.user.userId,
      driverId: req.user.userId,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      type: ambulanceType,
      available,
      lastUpdated: new Date().toISOString()
    };

    if (available) {
      // Add to available ambulances
      await redis.hset('available_ambulances', req.user.userId, JSON.stringify(ambulanceData));
    } else {
      // Remove from available ambulances
      await redis.hdel('available_ambulances', req.user.userId);
    }

    // Update location regardless of availability
    await redis.hset('ambulance_locations', req.user.userId, JSON.stringify({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      timestamp: new Date().toISOString()
    }));

    res.json({
      message: `Status updated to ${available ? 'available' : 'unavailable'}`,
      location: { lat, lng },
      available
    });

  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Socket.IO connection handling
io.use(authenticateSocket);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId}, Type: ${socket.userType}`);

  // Join user-specific room
  socket.join(`user_${socket.userId}`);

  if (socket.userType === 'driver') {
    socket.join(`ambulance_${socket.userId}`);
  }

  // Handle real-time location updates from ambulance drivers
  socket.on('location_update', async (data) => {
    if (socket.userType !== 'driver') return;

    try {
      const { lat, lng } = data;

      // Update location in Redis
      await redis.hset('ambulance_locations', socket.userId, JSON.stringify({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        timestamp: new Date().toISOString()
      }));

      // Update available ambulances location if available
      const availableAmbulance = await redis.hget('available_ambulances', socket.userId);
      if (availableAmbulance) {
        const ambulanceData = JSON.parse(availableAmbulance);
        ambulanceData.lat = parseFloat(lat);
        ambulanceData.lng = parseFloat(lng);
        ambulanceData.lastUpdated = new Date().toISOString();
        await redis.hset('available_ambulances', socket.userId, JSON.stringify(ambulanceData));
      }

      // Broadcast to users tracking this ambulance
      socket.broadcast.emit('ambulance_location_update', {
        ambulanceId: socket.userId,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Location update error:', error);
    }
  });

  // Handle booking acceptance by driver
  socket.on('accept_booking', async (data) => {
    if (socket.userType !== 'driver') return;

    try {
      const { bookingId } = data;

      // Update booking status
      await pool.query(
        'UPDATE ambulance_bookings SET status = $1, accepted_at = NOW() WHERE id = $2',
        ['accepted', bookingId]
      );

      // Get booking details to notify patient
      const booking = await pool.query('SELECT * FROM ambulance_bookings WHERE id = $1', [bookingId]);

      if (booking.rows.length > 0) {
        const bookingData = booking.rows[0];

        // Notify patient
        io.to(`user_${bookingData.user_id}`).emit('booking_accepted', {
          bookingId,
          message: 'Your ambulance is on the way!',
          ambulanceId: socket.userId,
          estimatedArrival: data.estimatedArrival
        });
      }

    } catch (error) {
      console.error('Booking acceptance error:', error);
    }
  });

  // Handle booking completion
  socket.on('complete_booking', async (data) => {
    if (socket.userType !== 'driver') return;

    try {
      const { bookingId } = data;

      // Update booking status
      await pool.query(
        'UPDATE ambulance_bookings SET status = $1, completed_at = NOW() WHERE id = $2',
        ['completed', bookingId]
      );

      // Remove from active bookings
      await redis.hdel('active_bookings', bookingId);

      // Make ambulance available again
      const ambulanceLocation = await redis.hget('ambulance_locations', socket.userId);
      if (ambulanceLocation) {
        const location = JSON.parse(ambulanceLocation);
        const ambulanceData = {
          id: socket.userId,
          driverId: socket.userId,
          lat: location.lat,
          lng: location.lng,
          type: 'basic', // Can be made dynamic
          available: true,
          lastUpdated: new Date().toISOString()
        };
        await redis.hset('available_ambulances', socket.userId, JSON.stringify(ambulanceData));
      }

      socket.emit('booking_completed', { bookingId, message: 'Booking completed successfully' });

    } catch (error) {
      console.error('Booking completion error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Ambulance Service',
    timestamp: new Date().toISOString(),
    connections: io.engine.clientsCount
  });
});

// Database initialization
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ambulance_bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        ambulance_id INTEGER NOT NULL,
        pickup_address TEXT NOT NULL,
        pickup_lat DECIMAL(10, 8) NOT NULL,
        pickup_lng DECIMAL(11, 8) NOT NULL,
        destination_address TEXT,
        destination_lat DECIMAL(10, 8),
        destination_lng DECIMAL(11, 8),
        emergency_type VARCHAR(50) DEFAULT 'general',
        patient_info JSONB,
        contact_number VARCHAR(20) NOT NULL,
        additional_notes TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        accepted_at TIMESTAMP,
        completed_at TIMESTAMP,
        cancelled_at TIMESTAMP
      )
    `);

    console.log('✅ Ambulance bookings table initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Start server
server.listen(PORT, () => {
  console.log(`🚑 Ambulance Service running on port ${PORT}`);
  initDatabase();
});

module.exports = { app, io };
