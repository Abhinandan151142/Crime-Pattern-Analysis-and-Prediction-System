const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Get dashboard summary
router.get('/summary', dashboardController.getSummary);

// Get monthly crime data
router.get('/charts/monthly', dashboardController.getMonthlyData);

// Get crime data by type
router.get('/charts/by-type', dashboardController.getCrimesByType);

// Get crime data by district
router.get('/charts/by-district', dashboardController.getCrimesByDistrict);

// Get hourly distribution
router.get('/charts/hourly', dashboardController.getHourlyData);

// Get alerts
router.get('/alerts', dashboardController.getAlerts);

// Get top hotspots
router.get('/top-hotspots', dashboardController.getTopHotspots);

module.exports = router;
