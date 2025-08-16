// migration.js
import mongoose from "mongoose";
import Event from "./models/Event.js"; // adjust path

await mongoose.connect("mongodb+srv://vishalvasu710:DMC0BClosE1Tevq0@cluster0.1ndb9mn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const events = await Event.find({});

for (const e of events) {
  if (typeof e.date === "string" && !isNaN(Date.parse(e.date))) {
    e.date = new Date(e.date);
    await e.save();
  }
}

console.log("✅ Date migration completed");
mongoose.connection.close();
