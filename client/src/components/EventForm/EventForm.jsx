// src/components/EventForm/EventForm.jsx  —  v2
// Replaces the <select> with a searchable visual card picker.
// All other props (formData, onChange, onSubmit, submitText) are unchanged.

import React, { useState, useMemo, useRef, useEffect } from "react";
import { EVENT_REQUIREMENTS, EVENT_CATEGORIES } from "../../../../server/src/config/constant";
import "./EventForm.css";

// ─── EventTypePicker ──────────────────────────────────────────────────────────

function EventTypePicker({ value, onChange }) {
  const [open, setOpen]     = useState(false);
  const [query, setQuery]   = useState("");
  const [activeTab, setTab] = useState("all");
  const inputRef            = useRef(null);
  const panelRef            = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const allEvents = useMemo(() => {
    return Object.entries(EVENT_REQUIREMENTS)
      .filter(([key]) => key !== "default")
      .map(([key, req]) => ({
        key,
        icon:        req.icon        ?? "📅",
        label:       key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        description: req.description ?? "",
        indoor:      req.indoor      ?? false,
        category:    EVENT_CATEGORIES.find((c) => c.events.includes(key))?.id ?? "other",
      }));
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return allEvents.filter((e) => {
      const matchesSearch =
        !q ||
        e.label.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q);
      const matchesTab =
        activeTab === "all" || e.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [query, activeTab, allEvents]);

  const selected = allEvents.find((e) => e.key === value);

  function handleSelect(key) {
    onChange({ target: { name: "event_type", value: key } });
    setOpen(false);
    setQuery("");
  }

  return (
    <div className="etp-root" ref={panelRef}>
      <button
        type="button"
        className={`etp-trigger input-theme ${open ? "etp-trigger--open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected ? (
          <span className="etp-trigger__selected">
            <span className="etp-trigger__icon">{selected.icon}</span>
            <span className="etp-trigger__label">{selected.label}</span>
            {selected.indoor && (
              <span className="etp-badge etp-badge--indoor">Indoor</span>
            )}
          </span>
        ) : (
          <span className="etp-trigger__placeholder">-- Select Event Type --</span>
        )}
        <span className="etp-trigger__caret">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="etp-panel" role="listbox">
          <div className="etp-search-wrap">
            <span className="etp-search-icon">🔍</span>
            <input
              ref={inputRef}
              className="etp-search"
              placeholder="Search events…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setTab("all"); }}
            />
            {query && (
              <button type="button" className="etp-clear" onClick={() => setQuery("")}>✕</button>
            )}
          </div>

          {!query && (
            <div className="etp-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "all"}
                className={`etp-tab ${activeTab === "all" ? "etp-tab--active" : ""}`}
                onClick={() => setTab("all")}
              >
                All
              </button>
              {EVENT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === cat.id}
                  className={`etp-tab ${activeTab === cat.id ? "etp-tab--active" : ""}`}
                  onClick={() => setTab(cat.id)}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <p className="etp-empty">No events found for "{query}"</p>
          ) : (
            <div className="etp-grid">
              {filtered.map((e) => (
                <button
                  key={e.key}
                  type="button"
                  role="option"
                  aria-selected={value === e.key}
                  className={`etp-card ${value === e.key ? "etp-card--selected" : ""}`}
                  onClick={() => handleSelect(e.key)}
                >
                  <span className="etp-card__icon">{e.icon}</span>
                  <span className="etp-card__label">{e.label}</span>
                  <span className="etp-card__desc">{e.description}</span>
                  {e.indoor && (
                    <span className="etp-badge etp-badge--indoor">Indoor</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── EventForm ────────────────────────────────────────────────────────────────

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

      <EventTypePicker value={formData.event_type} onChange={onChange} />

      {/* Hidden input keeps HTML5 form validation working */}
      <input
        type="text"
        name="event_type"
        value={formData.event_type}
        onChange={() => {}}
        required
        style={{ display: "none" }}
        tabIndex={-1}
        aria-hidden="true"
      />

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