// ─────────────────────────────────────────────────────────────────────────────
// eventConstants.js  —  v2
//
// Schema per event type:
//   ideal_temp        [min°C, max°C]
//   max_wind          km/h
//   max_precipitation mm
//   min_visibility    km
//   weights           how much each factor matters for THIS event (must sum to 1)
//   indoor            true → skip weather score entirely, show "Weather: Not applicable"
//   icon              emoji shown in the picker UI
//   description       one-liner shown as picker subtitle
// ─────────────────────────────────────────────────────────────────────────────

export const EVENT_REQUIREMENTS = {

  // ── SPORTS ────────────────────────────────────────────────────────────────

  cricket: {
    ideal_temp: [18, 35],
    max_wind: 28,
    max_precipitation: 0,       // rain = immediate stop
    min_visibility: 5,
    weights: { temp: 0.20, wind: 0.20, precipitation: 0.45, visibility: 0.15 },
    indoor: false,
    icon: "🏏",
    description: "Outdoor match or practice session"
  },

  football: {
    ideal_temp: [10, 28],
    max_wind: 35,
    max_precipitation: 3,
    min_visibility: 3,
    weights: { temp: 0.25, wind: 0.25, precipitation: 0.35, visibility: 0.15 },
    indoor: false,
    icon: "⚽",
    description: "Outdoor football / soccer match"
  },

  marathon: {
    ideal_temp: [8, 20],        // runners overheat easily
    max_wind: 25,
    max_precipitation: 1,
    min_visibility: 3,
    weights: { temp: 0.40, wind: 0.20, precipitation: 0.25, visibility: 0.15 },
    indoor: false,
    icon: "🏃",
    description: "Road race or fun run"
  },

  tennis: {
    ideal_temp: [15, 30],
    max_wind: 20,               // wind distorts ball trajectory
    max_precipitation: 0,
    min_visibility: 3,
    weights: { temp: 0.20, wind: 0.35, precipitation: 0.35, visibility: 0.10 },
    indoor: false,
    icon: "🎾",
    description: "Outdoor court match"
  },

  badminton: {
    ideal_temp: [15, 32],
    max_wind: 5,                // shuttlecock is extremely wind-sensitive
    max_precipitation: 0,
    min_visibility: 3,
    weights: { temp: 0.15, wind: 0.55, precipitation: 0.25, visibility: 0.05 },
    indoor: false,
    icon: "🏸",
    description: "Outdoor badminton (indoor unaffected by weather)"
  },

  volleyball: {
    ideal_temp: [18, 33],
    max_wind: 25,
    max_precipitation: 0,
    min_visibility: 3,
    weights: { temp: 0.20, wind: 0.30, precipitation: 0.40, visibility: 0.10 },
    indoor: false,
    icon: "🏐",
    description: "Beach or outdoor court"
  },

  swimming: {
    ideal_temp: [22, 38],
    max_wind: 30,
    max_precipitation: 2,
    min_visibility: 2,
    weights: { temp: 0.50, wind: 0.15, precipitation: 0.25, visibility: 0.10 },
    indoor: false,
    icon: "🏊",
    description: "Outdoor pool or open-water event"
  },

  cycling: {
    ideal_temp: [10, 28],
    max_wind: 30,
    max_precipitation: 1,
    min_visibility: 5,
    weights: { temp: 0.20, wind: 0.30, precipitation: 0.25, visibility: 0.25 },
    indoor: false,
    icon: "🚴",
    description: "Road or trail cycling event"
  },

  // ── SOCIAL & CELEBRATIONS ─────────────────────────────────────────────────

  wedding_outdoor: {
    ideal_temp: [18, 30],
    max_wind: 20,
    max_precipitation: 0,
    min_visibility: 5,
    weights: { temp: 0.25, wind: 0.20, precipitation: 0.40, visibility: 0.15 },
    indoor: false,
    icon: "💒",
    description: "Garden / lawn / rooftop ceremony"
  },

  wedding_indoor: {
    ideal_temp: [0, 45],
    max_wind: 999,
    max_precipitation: 999,
    min_visibility: 0,
    weights: { temp: 0.25, wind: 0.25, precipitation: 0.25, visibility: 0.25 },
    indoor: true,
    icon: "🏛️",
    description: "Banquet hall / hotel ballroom"
  },

  haldi_mehendi: {
    ideal_temp: [20, 36],
    max_wind: 15,               // strong wind ruins mehendi patterns
    max_precipitation: 0,
    min_visibility: 3,
    weights: { temp: 0.25, wind: 0.35, precipitation: 0.30, visibility: 0.10 },
    indoor: false,
    icon: "🌿",
    description: "Pre-wedding haldi / mehendi ceremony"
  },

  birthday_party: {
    ideal_temp: [15, 35],
    max_wind: 30,
    max_precipitation: 2,
    min_visibility: 2,
    weights: { temp: 0.25, wind: 0.20, precipitation: 0.35, visibility: 0.20 },
    indoor: false,
    icon: "🎂",
    description: "Outdoor birthday celebration"
  },

  graduation: {
    ideal_temp: [18, 32],
    max_wind: 20,
    max_precipitation: 1,
    min_visibility: 3,
    weights: { temp: 0.25, wind: 0.20, precipitation: 0.35, visibility: 0.20 },
    indoor: false,
    icon: "🎓",
    description: "Convocation or outdoor ceremony"
  },

  bbq_party: {
    ideal_temp: [20, 35],
    max_wind: 25,               // wind affects fire/grill
    max_precipitation: 0,
    min_visibility: 3,
    weights: { temp: 0.30, wind: 0.30, precipitation: 0.35, visibility: 0.05 },
    indoor: false,
    icon: "🔥",
    description: "Outdoor barbecue or grill party"
  },

  fireworks_event: {
    ideal_temp: [0, 25],
    max_wind: 20,
    max_precipitation: 1,
    min_visibility: 5,          // visibility is critical to see fireworks
    weights: { temp: 0.10, wind: 0.25, precipitation: 0.25, visibility: 0.40 },
    indoor: false,
    icon: "🎆",
    description: "Diwali, New Year, or celebration fireworks"
  },

  college_fest: {
    ideal_temp: [18, 35],
    max_wind: 30,
    max_precipitation: 2,
    min_visibility: 2,
    weights: { temp: 0.25, wind: 0.20, precipitation: 0.35, visibility: 0.20 },
    indoor: false,
    icon: "🎪",
    description: "Annual college cultural festival"
  },

  outdoor_concert: {
    ideal_temp: [15, 32],
    max_wind: 20,
    max_precipitation: 0,
    min_visibility: 3,
    weights: { temp: 0.20, wind: 0.20, precipitation: 0.45, visibility: 0.15 },
    indoor: false,
    icon: "🎵",
    description: "Live music or DJ event outdoors"
  },

  photoshoot: {
    ideal_temp: [18, 32],
    max_wind: 15,
    max_precipitation: 0,
    min_visibility: 8,          // lighting / visibility is everything
    weights: { temp: 0.15, wind: 0.20, precipitation: 0.25, visibility: 0.40 },
    indoor: false,
    icon: "📸",
    description: "Outdoor photography session"
  },

  // ── OUTDOOR & ADVENTURE ───────────────────────────────────────────────────

  hiking: {
    ideal_temp: [10, 25],
    max_wind: 35,
    max_precipitation: 2,
    min_visibility: 5,
    weights: { temp: 0.25, wind: 0.20, precipitation: 0.30, visibility: 0.25 },
    indoor: false,
    icon: "🥾",
    description: "Day hike or trail walk"
  },

  night_trek: {
    ideal_temp: [8, 22],
    max_wind: 30,
    max_precipitation: 0,
    min_visibility: 8,          // critical at night
    weights: { temp: 0.20, wind: 0.15, precipitation: 0.25, visibility: 0.40 },
    indoor: false,
    icon: "🌙",
    description: "Overnight or moonlight trek"
  },

  camping: {
    ideal_temp: [10, 28],
    max_wind: 30,
    max_precipitation: 3,
    min_visibility: 3,
    weights: { temp: 0.30, wind: 0.20, precipitation: 0.35, visibility: 0.15 },
    indoor: false,
    icon: "⛺",
    description: "Overnight camping trip"
  },

  mountain_biking: {
    ideal_temp: [10, 28],
    max_wind: 30,
    max_precipitation: 0,
    min_visibility: 5,
    weights: { temp: 0.20, wind: 0.25, precipitation: 0.35, visibility: 0.20 },
    indoor: false,
    icon: "🚵",
    description: "Off-road or trail biking"
  },

  nature_tour: {
    ideal_temp: [8, 30],
    max_wind: 40,
    max_precipitation: 1,
    min_visibility: 8,
    weights: { temp: 0.20, wind: 0.15, precipitation: 0.25, visibility: 0.40 },
    indoor: false,
    icon: "🌿",
    description: "Wildlife safari or nature walk"
  },

  beach_event: {
    ideal_temp: [25, 38],
    max_wind: 35,
    max_precipitation: 0,
    min_visibility: 3,
    weights: { temp: 0.35, wind: 0.25, precipitation: 0.30, visibility: 0.10 },
    indoor: false,
    icon: "🏖️",
    description: "Beach party, volleyball, or sunset event"
  },

  fishing: {
    ideal_temp: [10, 30],
    max_wind: 25,
    max_precipitation: 3,
    min_visibility: 2,
    weights: { temp: 0.25, wind: 0.30, precipitation: 0.25, visibility: 0.20 },
    indoor: false,
    icon: "🎣",
    description: "Recreational or competitive fishing"
  },

  paragliding: {
    ideal_temp: [10, 30],
    max_wind: 20,
    max_precipitation: 0,
    min_visibility: 10,
    weights: { temp: 0.15, wind: 0.35, precipitation: 0.20, visibility: 0.30 },
    indoor: false,
    icon: "🪂",
    description: "Tandem or solo paragliding"
  },

  water_sports: {
    ideal_temp: [20, 38],
    max_wind: 25,
    max_precipitation: 2,
    min_visibility: 3,
    weights: { temp: 0.30, wind: 0.30, precipitation: 0.25, visibility: 0.15 },
    indoor: false,
    icon: "🏄",
    description: "Kayaking, rafting, jet-ski, etc."
  },

  kite_festival: {
    // Unique: wind is a POSITIVE here — handled specially in suitabilityService
    ideal_temp: [15, 32],
    max_wind: 999,              // more wind = better; no upper cap
    max_precipitation: 0,
    min_visibility: 5,
    weights: { temp: 0.20, wind: 0.10, precipitation: 0.40, visibility: 0.30 },
    indoor: false,
    icon: "🪁",
    description: "Uttarayan / Makar Sankranti kite flying",
    wind_is_positive: true      // custom flag — suitabilityService should invert wind penalty
  },

  // ── PROFESSIONAL & ACADEMIC ───────────────────────────────────────────────

  corporate_outing: {
    ideal_temp: [18, 32],
    max_wind: 25,
    max_precipitation: 1,
    min_visibility: 3,
    weights: { temp: 0.25, wind: 0.20, precipitation: 0.35, visibility: 0.20 },
    indoor: false,
    icon: "🏢",
    description: "Team outing, offsite, or company picnic"
  },

  conference: {
    ideal_temp: [0, 45],
    max_wind: 999,
    max_precipitation: 999,
    min_visibility: 0,
    weights: { temp: 0.25, wind: 0.25, precipitation: 0.25, visibility: 0.25 },
    indoor: true,
    icon: "🎤",
    description: "Indoor conference or seminar"
  },

  exhibition: {
    ideal_temp: [15, 35],
    max_wind: 30,
    max_precipitation: 2,
    min_visibility: 3,
    weights: { temp: 0.20, wind: 0.20, precipitation: 0.35, visibility: 0.25 },
    indoor: false,
    icon: "🖼️",
    description: "Outdoor trade show or art exhibition"
  },

  food_festival: {
    ideal_temp: [18, 32],
    max_wind: 25,
    max_precipitation: 0,
    min_visibility: 3,
    weights: { temp: 0.25, wind: 0.25, precipitation: 0.40, visibility: 0.10 },
    indoor: false,
    icon: "🍽️",
    description: "Street food or culinary festival"
  },

  hackathon: {
    ideal_temp: [0, 45],
    max_wind: 999,
    max_precipitation: 999,
    min_visibility: 0,
    weights: { temp: 0.25, wind: 0.25, precipitation: 0.25, visibility: 0.25 },
    indoor: true,
    icon: "💻",
    description: "Indoor coding or innovation event"
  },

  product_launch: {
    ideal_temp: [18, 30],
    max_wind: 20,
    max_precipitation: 0,
    min_visibility: 5,
    weights: { temp: 0.20, wind: 0.20, precipitation: 0.40, visibility: 0.20 },
    indoor: false,
    icon: "🚀",
    description: "Outdoor or rooftop product launch event"
  },

  // ── CULTURAL & RELIGIOUS ──────────────────────────────────────────────────

  religious_procession: {
    ideal_temp: [10, 38],
    max_wind: 40,
    max_precipitation: 3,
    min_visibility: 2,
    weights: { temp: 0.20, wind: 0.20, precipitation: 0.35, visibility: 0.25 },
    indoor: false,
    icon: "🙏",
    description: "Procession, yatra, or outdoor pooja"
  },

  pooja_ceremony: {
    ideal_temp: [15, 38],
    max_wind: 20,               // wind blows out diyas
    max_precipitation: 0,
    min_visibility: 3,
    weights: { temp: 0.20, wind: 0.35, precipitation: 0.35, visibility: 0.10 },
    indoor: false,
    icon: "🪔",
    description: "Outdoor pooja, havan, or religious ceremony"
  },

  garba_dandiya: {
    ideal_temp: [18, 32],
    max_wind: 25,
    max_precipitation: 0,
    min_visibility: 3,
    weights: { temp: 0.25, wind: 0.20, precipitation: 0.40, visibility: 0.15 },
    indoor: false,
    icon: "🎊",
    description: "Navratri garba or dandiya raas event"
  },

  carnival: {
    ideal_temp: [18, 35],
    max_wind: 30,
    max_precipitation: 2,
    min_visibility: 3,
    weights: { temp: 0.25, wind: 0.20, precipitation: 0.35, visibility: 0.20 },
    indoor: false,
    icon: "🎡",
    description: "Fair, carnival, or mela"
  },

  outdoor_screening: {
    ideal_temp: [15, 30],
    max_wind: 20,
    max_precipitation: 0,
    min_visibility: 3,
    weights: { temp: 0.20, wind: 0.20, precipitation: 0.40, visibility: 0.20 },
    indoor: false,
    icon: "🎬",
    description: "Open-air cinema or outdoor screening"
  },

  street_festival: {
    ideal_temp: [15, 33],
    max_wind: 25,
    max_precipitation: 0,
    min_visibility: 3,
    weights: { temp: 0.25, wind: 0.20, precipitation: 0.40, visibility: 0.15 },
    indoor: false,
    icon: "🎭",
    description: "Street fair, parade, or cultural festival"
  },

  stadium_event: {
    ideal_temp: [15, 35],
    max_wind: 40,
    max_precipitation: 3,
    min_visibility: 2,
    weights: { temp: 0.25, wind: 0.20, precipitation: 0.35, visibility: 0.20 },
    indoor: false,
    icon: "🏟️",
    description: "Large-scale stadium or arena event"
  },

  // ── FALLBACK ──────────────────────────────────────────────────────────────

  default: {
    ideal_temp: [15, 30],
    max_wind: 30,
    max_precipitation: 2,
    min_visibility: 3,
    weights: { temp: 0.25, wind: 0.25, precipitation: 0.25, visibility: 0.25 },
    indoor: false,
    icon: "📅",
    description: "General outdoor event"
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// SUITABILITY_RATINGS  — 5-level granular scale
// ─────────────────────────────────────────────────────────────────────────────

export const SUITABILITY_RATINGS = {
  EXCELLENT: { min: 85, label: "Excellent", color: "#22c55e" },
  GOOD:      { min: 70, label: "Good",      color: "#84cc16" },
  OKAY:      { min: 50, label: "Okay",      color: "#eab308" },
  POOR:      { min: 30, label: "Poor",      color: "#f97316" },
  CRITICAL:  { min: 0,  label: "Critical",  color: "#ef4444" }
};

// ─────────────────────────────────────────────────────────────────────────────
// EVENT_CATEGORIES  — drives the grouped picker in EventForm
// ─────────────────────────────────────────────────────────────────────────────

export const EVENT_CATEGORIES = [
  {
    id: "sports",
    label: "Sports",
    icon: "🏅",
    events: [
      "cricket", "football", "marathon", "tennis",
      "badminton", "volleyball", "swimming", "cycling"
    ]
  },
  {
    id: "social",
    label: "Social & Celebrations",
    icon: "🎉",
    events: [
      "wedding_outdoor", "wedding_indoor", "haldi_mehendi",
      "birthday_party", "graduation", "bbq_party",
      "fireworks_event", "college_fest", "outdoor_concert", "photoshoot"
    ]
  },
  {
    id: "adventure",
    label: "Outdoor & Adventure",
    icon: "🏕️",
    events: [
      "hiking", "night_trek", "camping", "mountain_biking",
      "nature_tour", "beach_event", "fishing",
      "paragliding", "water_sports", "kite_festival"
    ]
  },
  {
    id: "professional",
    label: "Professional",
    icon: "💼",
    events: [
      "corporate_outing", "conference", "exhibition",
      "food_festival", "hackathon", "product_launch"
    ]
  },
  {
    id: "cultural",
    label: "Cultural & Religious",
    icon: "🎭",
    events: [
      "religious_procession", "pooja_ceremony", "garba_dandiya",
      "carnival", "outdoor_screening", "street_festival", "stadium_event"
    ]
  }
];