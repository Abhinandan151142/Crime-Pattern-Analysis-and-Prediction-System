const { pool } = require('../config/database');

// Get all crimes with pagination and filtering
exports.getAllCrimes = async (req, res) => {
  try {
    const { page = 1, limit = 20, district, type, severity, from, to } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM crimes WHERE 1=1';
    const params = [];

    if (district) {
      query += ' AND district = ?';
      params.push(district);
    }
    if (type) {
      query += ' AND crime_type = ?';
      params.push(type);
    }
    if (severity) {
      query += ' AND severity = ?';
      params.push(severity);
    }
    if (from) {
      query += ' AND date_reported >= ?';
      params.push(from);
    }
    if (to) {
      query += ' AND date_reported <= ?';
      params.push(to);
    }

    query += ' ORDER BY date_reported DESC, time_occurred DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [crimes] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM crimes WHERE 1=1';
    const countParams = params.slice(0, -2);
    const [countResult] = await pool.query(countQuery.replace(' ORDER BY date_reported DESC, time_occurred DESC LIMIT ? OFFSET ?', ''), countParams);

    res.json({
      success: true,
      data: crimes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching crimes:', error);
    res.status(500).json({ success: false, message: 'Error fetching crimes', error: error.message });
  }
};

// Get single crime by ID
exports.getCrimeById = async (req, res) => {
  try {
    const { id } = req.params;
    const [crimes] = await pool.query('SELECT * FROM crimes WHERE crime_id = ?', [id]);
    
    if (crimes.length === 0) {
      return res.status(404).json({ success: false, message: 'Crime not found' });
    }

    res.json({ success: true, data: crimes[0] });
  } catch (error) {
    console.error('Error fetching crime:', error);
    res.status(500).json({ success: false, message: 'Error fetching crime', error: error.message });
  }
};

// Add new crime
exports.createCrime = async (req, res) => {
  try {
    const {
      crime_type,
      crime_category,
      location_name,
      latitude,
      longitude,
      district,
      city,
      state,
      date_reported,
      time_occurred,
      severity,
      description
    } = req.body;

    const query = `
      INSERT INTO crimes (
        crime_type, crime_category, location_name, latitude, longitude,
        district, city, state, date_reported, time_occurred, severity, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(query, [
      crime_type, crime_category, location_name, latitude, longitude,
      district, city, state, date_reported, time_occurred, severity, description
    ]);

    res.status(201).json({
      success: true,
      message: 'Crime created successfully',
      crimeId: result.insertId
    });
  } catch (error) {
    console.error('Error creating crime:', error);
    res.status(500).json({ success: false, message: 'Error creating crime', error: error.message });
  }
};

// Get statistics overview
exports.getStats = async (req, res) => {
  try {
    const [totalCrimes] = await pool.query('SELECT COUNT(*) as total FROM crimes');
    const [openCases] = await pool.query('SELECT COUNT(*) as total FROM crimes WHERE status = "open"');
    const [arrests] = await pool.query('SELECT COUNT(*) as total FROM crimes WHERE arrest_made = TRUE');
    const [highRisk] = await pool.query('SELECT COUNT(DISTINCT district) as total FROM crimes WHERE severity IN ("high", "critical")');

    res.json({
      success: true,
      data: {
        totalCrimes: totalCrimes[0].total,
        openCases: openCases[0].total,
        arrests: arrests[0].total,
        highRiskAreas: highRisk[0].total
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching stats', error: error.message });
  }
};

// Get recent crimes
exports.getRecentCrimes = async (req, res) => {
  try {
    const [crimes] = await pool.query(
      'SELECT * FROM crimes ORDER BY date_reported DESC, time_occurred DESC LIMIT 50'
    );
    res.json({ success: true, data: crimes });
  } catch (error) {
    console.error('Error fetching recent crimes:', error);
    res.status(500).json({ success: false, message: 'Error fetching recent crimes', error: error.message });
  }
};

// Get crimes by district
exports.getCrimesByDistrict = async (req, res) => {
  try {
    const { name } = req.params;
    const [crimes] = await pool.query(
      'SELECT * FROM crimes WHERE district = ? ORDER BY date_reported DESC',
      [name]
    );
    res.json({ success: true, data: crimes });
  } catch (error) {
    console.error('Error fetching crimes by district:', error);
    res.status(500).json({ success: false, message: 'Error fetching crimes', error: error.message });
  }
};

// Search crimes
exports.searchCrimes = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query required' });
    }

    const searchPattern = `%${q}%`;
    const [crimes] = await pool.query(
      `SELECT * FROM crimes 
       WHERE crime_type LIKE ? 
       OR location_name LIKE ? 
       OR district LIKE ?
       OR description LIKE ?
       ORDER BY date_reported DESC
       LIMIT 50`,
      [searchPattern, searchPattern, searchPattern, searchPattern]
    );

    res.json({ success: true, data: crimes });
  } catch (error) {
    console.error('Error searching crimes:', error);
    res.status(500).json({ success: false, message: 'Error searching crimes', error: error.message });
  }
};
