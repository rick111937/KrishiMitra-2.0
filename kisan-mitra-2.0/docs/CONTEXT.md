# KISAN-MITRA 2.0 — ANTIGRAVITY IDE CONTEXT DOCUMENT
**Version:** 1.0.0
**Project:** Integrated Agri-Climate Intelligence Platform
**Status:** Initial scaffolding complete — development not yet started
**Last Updated:** 2026-03-18

---

## 1. PROJECT OVERVIEW

**Kisan-Mitra 2.0** is a web-based AI-powered agricultural intelligence platform designed to predict the economic impact of rainfall on agriculture and assist farmers, traders, and government agencies in making data-driven decisions. It is the successor to Kisan-Mitra 1.0 and significantly expands scope by incorporating satellite imagery, soil moisture analysis, and real-time market intelligence.

**Target Users:**
- Farmers (primary) — receive alerts, risk scores, and crop recommendations
- Traders — monitor market price trends and warehouse availability
- Government Agencies — view aggregated risk data for policy and relief decisions

---

## 2. TECHNICAL STACK

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, Tailwind CSS, Zustand (state), React Router v6 |
| Backend | Node.js 20 + Express 5, MongoDB (Mongoose), Redis (caching) |
| AI Engine | Python 3.11 + FastAPI, scikit-learn, pandas, numpy |
| Containerization | Docker + Docker Compose |
| External APIs | OpenWeatherMap, NASA SRTM/MODIS Satellite, Agmarknet (crop prices), Google Maps Geocoding |
| Auth | JWT-based authentication |
| Deployment Target | Cloud (AWS/GCP/Azure) — browser-based, no mobile app |

---

## 3. ARCHITECTURE SUMMARY

The system is a **three-tier microservice architecture**:

```
Browser (React SPA)
     ↕  REST/JSON
Node.js Express API  ←→  MongoDB + Redis
     ↕  HTTP
Python FastAPI AI Engine  (runs as separate microservice)
     ↕
External APIs (Weather, Satellite, Market, Maps)
```

- The **frontend** is a fully responsive SPA served via Vite.
- The **backend** is an Express REST API that handles auth, data persistence, external API orchestration, caching, and alert dispatch.
- The **AI engine** is a FastAPI microservice that exposes ML prediction endpoints consumed by the backend's `aiRecommendationService.js`.
- All services are wired together via **Docker Compose** for local development.

---

## 4. FUNCTIONAL MODULES (Per SRS)

### 4.1 Weather Prediction Module
- **Goal:** Real-time and 7-day rainfall prediction for a farmer's registered location.
- **Data Source:** OpenWeatherMap One Call API 3.0.
- **Backend:** `weatherService.js` fetches and caches data in Redis (TTL 30 min).
- **AI Engine:** `rainfallPrediction.py` runs a trained time-series model (`rainfall_predictor.pkl`) to extend or refine predictions beyond the API's horizon.
- **Frontend:** `WeatherPage.jsx` — displays `RainfallChart.jsx` (line chart) and `WeatherForecastCard.jsx` (7-day card strip).

### 4.2 Soil Moisture Analysis Module
- **Goal:** Satellite-based real-time soil moisture monitoring per farm location.
- **Data Source:** NASA MODIS satellite API (Terra/Aqua soil moisture product).
- **Backend:** `soilService.js` fetches satellite tile data, extracts moisture index for the farm's GPS coordinates.
- **Frontend:** `SoilAnalysisPage.jsx` — renders `SoilMoistureGauge.jsx` and `SatelliteImageViewer.jsx`.
- **Model File:** Not ML-predicted — raw satellite index used directly.

### 4.3 Crop Risk Engine
- **Goal:** Predict the probability and severity of crop damage based on weather + soil data.
- **AI Model:** `crop_damage_classifier.pkl` — multi-class classifier (Low / Medium / High / Critical risk) trained on historical rainfall-damage correlation data.
- **Inputs:** rainfall forecast, soil moisture index, crop type, growth stage.
- **Backend:** `cropRiskService.js` assembles inputs and posts to AI engine `/risk/crop` endpoint.
- **Frontend:** `CropRiskPage.jsx` — displays `CropRiskMeter.jsx` (risk gauge) and `CropDamageTable.jsx`.

### 4.4 Market Intelligence Module
- **Goal:** Analyze and display real-time crop prices and identify price trends.
- **Data Source:** Agmarknet (Government of India market price API).
- **Backend:** `marketService.js` fetches price data, computes 7-day rolling average, identifies rising/falling trends.
- **AI Model:** `price_trend_model.pkl` (optional enhancement) — short-term price direction predictor.
- **Frontend:** `MarketIntelligencePage.jsx` — displays `PriceChart.jsx` (candlestick/line) and `CropPriceTable.jsx`.

### 4.5 Alert System
- **Goal:** Notify farmers via the dashboard when critical risk conditions are detected.
- **Trigger Conditions:**
  - Rainfall forecast exceeds threshold (>50mm in 24h)
  - Soil moisture index falls below drought threshold
  - Crop risk score reaches "High" or "Critical"
  - Market price drops >15% in 48h
- **Backend:** `alertService.js` runs scheduled checks (cron every 30 min), generates `Alert` documents in MongoDB, marks as read/unread.
- **Frontend:** `AlertsPage.jsx` + `AlertBanner.jsx` (persistent top banner for critical alerts).

### 4.6 Warehouse Finder Module
- **Goal:** Suggest the nearest available agricultural storage warehouses.
- **Data Source:** Internal MongoDB collection (`Warehouse`) pre-seeded from government warehouse registry data.
- **Backend:** `warehouseService.js` uses MongoDB `$geoNear` aggregation to find nearest 5 warehouses within 100km.
- **Frontend:** `WarehouseFinderPage.jsx` — renders `WarehouseMap.jsx` (Google Maps embed) and `WarehouseList.jsx`.

### 4.7 AI Recommendation Engine
- **Goal:** Synthesize all module outputs into a single actionable recommendation.
- **Logic:** `aiRecommendationService.js` (backend) assembles risk score + market trend + soil status → posts to AI engine `/recommendation` endpoint → returns structured JSON advice.
- **AI Engine:** `recommendationEngine.py` uses a rule-augmented model to produce recommendations like "Delay harvest by 3 days", "Move crop to warehouse now", "Irrigate within 48 hours".
- **Frontend:** `RecommendationsPage.jsx` — displays `CropRecommendationCard.jsx` with priority-ranked cards.

---

## 5. NON-FUNCTIONAL REQUIREMENTS

| Requirement | Specification |
|---|---|
| Performance | API response < 2 seconds for all endpoints; AI inference < 3 seconds |
| Scalability | Backend horizontally scalable; Redis caching minimizes external API load |
| Availability | 24/7 uptime target; Docker health checks on all services |
| Security | JWT auth, bcrypt password hashing, HTTPS only, rate limiting (100 req/min/IP) |
| Usability | Fully responsive (mobile-first Tailwind); accessible contrast ratios |

---

## 6. EXTERNAL INTERFACES

### APIs Integrated
| API | Purpose | Auth Method |
|---|---|---|
| OpenWeatherMap One Call 3.0 | Weather + rainfall forecast | API Key |
| NASA MODIS Earthdata | Satellite soil moisture | Earthdata token |
| Agmarknet | Crop market prices | Open (Gov India) |
| Google Maps Geocoding | Farm GPS → address resolution | API Key |

### Database Schemas (MongoDB Collections)
- `users` — auth credentials, role (farmer/trader/govt), farm location (GeoJSON Point)
- `farms` — linked to user, crop type, growth stage, area (ha)
- `weatherrecords` — cached weather snapshots per location + timestamp
- `soilrecords` — cached satellite soil moisture per location + timestamp
- `cropriskrecords` — risk scores per farm per day
- `marketprices` — crop price records per mandI per date
- `warehouses` — name, location (GeoJSON Point), capacity, contact
- `alerts` — type, severity, message, userId, read status, createdAt

---

## 7. DEVELOPMENT PROGRESS LOG

### Phase 0 — Project Setup (Current Phase)
- [x] SRS reviewed and analyzed
- [x] File structure designed and documented
- [x] Context document created
- [x] Automated setup script generated (`scripts/setup.sh`)
- [ ] Git repository initialized
- [ ] Docker Compose configured
- [ ] `.env.example` files created

### Phase 1 — Backend Foundation (Not Started)
- [ ] Express server scaffolded (`server.js`)
- [ ] MongoDB connection configured (`config/db.js`)
- [ ] Redis connection configured (`config/redis.js`)
- [ ] All Mongoose models created
- [ ] JWT auth middleware implemented
- [ ] Health check endpoint live (`GET /api/health`)

### Phase 2 — AI Engine (Not Started)
- [ ] FastAPI app scaffolded (`ai-engine/main.py`)
- [ ] Placeholder endpoints for `/prediction`, `/risk`, `/recommendation`
- [ ] Model loading utility (`modelLoader.py`)
- [ ] Dummy model files created for dev testing

### Phase 3 — Core Services (Not Started)
- [ ] Weather service + OpenWeatherMap integration
- [ ] Soil service + NASA MODIS integration
- [ ] Crop risk service + AI engine call
- [ ] Market service + Agmarknet integration
- [ ] Warehouse service + geospatial query
- [ ] Alert service + cron job
- [ ] AI Recommendation service (aggregator)

### Phase 4 — Frontend (Not Started)
- [ ] React + Vite project scaffolded
- [ ] Tailwind + PostCSS configured
- [ ] Routing structure (`AppRouter.jsx`)
- [ ] Auth flow (login/register pages)
- [ ] Dashboard page + widgets
- [ ] All 7 feature pages built
- [ ] Zustand stores connected to API hooks

### Phase 5 — Integration & Testing (Not Started)
- [ ] End-to-end integration testing
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Performance benchmarks
- [ ] Security audit

---

## 8. KEY CONVENTIONS FOR THE IDE

- **File naming:** camelCase for JS/JSX files, snake_case for Python files.
- **API routes prefix:** All backend routes are prefixed `/api/v1/`.
- **Error format:** All API errors return `{ success: false, message: "...", code: "ERROR_CODE" }`.
- **Success format:** All API successes return `{ success: true, data: {...} }`.
- **Environment variables:** Never hardcode API keys. Always use `process.env.VAR_NAME` (Node) or `os.getenv("VAR_NAME")` (Python).
- **AI engine URL:** Backend calls AI engine at `http://ai-engine:8000` (Docker network alias).
- **Caching strategy:** All external API calls are cached in Redis. Weather TTL = 30min, Market TTL = 60min, Soil TTL = 6h.

---

## 9. FUTURE ENHANCEMENTS (Post-MVP)

Per SRS Section 7:
1. **Voice Support** — Integrate Web Speech API on frontend for hands-free alerts.
2. **Chatbot Integration** — LLM-based conversational assistant (Kisan-Bot) embedded on dashboard.
3. **PWA Capabilities** — Service worker + manifest for offline access and push notifications.

---

## 10. CONSTRAINTS & KNOWN RISKS

| Constraint | Mitigation |
|---|---|
| Requires internet connectivity | Cache data aggressively in Redis; show stale-data warnings |
| External API rate limits | Redis caching + exponential backoff retry logic |
| Satellite data accuracy varies by season/cloud cover | Show confidence bands in UI; note data freshness timestamp |
| Agmarknet API reliability (Gov India) | Fallback to last known price with staleness indicator |
