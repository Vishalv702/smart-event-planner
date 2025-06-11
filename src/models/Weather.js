import mongoose from 'mongoose';

const weatherSchema = new mongoose.Schema({
  location: { type: String, required: true },
  normalized_location: { type: String, required: true },
  date: { type: String, required: true },
  coordinates: {
    lat: Number,
    lon: Number,
    name: String,
    country: String
  },
  temperature: { type: Number, required: true },
  feels_like: { type: Number, required: true },
  humidity: { type: Number, required: true },
  pressure: { type: Number, required: true },
  weather_main: { type: String, required: true },
  weather_description: { type: String, required: true },
  wind_speed: { type: Number, required: true },
  wind_direction: { type: Number, default: 0 },
  precipitation: { type: Number, default: 0 },
  visibility: { type: Number, required: true },
  api_response: mongoose.Schema.Types.Mixed
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
      return ret;
    }
  }
});

// Compound index for unique weather record
weatherSchema.index({ normalized_location: 1, date: 1 }, { unique: true });

const Weather = mongoose.model('Weather', weatherSchema);
export default Weather;
