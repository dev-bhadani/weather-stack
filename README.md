# 🌦️ WeatherStack App

WeatherStack is a full-stack weather widget application built with Node.js, Express, MongoDB, and Next.js. It allows users to add city-based weather widgets, fetching real-time data using public APIs.

---

## Architecture

### Backend

The backend consists of two microservices:

- **weather-service** (port `4000`): Fetches weather and geolocation data.
- **widget-service** (port `5000`): Stores user-added widgets in MongoDB and fetches weather data via `weather-service`.

### Frontend

- **frontend** (port `3000`): A Next.js application that allows users to interact with widgets.

---

## Tech Stack

- **Frontend:** Next.js 15, React 19, TailwindCSS
- **Backend:** Node.js, Express, TypeScript, MongoDB
- **APIs Used:**
  - https://api.open-meteo.com/v1/forecast
  - https://geocoding-api.open-meteo.com/v1/search
- **DevOps:** Docker, Docker Compose, GitHub Actions

---

## Project Structure

```
.
├── backend/
│   ├── weather-service/
│   └── widget-service/
├── frontend/
├── docker-compose.yml
└── README.md
```

---

## Run the App Using Docker Compose

### Prerequisites

- Docker: https://www.docker.com/products/docker-desktop
- Docker Compose: https://docs.docker.com/compose/

### Steps

1. Open terminal at the project root.
2. Run:

```bash
docker-compose up --build
```

This will spin up:

- MongoDB on port `27017`
- `weather-service` on port `4000`
- `widget-service` on port `5000`
- `frontend` on port `3000`

3. Access the app at: http://localhost:3000

---

## GitHub Actions (CI)

CI is configured for the backend using GitHub Actions.

Instead of including the full workflow here, you can view and trigger the pipeline manually:

**[Run the CI pipeline on GitHub](https://github.com/dev-bhadani/weather-stack/actions/workflows/docker-image.yml)**

Click “Run Workflow” to execute.

