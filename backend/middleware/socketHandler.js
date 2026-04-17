// Socket.IO event handlers
const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Join district-specific room
    socket.on('join_district', (district) => {
      socket.join(district);
      console.log(`Client ${socket.id} joined district: ${district}`);
    });

    // Leave district room
    socket.on('leave_district', (district) => {
      socket.leave(district);
      console.log(`Client ${socket.id} left district: ${district}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Emit new crime alert
const emitNewCrimeAlert = (io, crime) => {
  io.emit('new_crime_alert', crime);
  
  // Also emit to specific district room
  if (crime.district) {
    io.to(crime.district).emit('district_crime_alert', crime);
  }
};

// Emit prediction update
const emitPredictionUpdate = (io, predictions) => {
  io.emit('prediction_update', predictions);
};

// Emit hotspot update
const emitHotspotUpdate = (io, hotspots) => {
  io.emit('hotspot_update', hotspots);
};

// Emit dashboard refresh
const emitDashboardRefresh = (io, stats) => {
  io.emit('dashboard_refresh', stats);
};

// Emit risk alert
const emitRiskAlert = (io, alert) => {
  io.emit('risk_alert', alert);
  
  // Emit to specific district if provided
  if (alert.district) {
    io.to(alert.district).emit('district_risk_alert', alert);
  }
};

module.exports = {
  setupSocketHandlers,
  emitNewCrimeAlert,
  emitPredictionUpdate,
  emitHotspotUpdate,
  emitDashboardRefresh,
  emitRiskAlert
};
