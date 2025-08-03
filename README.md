# 🌦️ WeatherStack App

A full-stack weather widget application built with **Node.js**, **Next.js**, and **MongoDB**, using a modular microservices architecture.

---

## Project Structure

```txt
.
├── backend
│   ├── widget-service      # Handles weather widget storage (MongoDB)
│   └── weather-service     # Microservice for fetching weather & geocoding data
├── frontend                # Next.js 15 frontend using App Router
└── README.md
```

---

## Backend Architecture

### widget-service (Node.js + Express + MongoDB)

- Stores widget data in a MongoDB collection.
- Exposes a REST API at `/api/widgets`.
- Connected to a local or containerized MongoDB (`localhost:27017` by default).

#### Run Locally

```bash
cd backend/widget-service
npm install
npm start
```

### weather-service (Node.js + Express)

- Exposes `GET /weather?city=Berlin` to fetch weather data.
- Utilizes:

  - [Open Meteo Forecast API](https://api.open-meteo.com/v1/forecast)
  - [Open Meteo Geocoding API](https://geocoding-api.open-meteo.com/v1/search)

- Runs on **http://localhost:4000**

#### Run Locally

```bash
cd backend/weather-service
npm install
npm start
```

---

## Frontend Architecture

- Built with **Next.js 15** using **App Router**.
- UI styled with **TailwindCSS**.
- Icons by **lucide-react**.
- Shows weather widgets and allows adding widgets by city name.

#### Run Locally

```bash
cd frontend
npm install
npm run dev-frontend
```

Frontend runs on: **http://localhost:3000**

---

## Testing

### Backend

- Backend services are tested with **Jest** and **Supertest**.
- Unit & integration tests cover routing and MongoDB operations.

Run tests:

```bash
cd backend/widget-service
npm test
```

---

## GitHub Actions (CI)

CI is configured for the backend using GitHub Actions.

### Workflow

The tests for `widget-service` are automatically run using this workflow:

**[Run the CI pipeline on GitHub](https://github.com/dev-bhadani/weather-stack/actions/workflows/docker-image.yml)**

You can click **"Run Workflow"** on that page to trigger the CI pipeline manually.

---

## APIs Used

- **Weather Forecast API**: https://api.open-meteo.com/v1/forecast
- **Geocoding API**: https://geocoding-api.open-meteo.com/v1/search

---

## Technologies Used

- **Frontend**: Next.js, React 19, TailwindCSS, Axios, React Toastify, Lucide Icons
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Testing**: Jest, Supertest
- **CI**: GitHub Actions
- **API Providers**: Open-Meteo (Forecast & Geocoding)
