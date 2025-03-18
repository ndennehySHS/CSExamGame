// api/score.js
const { connectToDatabase } = require('../lib/mongo');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { studentName, score, scoreSource } = req.body;
    if (!studentName || score == null || !scoreSource) {
      res.status(400).json({ error: 'Missing studentName, score, or scoreSource' });
      return;
    }
    const newScore = {
      studentName,
      score: Number(score),
      scoreSource,
      class: "Unknown", // Default value; adjust as needed
      timetable: new Date().toISOString()
    };

    const { db } = await connectToDatabase();
    const result = await db.collection('CSExamGame-UserScoreBoard').insertOne(newScore);
    res.status(200).json({ insertedId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};