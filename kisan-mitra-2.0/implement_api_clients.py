import os

api_path = 'c:/kishanmitra/kisan-mitra-2.0/frontend/src/api'

clients = {
    'weatherApi.js': '''import axiosClient from './axiosClient';
export const fetchWeather = () => axiosClient.get('/weather');''',
    'soilApi.js': '''import axiosClient from './axiosClient';
export const fetchSoilStats = () => axiosClient.get('/soil');''',
    'marketApi.js': '''import axiosClient from './axiosClient';
export const fetchPrices = () => axiosClient.get('/market');''',
    'cropRiskApi.js': '''import axiosClient from './axiosClient';
export const fetchRiskIndex = () => axiosClient.get('/crop-risk');''',
    'alertApi.js': '''import axiosClient from './axiosClient';
export const fetchAlerts = () => axiosClient.get('/alerts');''',
    'recommendationApi.js': '''import axiosClient from './axiosClient';
export const fetchAdvice = () => axiosClient.get('/recommendations');'''
}

for name, content in clients.items():
    path = os.path.join(api_path, name)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Frontend API clients created successfully")
