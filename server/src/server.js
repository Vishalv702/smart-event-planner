import app from './app.js';
import connectDB from './config/database.js';
import mongoose from 'mongoose';

const PORT = process.env.PORT;
export const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const startServer = async () => {
  try {
    await connectDB(); 

    app.listen(PORT, () => {
      console.log(`🌤️  Smart Event Planner Backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('📦 MongoDB connection closed');
  process.exit(0);
});
