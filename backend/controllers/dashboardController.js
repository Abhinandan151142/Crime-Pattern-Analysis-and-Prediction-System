const { pool } = require('../config/database');

// Get dashboard summary
exports.getSummary = async (req, res) => {
  try {
    const [totalCrimes] = await pool.query('SELECT COUNT(*) as total FROM crimes');
    const [activeCases] = await pool.query('SELECT COUNT(*) as total FROM crimes WHERE status = "open"');
    const [arrests] = await pool.query('SELECT COUNT(*) as total FROM crimes WHERE arrest_made = TRUE');
    const [highRiskAreas] = await pool.query(
      'SELECT COUNT(DISTINCT district) as total FROM crimes WHERE severity IN ("high", "critical")'
    );

    res.json({
      success: true,
      data: {
        totalCrimes: totalCrimes[0].total,
        activeCases: activeCases[0].total,
        arrests: arrests[0].total,
        highRiskAreas: highRiskAreas[0].total
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ success: false, message: 'Error fetching summary', error: error.message });
  }
};

// Get monthly crime data
exports.getMonthlyData = async (req, res) => {
  try {
    const [monthlyData] = await pool.query(`
      SELECT 
        MONTH(date_reported) as month,
        YEAR(date_reported) as year,
        COUNT(*) as count,
        crime_type
      FROM crimes
      WHERE date_reported >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY YEAR(date_reported), MONTH(date_reported), crime_type
      ORDER BY year, month
    `);

    res.json({ success: true, data: monthlyData });
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    res.status(500).json({ success: false, message: 'Error fetching monthly data', error: error.message });
  }
};

// Get crime data by type
exports.getCrimesByType = async (req, res) => {
  try {
    const [crimesByType] = await pool.query(`
      SELECT crime_type, COUNT(*) as count
      FROM crimes
      GROUP BY crime_type
      ORDER BY count DESC
    `);

    res.json({ success: true, data: crimesByType });
  } catch (error) {
    console.error('Error fetching crimes by type:', error);
    res.status(500).json({ success: false, message: 'Error fetching crimes by type', error: error.message });
  }
};

// Get crime data by district
exports.getCrimesByDistrict = async (req, res) => {
  try {
    const [crimesByDistrict] = await pool.query(`
      SELECT district, COUNT(*) as count
      FROM crimes
      GROUP BY district
      ORDER BY count DESC
    `);

    res.json({ success: true, data: crimesByDistrict });
  } catch (error) {
    console.error('Error fetching crimes by district:', error);
    res.status(500).json({ success: false, message: 'Error fetching crimes by district', error: error.message });
  }
};

// Get hourly crime distribution
exports.getHourlyData = async (req, res) => {
  try {
    const [hourlyData] = await pool.query(`
      SELECT 
        HOUR(time_occurred) as hour,
        COUNT(*) as count
      FROM crimes
      GROUP BY HOUR(time_occurred)
      ORDER BY hour
    `);

    res.json({ success: true, data: hourlyData });
  } catch (error) {
    console.error('Error fetching hourly data:', error);
    res.status(500).json({ success: false, message: 'Error fetching hourly data', error: error.message });
  }
};

// Get alerts
exports.getAlerts = async (req, res) => {
  try {
    const [alerts] = await pool.query(`
      SELECT * FROM alerts
      ORDER BY created_at DESC
      LIMIT 20
    `);

    res.json({ success: true, data: alerts });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ success: false, message: 'Error fetching alerts', error: error.message });
  }
};

// Get top hotspots
exports.getTopHotspots = async (req, res) => {
  try {
    const [hotspots] = await pool.query(`
      SELECT * FROM hotspots
      ORDER BY risk_score DESC
      LIMIT 5
    `);

    res.json({ success: true, data: hotspots });
  } catch (error) {
    console.error('Error fetching hotspots:', error);
    res.status(500).json({ success: false, message: 'Error fetching hotspots', error: error.message });
  }
};
