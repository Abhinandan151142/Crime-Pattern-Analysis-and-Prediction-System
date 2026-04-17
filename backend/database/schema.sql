-- Crime Analysis Database Schema
-- Run this SQL script to create all required tables

CREATE DATABASE IF NOT EXISTS crime_analysis_db;
USE crime_analysis_db;

-- =============================================
-- TABLE 1: crimes (Main crime records table)
-- =============================================
CREATE TABLE IF NOT EXISTS crimes (
    crime_id        INT AUTO_INCREMENT PRIMARY KEY,
    crime_type      VARCHAR(100) NOT NULL,
    crime_category  VARCHAR(50) NOT NULL,
    location_name   VARCHAR(255) NOT NULL,
    latitude        DECIMAL(10, 8) NOT NULL,
    longitude       DECIMAL(11, 8) NOT NULL,
    district        VARCHAR(100) NOT NULL,
    city            VARCHAR(100) NOT NULL DEFAULT 'Kanpur',
    state           VARCHAR(100) NOT NULL DEFAULT 'Uttar Pradesh',
    date_reported   DATE NOT NULL,
    time_occurred   TIME NOT NULL,
    day_of_week     VARCHAR(20),
    month           INT,
    year            INT,
    season          VARCHAR(20),
    weather         VARCHAR(50),
    status          ENUM('open','closed','investigating') DEFAULT 'open',
    severity        ENUM('low','medium','high','critical') NOT NULL,
    arrest_made     BOOLEAN DEFAULT FALSE,
    victim_count    INT DEFAULT 1,
    description     TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date_reported),
    INDEX idx_district (district),
    INDEX idx_type (crime_type),
    INDEX idx_location (latitude, longitude)
);

-- =============================================
-- TABLE 2: predictions (ML Model Outputs)
-- =============================================
CREATE TABLE IF NOT EXISTS predictions (
    prediction_id       INT AUTO_INCREMENT PRIMARY KEY,
    district            VARCHAR(100) NOT NULL,
    crime_type          VARCHAR(100) NOT NULL,
    predicted_date      DATE NOT NULL,
    probability_score   DECIMAL(5, 4) NOT NULL,
    risk_level          ENUM('low','medium','high','critical'),
    confidence          DECIMAL(5, 2),
    model_version       VARCHAR(20) DEFAULT 'v1.0',
    features_used       JSON,
    actual_occurred     BOOLEAN DEFAULT NULL,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_pred_date (predicted_date),
    INDEX idx_pred_district (district)
);

-- =============================================
-- TABLE 3: hotspots (Geographic Risk Zones)
-- =============================================
CREATE TABLE IF NOT EXISTS hotspots (
    hotspot_id      INT AUTO_INCREMENT PRIMARY KEY,
    district        VARCHAR(100) NOT NULL,
    latitude        DECIMAL(10, 8) NOT NULL,
    longitude       DECIMAL(11, 8) NOT NULL,
    radius_meters   INT DEFAULT 500,
    risk_score      DECIMAL(5, 2) NOT NULL,
    crime_count     INT DEFAULT 0,
    dominant_crime  VARCHAR(100),
    time_peak       VARCHAR(20),
    day_peak        VARCHAR(20),
    last_updated    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE 4: districts (Area Information)
-- =============================================
CREATE TABLE IF NOT EXISTS districts (
    district_id         INT AUTO_INCREMENT PRIMARY KEY,
    district_name       VARCHAR(100) UNIQUE NOT NULL,
    city                VARCHAR(100) DEFAULT 'Kanpur',
    state               VARCHAR(100) DEFAULT 'Uttar Pradesh',
    population          INT,
    area_sq_km          DECIMAL(10, 2),
    police_stations     INT DEFAULT 1,
    officers_deployed   INT,
    crime_rate          DECIMAL(8, 4),
    safety_index        DECIMAL(5, 2),
    latitude_center     DECIMAL(10, 8),
    longitude_center    DECIMAL(11, 8)
);

-- =============================================
-- TABLE 5: crime_patterns (Analyzed Patterns)
-- =============================================
CREATE TABLE IF NOT EXISTS crime_patterns (
    pattern_id      INT AUTO_INCREMENT PRIMARY KEY,
    pattern_name    VARCHAR(100),
    crime_type      VARCHAR(100),
    district        VARCHAR(100),
    time_pattern    VARCHAR(50),
    day_pattern     VARCHAR(100),
    monthly_trend   JSON,
    seasonal_trend  JSON,
    year_over_year  DECIMAL(5, 2),
    correlation     JSON,
    analyzed_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE 6: alerts (System Alerts)
-- =============================================
CREATE TABLE IF NOT EXISTS alerts (
    alert_id        INT AUTO_INCREMENT PRIMARY KEY,
    alert_type      VARCHAR(50),
    district        VARCHAR(100),
    message         TEXT,
    severity        ENUM('info','warning','danger','critical'),
    is_read         BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE 7: users (Dashboard Users - Optional)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    user_id         INT AUTO_INCREMENT PRIMARY KEY,
    username        VARCHAR(100) UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    role            ENUM('admin','analyst','viewer') DEFAULT 'viewer',
    last_login      TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE 8: model_metrics (AI Model Performance)
-- =============================================
CREATE TABLE IF NOT EXISTS model_metrics (
    metric_id       INT AUTO_INCREMENT PRIMARY KEY,
    model_name      VARCHAR(100) DEFAULT 'Crime Prediction Model',
    model_version   VARCHAR(20) DEFAULT 'v1.0',
    accuracy        DECIMAL(5, 4),
    precision_score DECIMAL(5, 4),
    recall_score    DECIMAL(5, 4),
    f1_score        DECIMAL(5, 4),
    rmse            DECIMAL(10, 6),
    training_size   INT,
    test_size       INT,
    trained_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Insert Sample Districts for Kanpur
-- =============================================
INSERT INTO districts (district_name, city, state, population, latitude_center, longitude_center) VALUES
('Kakadeo', 'Kanpur', 'Uttar Pradesh', 150000, 26.4650, 80.3500),
('Kalyanpur', 'Kanpur', 'Uttar Pradesh', 120000, 26.5100, 80.2800),
('Govind Nagar', 'Kanpur', 'Uttar Pradesh', 180000, 26.4500, 80.3400),
('Barra', 'Kanpur', 'Uttar Pradesh', 140000, 26.4200, 80.3000),
('Kidwai Nagar', 'Kanpur', 'Uttar Pradesh', 100000, 26.4700, 80.3200),
('Rawatpur', 'Kanpur', 'Uttar Pradesh', 110000, 26.4400, 80.3600),
('Panki', 'Kanpur', 'Uttar Pradesh', 130000, 26.4300, 80.3800)
ON DUPLICATE KEY UPDATE district_name=district_name;

-- =============================================
-- Insert Sample Model Metrics
-- =============================================
INSERT INTO model_metrics (model_name, model_version, accuracy, precision_score, recall_score, f1_score, training_size, test_size) VALUES
('Crime Prediction Model', 'v1.0', 0.8850, 0.8750, 0.8350, 0.8650, 50000, 12500)
ON DUPLICATE KEY UPDATE model_version=model_version;

-- =============================================
-- Sample Alert
-- =============================================
INSERT INTO alerts (alert_type, district, message, severity) VALUES
('Risk Alert', 'Govind Nagar', 'High crime probability detected for this weekend', 'warning')
ON DUPLICATE KEY UPDATE alert_id=alert_id;
