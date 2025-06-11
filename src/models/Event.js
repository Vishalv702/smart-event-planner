import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Event name is required'],
    trim: true,
    maxlength: [200, 'Event name cannot exceed 200 characters']
  },
  location: { 
    type: String, 
    required: [true, 'Location is required'],
    trim: true
  },
  date: { 
    type: String, 
    required: [true, 'Date is required'],
    validate: {
      validator: function (v) {
        return !isNaN(Date.parse(v));
      },
      message: 'Please provide a valid date'
    }
  },
  event_type: { 
    type: String, 
    required: [true, 'Event type is required'],
    enum: ['cricket', 'wedding', 'hiking', 'corporate_outing', 'other']
  },
  description: { 
    type: String, 
    default: '',
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  weather_data: {
    temperature: Number,
    feels_like: Number,
    humidity: Number,
    pressure: Number,
    weather_main: String,
    weather_description: String,
    wind_speed: Number,
    wind_direction: Number,
    precipitation: Number,
    visibility: Number,
    last_updated: Date
  },
  suitability: {
    score: Number,
    rating: String,
    factors: [String],
    last_calculated: Date
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
eventSchema.index({ location: 1, date: 1 });
eventSchema.index({ event_type: 1 });
eventSchema.index({ 'suitability.score': -1 });

const Event = mongoose.model('Event', eventSchema);
export default Event;
