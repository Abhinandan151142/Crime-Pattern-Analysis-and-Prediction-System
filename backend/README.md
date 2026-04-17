# Crime Analysis Dashboard - Backend API

Node.js backend API for the Crime Analysis Dashboard with real-time updates via Socket.IO.

## 🚀 Features

- RESTful API for crime data management
- Real-time updates using Socket.IO
- MySQL database integration
- Prediction endpoints (ML ready)
- Dashboard analytics endpoints
- CORS enabled for frontend integration

## 📋 Prerequisites

- Node.js >= 18.0.0
- MySQL database
- npm or yarn

## 🔧 Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials.

## 🏃 Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

## 🌐 API Endpoints

### Health Check
- `GET /health` - Server health status

### Crime Routes
- `GET /api/crimes` - Get all crimes (with pagination)
- `GET /api/crimes/:id` - Get single crime
- `POST /api/crimes` - Create new crime
- `GET /api/crimes/stats/overview` - Get statistics
- `GET /api/crimes/recent` - Get recent crimes
- `GET /api/crimes/search?q=keyword` - Search crimes
- `GET /api/crimes/district/:name` - Get crimes by district

### Dashboard Routes
- `GET /api/dashboard/summary` - Dashboard summary stats
- `GET /api/dashboard/charts/monthly` - Monthly crime data
- `GET /api/dashboard/charts/by-type` - Crime breakdown by type
- `GET /api/dashboard/charts/by-district` - Crime by district
- `GET /api/dashboard/charts/hourly` - Hourly distribution
- `GET /api/dashboard/alerts` - Get alerts
- `GET /api/dashboard/top-hotspots` - Top 5 hotspots

### Prediction Routes
- `GET /api/predictions/district/:name` - Predictions for district
- `GET /api/predictions/hotspots` - Current hotspots
- `GET /api/predictions/weekly/:district` - 7-day forecast
- `GET /api/predictions/risk/:district` - Risk level
- `POST /api/predictions/generate` - Generate predictions
- `GET /api/predictions/accuracy` - Model metrics

## 🔌 Socket.IO Events

### Client → Server
- `join_district` - Join district-specific room
- `leave_district` - Leave district room

### Server → Client
- `new_crime_alert` - New crime added
- `district_crime_alert` - District-specific crime
- `prediction_update` - Predictions updated
- `hotspot_update` - Hotspots updated
- `dashboard_refresh` - Dashboard stats updated
- `risk_alert` - High risk alert
- `district_risk_alert` - District-specific risk

## 📦 Deployment on Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set environment variables in Render dashboard
5. Deploy!

### Environment Variables Required:
- `DB_HOST` - MySQL host
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `PORT` - Server port (auto-set by Render)
- `NODE_ENV` - Set to `production`

## 🗄️ Database Setup

Run the SQL schema provided in `database/schema.sql` to create all required tables.

## 📝 License

MIT
