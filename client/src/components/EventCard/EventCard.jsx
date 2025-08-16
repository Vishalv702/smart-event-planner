import React from 'react';
import './EventCard.css';

const EventCard = ({ event, onUpdate, onDelete, onCheckWeather }) => {
  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "No date";
  return (
    <div className="event-card">
      <h3>{event.name}</h3>
      <p><strong>Date:</strong> {formattedDate}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Type:</strong> {event.event_type}</p>
      <div className="event-buttons">
        <button className="btn btn-primary" onClick={() => onUpdate(event)}>Update</button>
        <button className="btn btn-danger" onClick={() => onDelete(event._id)}>Delete</button>
        <button className="btn btn-info" onClick={() => onCheckWeather(event._id)}>Check Weather</button>
      </div>
    </div>
  );
};

export default EventCard;
