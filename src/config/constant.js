export const EVENT_REQUIREMENTS = {
  cricket: {
    ideal_temp: [20, 30],
    max_wind: 15,
    max_precipitation: 0.1,
    min_visibility: 8
  },
  wedding: {
    ideal_temp: [18, 28],
    max_wind: 20,
    max_precipitation: 0,
    min_visibility: 5
  },
  hiking: {
    ideal_temp: [15, 25],
    max_wind: 25,
    max_precipitation: 2,
    min_visibility: 3
  },
  corporate_outing: {
    ideal_temp: [20, 30],
    max_wind: 20,
    max_precipitation: 0.5,
    min_visibility: 5
  },
  default: {
    ideal_temp: [18, 28],
    max_wind: 20,
    max_precipitation: 1,
    min_visibility: 5
  }
};

export const SUITABILITY_RATINGS = {
  GOOD: { min: 80, label: 'Good' },
  OKAY: { min: 60, label: 'Okay' },
  POOR: { min: 0, label: 'Poor' }
};
