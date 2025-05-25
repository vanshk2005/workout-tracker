import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [data, setData] = useState({ userId: "vansh", lift: "squat", weight: "", reps: "", rpe: "", notes: "" });
  const [feedback, setFeedback] = useState("");

  const handleChange = e => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/log", data);
    setFeedback(res.data.feedback);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Workout AI Tracker</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-md">
        <input name="lift" placeholder="Lift (squat, bench...)" className="p-2 rounded text-black" onChange={handleChange} />
        <input name="weight" placeholder="Weight (kg)" className="p-2 rounded text-black" onChange={handleChange} />
        <input name="reps" placeholder="Reps" className="p-2 rounded text-black" onChange={handleChange} />
        <input name="rpe" placeholder="RPE" className="p-2 rounded text-black" onChange={handleChange} />
        <input name="notes" placeholder="Notes (pain, grip, etc)" className="p-2 rounded text-black" onChange={handleChange} />
        <button className="bg-blue-600 py-2 rounded">Submit</button>
      </form>
      {feedback && <div className="mt-6 p-4 bg-gray-800 rounded"><h2 className="text-xl mb-2">AI Feedback:</h2><p>{feedback}</p></div>}
    </div>
  );
}