import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from '../components/common/MainLayout'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import DashboardPage from '../pages/DashboardPage'
import WeatherPage from '../pages/WeatherPage'
import SoilAnalysisPage from '../pages/SoilAnalysisPage'
import CropRiskPage from '../pages/CropRiskPage'
import MarketIntelligencePage from '../pages/MarketIntelligencePage'
import WarehouseFinderPage from '../pages/WarehouseFinderPage'
import AlertsPage from '../pages/AlertsPage'
import RecommendationsPage from '../pages/RecommendationsPage'
import NotFoundPage from '../pages/NotFoundPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/soil" element={<SoilAnalysisPage />} />
          <Route path="/crop-risk" element={<CropRiskPage />} />
          <Route path="/market" element={<MarketIntelligencePage />} />
          <Route path="/warehouses" element={<WarehouseFinderPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}