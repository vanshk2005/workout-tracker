const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const Workout = require("./models/Workout");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// OpenAI Setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Log Workout Route
app.post("/log", async (req, res) => {
  try {
    const { userId, lift, weight, reps, rpe, notes } = req.body;

    if (!userId || !lift || !weight || !reps || !rpe) {
      return res.status(400).json({ error: "Missing required workout fields." });
    }

    const newLog = await Workout.create({ userId, lift, weight, reps, rpe, notes });

    const previousLogs = await Workout.find({ userId, lift })
      .sort({ createdAt: -1 })
      .limit(2);

    const prev = previousLogs.length > 1 ? previousLogs[1] : null;

    const prompt = `
Compare the following two workout sessions for a lifter doing **${lift}**.

Previous: ${prev ? `${prev.weight}kg x ${prev.reps} reps @ RPE ${prev.rpe}` : "N/A"}
Current: ${weight}kg x ${reps} reps @ RPE ${rpe}.
Notes: ${notes || "None"}.

Provide:
1. Progress summary
2. Estimated 1RM based on current effort
3. Suggestions for improvement.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const feedback = completion.choices?.[0]?.message?.content || "No feedback generated.";

    res.status(200).json({ message: "Workout logged successfully", feedback });

  } catch (error) {
    console.error("❌ Error in /log:", error.message);

    if (error.response?.data) {
      console.error("OpenAI error response:", error.response.data);
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
