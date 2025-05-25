const mongoose = require("mongoose");
const WorkoutSchema = new mongoose.Schema({
  userId: String,
  lift: String,
  weight: Number,
  reps: Number,
  rpe: Number,
  notes: String
}, { timestamps: true });
module.exports = mongoose.model("Workout", WorkoutSchema);