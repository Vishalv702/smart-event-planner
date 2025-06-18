# 🌤️ Smart Event Planner - Backend

A backend system designed to help users plan outdoor events intelligently by considering weather forecasts and event requirements. It integrates with OpenWeatherMap to assess weather suitability and recommend better dates.

---

## 🌐 Live Demo

Access the hosted backend here:  
🔗 [Smart Event Planner on Render](https://smart-event-planner-w45e.onrender.com/)

[Postman Collection Link](https://www.postman.com/material-administrator-52747242/workspace/weather-event-planner-apis/collection/42952734-409d7770-da68-4ed0-a77f-2797c990a5b6?action=share&creator=42952734) 
---

---

## 🚀 Features

### ✅ Core Functionality

- 🌦️ **Weather API Integration**  
  Uses OpenWeatherMap API for current and 5-day forecast data. Implements caching to reduce unnecessary API calls.

- 📅 **Event Management**  
  Create, update, view, and delete events (cricket, weddings, hiking, etc.) with location and date.

- 📊 **Suitability Scoring System**  
  Weather suitability is calculated based on event type (e.g., precipitation, temperature, wind).

- 📆 **Alternative Recommendations**  
  If weather is poor, suggests better dates within a 5-day range.

- 🔁 **Caching**  
  Weather responses are cached for 1 hour to minimize API usage.

- ⚠️ **Error Handling**  
  Handles invalid inputs, missing events, and external API failures.

- 💾 **MongoDB Integration**  
  All events and weather data are stored using Mongoose and MongoDB Atlas.

---

## 📚 API Endpoints

### 🎯 Event Management

| Method | Endpoint                  | Description                       |
|--------|---------------------------|-----------------------------------|
| POST   | `/events`                 | Create a new event                |
| GET    | `/events`                 | List all events                   |
| GET    | `/events/:id`            | Get single event by ID            |
| PUT    | `/events/:id`            | Update an existing event          |
| DELETE | `/events/:id`            | Delete an event                   |

### 🌤️ Weather Integration

| Method | Endpoint                                 | Description                            |
|--------|------------------------------------------|----------------------------------------|
| GET    | `/weather/:location/:date`               | Get weather for specific date/location |
| POST   | `/events/:id/weather-check`              | Check weather & update event           |
| GET    | `/weather/event/:id/suitability`         | Suitability score for event            |
| GET    | `/weather/event/:id/alternatives`        | Suggest better dates for event         |

---

## 📦 Tech Stack

- **Node.js** & **Express.js** – Backend Framework
- **MongoDB Atlas** – Cloud Database
- **Mongoose** – ODM for MongoDB
- **OpenWeatherMap API** – Weather Integration
- **Postman** – API Testing

---

## 🔑 Environment Variables (`.env`)

