# 🌤️ Smart Event Planner – Full Stack Application

A complete weather-based event planning system that helps users organize outdoor events by analyzing real-time and forecasted weather conditions. Suggests optimal dates to ensure your events are never ruined by bad weather!

## 🚀 Live Demos
- **Frontend (Client)**: [https://smarteventplanner.netlify.app/](https://smarteventplanner.netlify.app/) (Hosted on Netlify)
- **Backend (API)**: [https://smart-event-planner-w45e.onrender.com](https://smart-event-planner-w45e.onrender.com) (Hosted on Render)

## ✨ Features
- **🌦️ Smart Weather Analysis**: Real-time, 5-day forecast, and historical weather data integration
- **📅 Event Suitability Scoring**: Algorithm-based scoring for different event types (cricket, wedding, hiking, etc.)
- **🔄 Alternative Date Suggestions**: Intelligent recommendations for better weather conditions
- **⚡ Blazing Fast Performance**: Multi-layer caching reduces API response times by 96%
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **🔐 Secure Authentication**: JWT-based user authentication and authorization

## 📊 Performance Achievements

### ⚡ Response Time Comparison
| Cache Type | Response Time | Improvement |
|------------|---------------|-------------|
| **API Call (No Cache)** | ~400ms | Baseline |
| **Database Cache** | ~50ms | 87.5% faster |
| **Memory Cache** | ~15ms | 96% faster |

### 📈 Efficiency Gains
- **API Calls Reduced**: 87% decrease through smart caching
- **Cost Savings**: Significant reduction in API usage costs
- **Scalability**: Handles high traffic with consistent performance

### 🖼️ Performance Proof

**Result from API call - 402ms**  
<img width="400" alt="API Call - 402ms" src="https://github.com/user-attachments/assets/99340bfe-d87a-46ad-a68c-922e1109373d" />

**Result from DB cache - 54ms**  
<img width="400" alt="DB Cache - 54ms" src="https://github.com/user-attachments/assets/8565d291-50c1-460c-8988-f5af2e7c1256" />

**Result from in memory cache - 15ms**  
<img width="400" alt="Memory Cache - 15ms" src="https://github.com/user-attachments/assets/0c03f6fa-69b0-43c8-b28a-b383ac30a11c" />

## ⚡ Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- OpenWeatherMap API key

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/Vishalv702/smart-event-planner.git
   cd smart-event-planner

   

Setup Backend - Follow server/README.md

Setup Frontend - Follow client/README.md


## 🛠️ Tech Stack
Frontend: React, JavaScript (ES6+), HTML5, CSS3, Bootstrap

Backend: Node.js, Express.js, MongoDB, Mongoose, JWT

APIs: OpenWeatherMap API

Deployment: Netlify (Frontend), Render (Backend), MongoDB Atlas

Tools: Git, GitHub, Postman, VS Code

## 👨‍💻 Author
Vishal Vasu    
📧 Email: vishalvasu710@gmail.com


## ⭐ If you find this project useful, please give it a star on GitHub!
