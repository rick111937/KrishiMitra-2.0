import os

base_path = 'c:/kishanmitra/kisan-mitra-2.0/backend'

# 1. Update server.js catch block
server_path = os.path.join(base_path, 'server.js')
with open(server_path, 'r', encoding='utf-8') as f:
    content = f.read()

fixed_server = content.replace(
    '''connectDB().then(() => {
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`))
})''',
    '''connectDB()
  .then(() => {
    console.log(`Connected to MongoDB`)
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`))
  })
  .catch(err => {
    console.error(`MongoDB connection failed: ${err.message}`)
    console.log(`Starting backend in MOCK MODE...`)
    app.listen(PORT, () => console.log(`Backend running on port ${PORT} (MOCK MODE)`))
  })'''
)

with open(server_path, 'w', encoding='utf-8') as f:
    f.write(fixed_server)

# 2. Define Controller Contents
controllers = {
    'weatherController.js': '''exports.getForecast = (req, res) => {
  res.json({
    current: { temp: 27, status: 'Mostly Cloudy', humidity: 58, wind: 12 },
    forecast: [
      { day: 'Mon', temp: 28, rain: 5, humidity: 45 },
      { day: 'Tue', temp: 27, rain: 20, humidity: 55 },
      { day: 'Wed', temp: 29, rain: 12, humidity: 50 },
      { day: 'Thu', temp: 25, rain: 75, humidity: 80 },
      { day: 'Fri', temp: 26, rain: 35, humidity: 70 }
    ]
  });
};''',
    'soilController.js': '''exports.getSoilStats = (req, res) => {
  res.json([
    { id: 1, name: 'North Field (Wheat)', moisture: 65, status: 'Optimal', health: 'Good' },
    { id: 2, name: 'South Field (Rice)', moisture: 82, status: 'High', health: 'Slight Risk' },
    { id: 3, name: 'West Field (Corn)', moisture: 42, status: 'Low', health: 'Irrigate' }
  ]);
};''',
    'marketController.js': '''exports.getPrices = (req, res) => {
  res.json([
    { id: 1, crop: 'Wheat (Good Quality)', price: 2450, change: '+4.5%', trend: 'up', mandi: 'Indore Mandi' },
    { id: 2, crop: 'Rice (Basmati)', price: 4800, change: '-1.2%', trend: 'down', mandi: 'Karnal Mandi' }
  ]);
};''',
    'cropRiskController.js': '''exports.getRiskIndex = (req, res) => {
  res.json({
    score: 78,
    breakdown: [
      { name: 'Excess Rainfall', value: 45 },
      { name: 'Soil Pests', value: 15 }
    ]
  });
};''',
    'alertController.js': '''exports.getAlerts = (req, res) => {
  res.json([
    { id: 1, type: 'critical', title: 'Heavy Rainfall Warning', message: 'Precipitation model predicts 60mm on Thursday.', time: '2 mins ago', read: false }
  ]);
};''',
    'recommendationController.js': '''exports.getAdvice = (req, res) => {
  res.json([
    { id: 1, priority: 'critical', action: 'Delay Irrigation', reason: 'Forecasting heavy rain.', category: 'Weather' }
  ]);
};''',
    'warehouseController.js': '''exports.getWarehouses = (req, res) => {
  res.json([
    { id: 1, name: 'Adani Agri Logistics', distance: '12 km', capacity: 85 }
  ]);
};'''
}

# 3. Define Route Contents
routes = {
    'weatherRoutes.js': 'weatherController',
    'soilRoutes.js': 'soilController',
    'marketRoutes.js': 'marketController',
    'cropRiskRoutes.js': 'cropRiskController',
    'alertRoutes.js': 'alertController',
    'recommendationRoutes.js': 'recommendationController',
    'warehouseRoutes.js': 'warehouseController'
}

for name, content in controllers.items():
    path = os.path.join(base_path, 'controllers', name)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

for name, controller in routes.items():
    path = os.path.join(base_path, 'routes', name)
    func = 'getForecast' if 'weather' in name else 'getSoilStats' if 'soil' in name else 'getPrices' if 'market' in name else 'getRiskIndex' if 'cropRisk' in name else 'getAlerts' if 'alert' in name else 'getAdvice' if 'recommendation' in name else 'getWarehouses'
    content = f'''const router = require('express').Router();
const {{ {func} }} = require('../controllers/{controller}');
router.get('/', {func});
module.exports = router;'''
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Backend endpoints populated with mock JSON successfully")
