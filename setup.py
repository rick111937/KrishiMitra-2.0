import os

def create_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

PROJECT_ROOT = "kisan-mitra-2.0"

# Files and their contents
FILES = {
    # Root files
    "README.md": """# Kisan-Mitra 2.0
Integrated Agri-Climate Intelligence Platform

## Quick Start
```bash
cp .env.example .env
docker-compose up --build
```
""",
    ".gitignore": """node_modules/
.env
dist/
__pycache__/
*.pkl
*.pyc
.DS_Store
""",
    ".env.example": """# Backend
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kisan_mitra
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# External APIs
OPENWEATHER_API_KEY=your_key_here
NASA_EARTHDATA_TOKEN=your_token_here
GOOGLE_MAPS_API_KEY=your_key_here

# AI Engine
AI_ENGINE_URL=http://ai-engine:8000
""",
    "docker-compose.yml": """version: '3.9'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    env_file: .env
    depends_on:
      - mongo
      - redis
      - ai-engine

  ai-engine:
    build: ./ai-engine
    ports:
      - "8000:8000"

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mongo_data:
""",

    # Frontend
    "frontend/package.json": """{
  "name": "kisan-mitra-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "axios": "^1.6.0",
    "zustand": "^4.5.0",
    "recharts": "^2.10.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}""",
    "frontend/vite.config.js": """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})""",
    "frontend/tailwind.config.js": """/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: [],
}""",
    "frontend/index.html": """<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kisan-Mitra 2.0</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>""",
    "frontend/src/main.jsx": """import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)""",
    "frontend/src/App.jsx": """import AppRouter from './routes/AppRouter'

function App() {
  return <AppRouter />
}

export default App""",
    "frontend/src/index.css": """@tailwind base;
@tailwind components;
@tailwind utilities;""",
    "frontend/src/routes/AppRouter.jsx": """import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardPage from '../pages/DashboardPage'
import WeatherPage from '../pages/WeatherPage'
import NotFoundPage from '../pages/NotFoundPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/soil" element={<div>Soil Analysis</div>} />
        <Route path="/crop-risk" element={<div>Crop Risk</div>} />
        <Route path="/market" element={<div>Market Intelligence</div>} />
        <Route path="/warehouses" element={<div>Warehouse Finder</div>} />
        <Route path="/alerts" element={<div>Alerts</div>} />
        <Route path="/recommendations" element={<div>Recommendations</div>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}""",

    # Backend
    "backend/package.json": """{
  "name": "kisan-mitra-backend",
  "version": "0.1.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^5.0.0",
    "mongoose": "^8.2.0",
    "redis": "^4.6.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "axios": "^1.6.0",
    "dotenv": "^16.4.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.2.0",
    "node-cron": "^3.0.3",
    "winston": "^3.12.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}""",
    "backend/server.js": """require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connectDB } = require('./config/db')
const routes = require('./routes/index')
const errorHandler = require('./middleware/errorHandler')
const requestLogger = require('./middleware/requestLogger')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'kisan-mitra-backend' }))
app.use('/api/v1', routes)
app.use(errorHandler)

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`))
})""",
    "backend/config/db.js": """const mongoose = require('mongoose');
const connectDB = async () => { await mongoose.connect(process.env.MONGODB_URI) };
module.exports = { connectDB }""",
    "backend/config/redis.js": """const { createClient } = require('redis');
const redis = createClient({ url: process.env.REDIS_URL });
module.exports = redis""",
    "backend/routes/index.js": """const router = require('express').Router()
router.use('/auth',            require('./authRoutes'))
router.use('/weather',         require('./weatherRoutes'))
router.use('/soil',            require('./soilRoutes'))
router.use('/crop-risk',       require('./cropRiskRoutes'))
router.use('/market',          require('./marketRoutes'))
router.use('/warehouses',      require('./warehouseRoutes'))
router.use('/alerts',          require('./alertRoutes'))
router.use('/recommendations', require('./recommendationRoutes'))
module.exports = router""",

    # AI Engine
    "ai-engine/requirements.txt": """fastapi==0.110.0
uvicorn==0.29.0
scikit-learn==1.4.0
pandas==2.2.0
numpy==1.26.0
python-dotenv==1.0.0
httpx==0.27.0
pydantic==2.6.0
joblib==1.3.2
""",
    "ai-engine/main.py": """from fastapi import FastAPI
from routers import prediction, risk, recommendation

app = FastAPI(title="Kisan-Mitra AI Engine", version="0.1.0")

@app.get("/health")
def health():
    return {"status": "ok", "service": "kisan-mitra-ai-engine"}

app.include_router(prediction.router, prefix="/prediction", tags=["Prediction"])
app.include_router(risk.router, prefix="/risk", tags=["Risk"])
app.include_router(recommendation.router, prefix="/recommendation", tags=["Recommendation"])
""",
    "ai-engine/Dockerfile": """FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
""",

    # Docs
    "docs/ARCHITECTURE.md": """# Architecture — Kisan-Mitra 2.0
See CONTEXT.md for full technical details.

## Services
- frontend (React/Vite) → port 3000
- backend (Node/Express) → port 5000
- ai-engine (FastAPI)    → port 8000
- mongo                  → port 27017
- redis                  → port 6379
""",
    "scripts/seed_db.js": "// TODO: seed MongoDB with sample warehouse data",
    "scripts/populate_warehouses.js": "// TODO: populate warehouses from government registry CSV"
}

# Directories to create (including empty ones or ones without specific files in loop right away)
DIRS = [
    "frontend/public/assets",
    "frontend/src/api",
    "frontend/src/components/common",
    "frontend/src/components/dashboard",
    "frontend/src/components/weather",
    "frontend/src/components/soil",
    "frontend/src/components/crop",
    "frontend/src/components/market",
    "frontend/src/components/warehouse",
    "frontend/src/components/alerts",
    "frontend/src/pages",
    "frontend/src/hooks",
    "frontend/src/store",
    "frontend/src/routes",
    "frontend/src/utils",
    "backend/config",
    "backend/routes",
    "backend/controllers",
    "backend/services",
    "backend/models",
    "backend/middleware",
    "backend/integrations",
    "backend/utils",
    "ai-engine/models",
    "ai-engine/routers",
    "ai-engine/services",
    "ai-engine/schemas",
    "ai-engine/utils",
    "docs",
    "scripts"
]

# Create directories
for d in DIRS:
    path = os.path.join(PROJECT_ROOT, d)
    os.makedirs(path, exist_ok=True)

# Create specific files
for path, content in FILES.items():
    full_path = os.path.join(PROJECT_ROOT, path)
    create_file(full_path, content)

# Create page stubs
pages = ['DashboardPage', 'WeatherPage', 'SoilAnalysisPage', 'CropRiskPage', 'MarketIntelligencePage', 'WarehouseFinderPage', 'AlertsPage', 'RecommendationsPage', 'ProfilePage', 'NotFoundPage']
for page in pages:
    path = os.path.join(PROJECT_ROOT, f"frontend/src/pages/{page}.jsx")
    content = f"""export default function {page}() {{
  return <div className="p-8"><h1 className="text-2xl font-bold">{page}</h1></div>
}}"""
    create_file(path, content)

# Create API client stubs
api_files = ['axiosClient', 'weatherApi', 'soilApi', 'marketApi', 'warehouseApi', 'alertApi']
for f in api_files:
    path = os.path.join(PROJECT_ROOT, f"frontend/src/api/{f}.js")
    create_file(path, f"// TODO: implement {f}")

# Create hook stubs
hooks = ['useWeather', 'useSoilData', 'useCropRisk', 'useMarketPrices', 'useWarehouses', 'useAlerts', 'useGeoLocation']
for h in hooks:
    path = os.path.join(PROJECT_ROOT, f"frontend/src/hooks/{h}.js")
    create_file(path, f"// TODO: implement {h}")

# Create store stubs
stores = ['useAuthStore', 'useWeatherStore', 'useAlertStore', 'useUserStore']
for s in stores:
    path = os.path.join(PROJECT_ROOT, f"frontend/src/store/{s}.js")
    create_file(path, f"// TODO: implement {s} (Zustand)")

# Create utils
create_file(os.path.join(PROJECT_ROOT, "frontend/src/utils/formatters.js"), "// formatters")
create_file(os.path.join(PROJECT_ROOT, "frontend/src/utils/riskCalculator.js"), "// riskCalculator")
create_file(os.path.join(PROJECT_ROOT, "frontend/src/utils/constants.js"), "export const APP_NAME = 'Kisan-Mitra 2.0'")
create_file(os.path.join(PROJECT_ROOT, "frontend/src/utils/validators.js"), "// validators")

# Create Backend Route stubs
route_names = ['auth', 'weather', 'soil', 'cropRisk', 'market', 'warehouse', 'alert', 'recommendation']
for name in route_names:
    path = os.path.join(PROJECT_ROOT, f"backend/routes/{name}Routes.js")
    create_file(path, "const router = require('express').Router();\n// TODO: add " + name + " routes;\nmodule.exports = router")

# Create Backend Controller and Service stubs
modules = ['auth', 'weather', 'soil', 'cropRisk', 'market', 'warehouse', 'alert', 'recommendation']
for m in modules:
    path_c = os.path.join(PROJECT_ROOT, f"backend/controllers/{m}Controller.js")
    path_s = os.path.join(PROJECT_ROOT, f"backend/services/{m}Service.js")
    create_file(path_c, f"// TODO: {m}Controller")
    create_file(path_s, f"// TODO: {m}Service")
create_file(os.path.join(PROJECT_ROOT, "backend/services/aiRecommendationService.js"), "// TODO: aiRecommendationService")

# Create Backend Model stubs
models = ['User', 'Farm', 'WeatherRecord', 'SoilRecord', 'CropRiskRecord', 'MarketPrice', 'Warehouse', 'Alert']
for model in models:
    path = os.path.join(PROJECT_ROOT, f"backend/models/{model}.js")
    create_file(path, f"const mongoose = require('mongoose');\nconst {model}Schema = new mongoose.Schema({{}});\nmodule.exports = mongoose.model('{model}', {model}Schema)")

# Create Middleware stubs
middlewares = ['authMiddleware', 'rateLimiter', 'errorHandler', 'requestLogger', 'validateRequest']
for mw in middlewares:
    path = os.path.join(PROJECT_ROOT, f"backend/middleware/{mw}.js")
    create_file(path, f"// TODO: {mw}")

# Create Integration stubs
integrations = ['openWeatherMap', 'nasaSatellite', 'agmarknetPrices', 'googleMapsGeo']
for intg in integrations:
    path = os.path.join(PROJECT_ROOT, f"backend/integrations/{intg}.js")
    create_file(path, f"// TODO: {intg} integration")

# Create Router stubs for AI Engine
for r in ['prediction', 'risk', 'recommendation']:
    path = os.path.join(PROJECT_ROOT, f"ai-engine/routers/{r}.py")
    content = f"""from fastapi import APIRouter
router = APIRouter()

@router.post("/")
async def {r}_endpoint(payload: dict):
    # TODO: implement {r} logic
    return {{"result": "stub"}}
"""
    create_file(path, content)

# Create Service stubs for AI Engine
ai_services = ['rainfallPrediction', 'cropRiskClassifier', 'marketTrendAnalyzer', 'recommendationEngine']
for s in ai_services:
    path = os.path.join(PROJECT_ROOT, f"ai-engine/services/{s}.py")
    create_file(path, f"# TODO: implement {s}")

# Create Schema stubs for AI Engine
for sc in ['weatherSchema', 'cropSchema', 'marketSchema']:
    path = os.path.join(PROJECT_ROOT, f"ai-engine/schemas/{sc}.py")
    create_file(path, f"from pydantic import BaseModel\n# TODO: define {sc}")

# Create Util stubs for AI Engine
for u in ['preprocessor', 'featureExtractor', 'modelLoader']:
    path = os.path.join(PROJECT_ROOT, f"ai-engine/utils/{u}.py")
    create_file(path, f"# TODO: implement {u}")

# Placeholders for .pkl
open(os.path.join(PROJECT_ROOT, "ai-engine/models/rainfall_predictor.pkl"), 'a').close()
open(os.path.join(PROJECT_ROOT, "ai-engine/models/crop_damage_classifier.pkl"), 'a').close()
open(os.path.join(PROJECT_ROOT, "ai-engine/models/price_trend_model.pkl"), 'a').close()

print("Scaffolding complete.")
