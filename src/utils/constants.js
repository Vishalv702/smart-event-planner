export const EVENT_REQUIREMENTS = {
  default: {
    ideal_temp: [15, 30], // in °C
    max_wind: 8,           // in m/s
    max_precipitation: 0.2, // in mm
    min_visibility: 4       // in km
  },
  concert: {
    ideal_temp: [18, 28],
    max_wind: 6,
    max_precipitation: 0.1,
    min_visibility: 5
  },
  sports: {
    ideal_temp: [10, 25],
    max_wind: 10,
    max_precipitation: 0.5,
    min_visibility: 3
  }

};
