// src/components/EventForm/EventForm.jsx
import React from "react";
import "./EventForm.css";

const EventForm = ({ formData, onChange, onSubmit, submitText }) => {
  return (
    <form className="event-form glass-white" onSubmit={onSubmit}>
      <input
        className="input-theme"
        name="name"
        placeholder="Event Name"
        value={formData.name}
        onChange={onChange}
        required
      />
      <input
        className="input-theme"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={onChange}
        required
      />
      <input
        className="input-theme"
        name="date"
        type="date"
        value={formData.date ? formData.date.split("T")[0] : ""}
        onChange={onChange}
        required
      />
      <select
        className="input-theme"
        name="event_type"
        value={formData.event_type}
        onChange={onChange}
        required
      >
        <option value="">-- Select Event Type --</option>
        <option value="cricket">Cricket</option>
        <option value="wedding">Wedding</option>
        <option value="hiking">Hiking</option>
        <option value="corporate_outing">Corporate Outing</option>
        <option value="other">Other</option>
      </select>

      {formData.event_type === "other" && (
        <input
          className="input-theme"
          type="text"
          name="custom_event_type"
          placeholder="Enter event type"
          value={formData.custom_event_type || ""}
          onChange={onChange}
          required
        />
      )}

      <textarea
        className="input-theme"
        name="description"
        placeholder="Description (optional)"
        value={formData.description || ""}
        onChange={onChange}
        style={{ minHeight: "120px", resize: "vertical" }}
      />

      <button className="btn-theme-primary" type="submit">
        {submitText}
      </button>
    </form>
  );
};

export default EventForm;
