# KrishiMitra-2.0
# 🌾 Kisan-Mitra 2.0

**Integrated Agri-Climate Intelligence Platform**

---

## 📖 Overview

**Kisan-Mitra 2.0** is an AI-powered agricultural intelligence platform designed to predict the economic impact of climate factors on agriculture. It assists farmers, traders, and government agencies in making data-driven decisions by incorporating satellite imagery, soil moisture analysis, and real-time market intelligence.

---

## 🚀 Key Modules

| Module | Description |
| :--- | :--- |
| **🌦️ Weather Prediction** | Real-time and 7-day rainfall forecasting using external APIs and AI calibration. |
| **🛰️ Soil Moisture Analysis** | Satellite-based monitoring using NASA MODIS data. |
| **⚠️ Crop Risk Engine** | Predicts probability and severity of crop damage using ML classifiers. |
| **📈 Market Intelligence** | Tracks crop prices and trends via Agmarknet. |
| **🚨 Alert System** | Dashboard notifications for critical risks (heavy rain, price drops). |
| **📍 Warehouse Finder** | Locates nearest storage facilities using geospatial queries. |
| **🧠 AI Recommendation** | Aggregates all data into actionable advice (e.g., "Delay harvest"). |

---

## 🛠️ Technical Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Zustand, Framer Motion |
| **Backend** | Node.js 20, Express 5, MongoDB (Mongoose), Redis (Caching) |
| **AI Engine** | Python 3.11, FastAPI, scikit-learn, Pandas |
| **Orchestration** | Docker & Docker Compose |

---

## 📂 Project Structure

```text
kisan-mitra-2.0/
├── ai-engine/          # Python FastAPI microservice (ML endpoints)
├── backend/           # Node.js/Express REST API
├── frontend/          # React/Vite Single Page Application
├── docs/             # Technical documentation & architecture
└── docker-compose.yml # Service orchestration
```

---

## ⚙️ Getting Started

### Prerequisites

-   [Docker](https://docs.docker.com/get-docker/) installed on your system.
-   [Docker Compose](https://docs.docker.com/compose/install/) installed.

### 🏃‍♂️ Quick Start (Docker)

The fastest way to run the entire stack (Frontend, Backend, AI Engine, Mongo, Redis) is using Docker Compose.

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd kisan-mitra-2.0
    ```

2.  **Environment Setup**:
    Copy the example environment file.
    ```bash
    cp .env.example .env
    ```
    *(Optional: Edit `.env` to add external API keys like OpenWeatherMap, if required for updates).*

3.  **Start Services**:
    ```bash
    docker-compose up --build
    ```

4.  **Access the Application**:
    -   **Frontend**: `http://localhost:3000`
    -   **Backend API**: `http://localhost:5000/api/v1/`
    -   **AI Engine**: `http://localhost:8000/`

---

## 🏗️ Architecture

The system follows a **three-tier microservice architecture**:

1.  **Browser (React SPA)** interacts with the Backend via REST/JSON.
2.  **Backend (Express API)** handles Authentication, Caching (Redis), Database (MongoDB), and aggregates services.
3.  **AI Engine (FastAPI)** provides ML inference and communicates with external APIs (Weather, Satellite).

---

## 📄 License

This project is licensed under the MIT License.
