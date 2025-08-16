import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import EventForm from "../EventForm/EventForm";
import "./UpdateEventModel.css";

const UpdateEventModal = ({ show, onClose, eventData, onSave }) => {
  const [localForm, setLocalForm] = useState(eventData);

  // Sync modal form with incoming eventData when modal opens
  useEffect(() => {
    if (eventData) {
      setLocalForm(eventData);
    }
  }, [eventData]);

  if (!show) return null;

  const handleChange = (e) => {
    setLocalForm({ ...localForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  
  const finalData = {
    ...localForm,
    event_type:
      localForm.event_type === "other"
        ? localForm.custom_event_type
        : localForm.event_type,
  };

  onSave(finalData);
};

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>Update Event</h3>
        <EventForm
          formData={localForm}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitText="Save Changes"
        />
        <div className="modal-buttons">
          <button className="btn-theme-secondary" type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default UpdateEventModal;
