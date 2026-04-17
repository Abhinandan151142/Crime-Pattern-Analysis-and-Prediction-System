const { pool } = require('../config/database');

// Get predictions for a district
exports.getPredictionsByDistrict = async (req, res) => {
  try {
    const { name } = req.params;
    const [predictions] = await pool.query(
      'SELECT * FROM predictions WHERE district = ? ORDER BY predicted_date DESC LIMIT 30',
      [name]
    );

    res.json({ success: true, data: predictions });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({ success: false, message: 'Error fetching predictions', error: error.message });
  }
};

// Get current hotspots
exports.getHotspots = async (req, res) => {
  try {
    const [hotspots] = await pool.query(
      'SELECT * FROM hotspots ORDER BY risk_score DESC'
    );

    res.json({ success: true, data: hotspots });
  } catch (error) {
    console.error('Error fetching hotspots:', error);
    res.status(500).json({ success: false, message: 'Error fetching hotspots', error: error.message });
  }
};

// Get weekly forecast
exports.getWeeklyForecast = async (req, res) => {
  try {
    const { district } = req.params;
    const [forecast] = await pool.query(
      `SELECT * FROM predictions 
       WHERE district = ? 
       AND predicted_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
       ORDER BY predicted_date`,
      [district]
    );

    res.json({ success: true, data: forecast });
  } catch (error) {
    console.error('Error fetching weekly forecast:', error);
    res.status(500).json({ success: false, message: 'Error fetching forecast', error: error.message });
  }
};

// Get risk level for district
exports.getRiskLevel = async (req, res) => {
  try {
    const { district } = req.params;
    const [risk] = await pool.query(
      `SELECT AVG(probability_score) as avg_risk, MAX(risk_level) as max_risk
       FROM predictions
       WHERE district = ?
       AND predicted_date >= CURDATE()`,
      [district]
    );

    res.json({ 
      success: true, 
      data: {
        district,
        averageRisk: risk[0].avg_risk,
        maxRiskLevel: risk[0].max_risk
      }
    });
  } catch (error) {
    console.error('Error fetching risk level:', error);
    res.status(500).json({ success: false, message: 'Error fetching risk level', error: error.message });
  }
};

// Generate new predictions (mock for now, can connect to Python later)
exports.generatePrediction = async (req, res) => {
  try {
    const { district, crime_type, days = 7 } = req.body;

    if (!district) {
      return res.status(400).json({ success: false, message: 'District is required' });
    }

    // Mock prediction data
    const predictions = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      predictions.push({
        district,
        crime_type: crime_type || 'All',
        predicted_date: date.toISOString().split('T')[0],
        probability_score: Math.random() * 0.3 + 0.5, // 0.5 to 0.8
        risk_level: Math.random() > 0.5 ? 'medium' : 'high',
        confidence: Math.random() * 10 + 85, // 85-95%
        model_version: 'v1.0'
      });
    }

    // Store predictions in database
    for (const pred of predictions) {
      await pool.query(
        `INSERT INTO predictions (district, crime_type, predicted_date, probability_score, risk_level, confidence, model_version)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [pred.district, pred.crime_type, pred.predicted_date, pred.probability_score, pred.risk_level, pred.confidence, pred.model_version]
      );
    }

    res.json({ 
      success: true, 
      message: 'Predictions generated successfully',
      data: predictions 
    });
  } catch (error) {
    console.error('Error generating predictions:', error);
    res.status(500).json({ success: false, message: 'Error generating predictions', error: error.message });
  }
};

// Get model accuracy metrics
exports.getModelMetrics = async (req, res) => {
  try {
    const [metrics] = await pool.query(
      'SELECT * FROM model_metrics ORDER BY trained_at DESC LIMIT 1'
    );

    if (metrics.length === 0) {
      // Return mock data if no metrics exist
      return res.json({
        success: true,
        data: {
          accuracy: 0.885,
          precision_score: 0.875,
          recall_score: 0.835,
          f1_score: 0.865,
          model_version: 'v1.0'
        }
      });
    }

    res.json({ success: true, data: metrics[0] });
  } catch (error) {
    console.error('Error fetching model metrics:', error);
    res.status(500).json({ success: false, message: 'Error fetching metrics', error: error.message });
  }
};
