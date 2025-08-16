import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axios";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EventDetails.css";

const EventDetails = () => {
  const { id } = useParams();
  const [alternateDates, setAlternateDates] = useState([]);
  const [showAlternates, setShowAlternates] = useState(false);

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.post(`/events/${id}/weather-check`);
        const eventData = res.data;
        console.log(eventData);
        setEventData(eventData);

        const today = new Date();
        const eventDate = new Date(eventData.event.date);
        const dayDiff = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

        const lastUpdated = eventData.weather?.last_updated
          ? new Date(eventData.weather.last_updated)
          : null;

        const outdatedWeather =
          !lastUpdated ||
          Math.ceil((today - lastUpdated) / (1000 * 60 * 60 * 24)) > 1;

        if (dayDiff > 5 && outdatedWeather) {
          toast.info(
            "Forecast data not available for events more than 5 days ahead. Please check back closer to the date.",
            {
              position: "top-center",
              autoClose: 5000,
            }
          );
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        toast.error("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const fetchAlternateDates = async () => {
    setShowAlternates(true);
    try {
      const res = await axios.get(`weather/event/${id}/alternatives`);
      console.log(res.data);
      setAlternateDates(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch alternate dates.");
      console.error("Alternate dates error:", err);
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "increasing":
        return "📈";
      case "decreasing":
        return "📉";
      case "stable":
        return "➡️";
      default:
        return "❓";
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case "increasing":
        return "#ff6b6b";
      case "decreasing":
        return "#4ecdc4";
      case "stable":
        return "#45b7d1";
      default:
        return "#666";
    }
  };

  const getTrendDescription = (type, trend) => {
    const descriptions = {
      temperature: {
        increasing: "Temperature is rising - expect warmer conditions",
        decreasing: "Temperature is dropping - expect cooler conditions",
        stable: "Temperature is remaining steady",
      },
      precipitation: {
        increasing: "Rain chances are increasing - Plan according to it",
        decreasing:
          "Rain chances are decreasing - outdoor conditions improving",
        stable: "Rain conditions are steady",
      },
      wind: {
        increasing: "Wind speed is picking up - may affect outdoor activities",
        decreasing:
          "Wind is calming down - better conditions for outdoor events",
        stable: "Wind conditions are consistent",
      },
    };
    return descriptions[type]?.[trend] || `${type} is ${trend}`;
  };

  const getRatingClass = (rating) => {
    switch (rating) {
      case "Good":
        return "rating-good";
      case "Moderate":
        return "rating-moderate";
      case "Poor":
        return "rating-poor";
      default:
        return "";
    }
  };

  const getRatingIcon = (rating) => {
    switch (rating) {
      case "Good":
        return "✅";
      case "Moderate":
        return "🤔";
      case "Poor":
        return "⚠️";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <div className="glass loading-theme loading-card">
            <p>Loading event details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!eventData) {
    return (
      <>
        <Navbar />
        <div className="error-container">
          <div className="glass error-card">
            <h3 className="error-title text-error">Event not found</h3>
            <p>
              The event you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const {
    event,
    historical_weather,
    weather,
    weather_trend,
    suitability,
    recommendation,
  } = eventData;

  const {
    recommendations,
    alternatives
  } = alternateDates;

  return (
    <>
      <Navbar />
      <div className="event-details-page">
        <div className="event-details-container">
          {/* Main Event Card */}
          <div className="card-theme animate-fadeInUp">
            <div className="event-header">
              <h1 className="event-title text-gradient-primary">
                {event.name}
              </h1>
              <div className="event-meta">
                <span className="event-meta-item glass">
                  📅{" "}
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="event-meta-item glass">
                  📍 {event.location}
                </span>
                <span className="event-meta-item glass">
                  🎯{" "}
                  {event.event_type
                    ? event.event_type
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Weather Information */}
            <div className="weather-section glass-white">
              <h3 className="section-title text-gradient-primary">
                🌦️ Weather Information
              </h3>
              {weather ? (
                <div className="weather-grid">
                  <div className="weather-item">
                    <span className="weather-item-label">Temperature</span>
                    <p className="weather-item-value">
                      🌡️ {weather.temperature}°C
                    </p>
                  </div>
                  <div className="weather-item">
                    <span className="weather-item-label">Condition</span>
                    <p className="weather-item-value">
                      ☁️ {weather.weather_description}
                    </p>
                  </div>
                  <div className="weather-item">
                    <span className="weather-item-label">Wind Speed</span>
                    <p className="weather-item-value">
                      💨 {weather.wind_speed} km/h
                    </p>
                  </div>
                  <div className="weather-item">
                    <span className="weather-item-label">Precipitation</span>
                    <p className="weather-item-value">
                      🌧️ {weather.precipitation || "0"} mm
                    </p>
                  </div>
                  <div className="weather-item">
                    <span className="weather-item-label">Visibility</span>
                    <p className="weather-item-value">
                      👁️ {weather.visibility} km
                    </p>
                  </div>
                </div>
              ) : (
                <div className="no-data-message glass">
                  <p>No weather data available yet.</p>
                </div>
              )}
            </div>

            {/* Enhanced Weather Trend Section */}
            {weather_trend && (
              <div className="weather-section glass-white">
                <h3 className="section-title text-gradient-primary">
                  📊 Weather Trend Analysis
                </h3>
                <div className="trend-analysis">
                  <div
                    className="trend-overview glass"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                      marginBottom: "20px",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <h4
                      style={{
                        color: "#333",
                        marginBottom: "10px",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      📈 Forecast Trends
                    </h4>
                    <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
                      Based on weather forecast data analysis
                    </p>
                  </div>

                  <div
                    className="trend-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(300px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    {/* Temperature Trend */}
                    <div
                      className="trend-item glass"
                      style={{
                        padding: "20px",
                        borderRadius: "12px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "12px",
                        }}
                      >
                        <span style={{ fontSize: "24px", marginRight: "10px" }}>
                          🌡️
                        </span>
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: "#333",
                          }}
                        >
                          Temperature
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "28px",
                            marginRight: "12px",
                            color: getTrendColor(weather_trend.temperature),
                          }}
                        >
                          {getTrendIcon(weather_trend.temperature)}
                        </span>
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: getTrendColor(weather_trend.temperature),
                            textTransform: "capitalize",
                          }}
                        >
                          {weather_trend.temperature}
                        </span>
                      </div>
                      <p
                        style={{
                          color: "#666",
                          fontSize: "14px",
                          margin: 0,
                          lineHeight: "1.4",
                        }}
                      >
                        {getTrendDescription(
                          "temperature",
                          weather_trend.temperature
                        )}
                      </p>
                    </div>

                    {/* Precipitation Trend */}
                    <div
                      className="trend-item glass"
                      style={{
                        padding: "20px",
                        borderRadius: "12px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "12px",
                        }}
                      >
                        <span style={{ fontSize: "24px", marginRight: "10px" }}>
                          🌧️
                        </span>
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: "#333",
                          }}
                        >
                          Precipitation
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "28px",
                            marginRight: "12px",
                            color: getTrendColor(weather_trend.precipitation),
                          }}
                        >
                          {getTrendIcon(weather_trend.precipitation)}
                        </span>
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: getTrendColor(weather_trend.precipitation),
                            textTransform: "capitalize",
                          }}
                        >
                          {weather_trend.precipitation}
                        </span>
                      </div>
                      <p
                        style={{
                          color: "#666",
                          fontSize: "14px",
                          margin: 0,
                          lineHeight: "1.4",
                        }}
                      >
                        {getTrendDescription(
                          "precipitation",
                          weather_trend.precipitation
                        )}
                      </p>
                    </div>

                    {/* Wind Trend */}
                    <div
                      className="trend-item glass"
                      style={{
                        padding: "20px",
                        borderRadius: "12px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "12px",
                        }}
                      >
                        <span style={{ fontSize: "24px", marginRight: "10px" }}>
                          💨
                        </span>
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: "#333",
                          }}
                        >
                          Wind Speed
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "28px",
                            marginRight: "12px",
                            color: getTrendColor(weather_trend.wind),
                          }}
                        >
                          {getTrendIcon(weather_trend.wind)}
                        </span>
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: getTrendColor(weather_trend.wind),
                            textTransform: "capitalize",
                          }}
                        >
                          {weather_trend.wind}
                        </span>
                      </div>
                      <p
                        style={{
                          color: "#666",
                          fontSize: "14px",
                          margin: 0,
                          lineHeight: "1.4",
                        }}
                      >
                        {getTrendDescription("wind", weather_trend.wind)}
                      </p>
                    </div>
                  </div>

                  {/* Trend Summary */}
                  <div
                    className="trend-summary glass"
                    style={{
                      marginTop: "20px",
                      padding: "15px",
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, rgba(69,183,209,0.1) 0%, rgba(69,183,209,0.05) 100%)",
                      border: "1px solid rgba(69,183,209,0.2)",
                    }}
                  >
                    <h4
                      style={{
                        color: "#45b7d1",
                        marginBottom: "8px",
                        fontSize: "16px",
                      }}
                    >
                      💡 Quick Summary
                    </h4>
                    <p
                      style={{
                        color: "#666",
                        fontSize: "14px",
                        margin: 0,
                        lineHeight: "1.4",
                      }}
                    >
                      Weather conditions are showing {weather_trend.temperature}{" "}
                      temperatures, {weather_trend.precipitation} precipitation,
                      and {weather_trend.wind} winds. Plan accordingly for your
                      event.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Historical Weather (if available) */}
            {historical_weather && historical_weather.length > 0 && (
              <div className="weather-section glass-white">
                <h3 className="section-title text-gradient-primary">
                  📈 Historical Weather Trends
                </h3>
                <div className="historical-weather">
                  {historical_weather.some((h) => !h.error) ? (
                    historical_weather.map((data, index) =>
                      data.error ? (
                        <div key={index} className="weather-item">
                          <span className="weather-item-label">
                            {new Date(data.date).toLocaleDateString()}
                          </span>
                          <p className="weather-item-value text-error">
                            ❌ {data.error}
                          </p>
                        </div>
                      ) : (
                        <div key={index} className="weather-item">
                          <span className="weather-item-label">
                            {new Date(data.date).toLocaleDateString()}
                          </span>
                          <p className="weather-item-value">
                            🌡️ {data.temperature}°C | ☁️ {data.condition}
                          </p>
                        </div>
                      )
                    )
                  ) : (
                    <div className="no-data-message glass">
                      <p>
                        No valid historical weather data available. It needs
                        subscription
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recommendation */}
            {recommendation && (
              <div className="recommendation-section glass-white">
                <h4 className="section-title text-gradient-primary">
                  💡 AI Recommendation
                </h4>
                <p className="recommendation-text">{recommendation}</p>
              </div>
            )}

            {/* Suitability Score */}
            <div className="suitability-section glass-white">
              <h3 className="section-title text-gradient-primary">
                📊 Event Suitability
              </h3>
              {suitability ? (
                <div>
                  <div className="suitability-header">
                    <div className="score-display glass">
                      <p className="score-number">{suitability.score}</p>
                      <p className="score-label">out of 100</p>
                    </div>
                    <div
                      className={`rating-display ${getRatingClass(
                        suitability.rating
                      )}`}
                    >
                      <span className="rating-text">{suitability.rating}</span>
                      <span className="rating-icon">
                        {getRatingIcon(suitability.rating)}
                      </span>
                    </div>
                  </div>

                  {suitability.rating != "Good" && (
                    <button
                      className="alternate-dates-btn"
                      onClick={fetchAlternateDates}
                    >
                      ⏳ Check Alternate Dates
                    </button>
                  )}
                  {showAlternates && (
                    <div className="alternate-dates-container glass">
                      <h4>{recommendations}</h4>
                      {alternatives?.length > 0 ? (
                        <ul>
                          {alternatives.map((data, index) => (
          <li key={index}>
            📅 {new Date(data.date).toLocaleDateString()} <span>{data.suitability.score}</span>
          </li>
        ))}
                        </ul>
                      ) : (
                        <p>No alternate dates available.</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-data-message glass">
                  <p>Suitability not calculated yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </>
  );
};

export default EventDetails;
