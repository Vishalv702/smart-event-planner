// src/pages/EventPage.jsx
import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import Navbar from "../../components/Navbar/Navbar";
import EventCard from "../../components/EventCard/EventCard";
import UpdateEventModal from "../../components/UpdateEventModel/UpdateEventModel";
import EventForm from "../../components/EventForm/EventForm";
import "./Event.css";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    date: "",
    event_type: "",
    description: "",
    custom_event_type: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [showModal, setShowModal] = useState(false);
const [selectedEvent, setSelectedEvent] = useState(null);

  const limit = 6;
  const navigate = useNavigate();

  const fetchEvents = async (manual = false) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...(searchTerm && { search: searchTerm }),
      });

      // Only include date filters if manual fetch (Apply Filters clicked)
      if (manual && fromDate) params.append("fromDate", fromDate);
      if (manual && toDate) params.append("toDate", toDate);

      const res = await axios.get(`/events?${params.toString()}`);
      setEvents(res.data.events);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  // Auto-fetch when searchTerm or page changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchEvents();
    }, 400);

    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, page]);


  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalData = {
        ...formData,
        event_type:
          formData.event_type === "other"
            ? formData.custom_event_type
            : formData.event_type,
      };

      await axios.post("/events", finalData);
      setFormData({
        name: "",
        location: "",
        date: "",
        event_type: "",
        description: "",
        custom_event_type: "",
      });
      fetchEvents(true); // refresh list
    } catch (err) {
      console.error("Failed to create event:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/events/${id}`);
      fetchEvents(true);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleWeatherCheck = (id) => {
    navigate(`/events/${id}/details`);
  };

  const handleUpdate = (event) => {
  setSelectedEvent(event);
  setShowModal(true);
};

const handleSaveUpdate = async (updatedEvent) => {
  try {
    await axios.put(`/events/${selectedEvent._id}`, updatedEvent);
    fetchEvents();
    setShowModal(false);
    setSelectedEvent(null);
  } catch (err) {
    console.error("Update failed:", err);
  }
};

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  return (
    <>
      <Navbar />
      <div className="event-page">
        <h2>Events</h2>

        {/* Filter Section */}
        <div className="event-filters glass-white">
          <input
            className="input-theme"
            type="text"
            placeholder="Search by name or location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <input
            className="date"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <input
            className="date"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          <button
            className="btn-theme-primary"
            onClick={() => {
              setPage(1);
              fetchEvents(true); // manual fetch with date filters
            }}
          >
            Apply Filters
          </button>
        </div>

        {/* Event Grid */}
        <div className="event-grid">
          {events.length === 0 ? (
            <div className="glass">
              <p>No events found.</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event._id} className="animate-fadeInUp">
                <EventCard
                  event={event}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  onCheckWeather={handleWeatherCheck}
                />
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls">
          <button
            className="btn-theme-secondary"
            onClick={handlePrevPage}
            disabled={page === 1}
          >
            ⬅️ Previous
          </button>
          <span className="glass" style={{ padding: "0.8rem 1.5rem" }}>
            Page {page} of {totalPages}
          </span>
          <button
            className="btn-theme-secondary"
            onClick={handleNextPage}
            disabled={page === totalPages}
          >
            Next ➡️
          </button>
        </div>

        {/* Add Event Form */}
        <EventForm
  formData={formData}
  onChange={handleInput}
  onSubmit={handleSubmit}
  submitText="Add Event"
/>
        <UpdateEventModal
  show={showModal}
  onClose={() => setShowModal(false)}
  eventData={selectedEvent || {}}
  onSave={handleSaveUpdate}
/>

      </div>
      <Footer />
    </>
  );
};

export default EventPage;
