const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');

// Get predictions by district
router.get('/district/:name', predictionController.getPredictionsByDistrict);

// Get hotspots
router.get('/hotspots', predictionController.getHotspots);

// Get weekly forecast
router.get('/weekly/:district', predictionController.getWeeklyForecast);

// Get risk level for district
router.get('/risk/:district', predictionController.getRiskLevel);

// Generate new predictions
router.post('/generate', predictionController.generatePrediction);

// Get model accuracy metrics
router.get('/accuracy', predictionController.getModelMetrics);

module.exports = router;
