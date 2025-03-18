// server.js
const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
const config = require('./config');

const app = express();
const port = config.port;
let db;

// Connect to MongoDB using the connection string from config.js and select the database.
MongoClient.connect(config.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(client => {
    console.log('Connected to MongoDB');
    // Note: We assume your database name is provided in DB_NAME.
    db = client.db(config.dbName);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// GET /scores – Returns aggregated scores for each student (highest to lowest)
app.get('/scores', async (req, res) => {
  try {
    const scores = await db.collection('CSExamGame-UserScoreBoard').aggregate([
      {
        $group: {
          _id: "$studentName",
          totalScore: { $sum: "$score" }
        }
      },
      {
        $sort: { totalScore: -1 }
      }
    ]).toArray();
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /students – Returns a list of distinct student names
app.get('/students', async (req, res) => {
  try {
    const students = await db.collection('CSExamGame-UserScoreBoard').distinct("studentName");
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /score – Adds a new score entry
// Expects a JSON body: { studentName, score, scoreSource }
app.post('/score', async (req, res) => {
  try {
    const { studentName, score, scoreSource } = req.body;
    if (!studentName || score == null || !scoreSource) {
      return res.status(400).json({ error: 'Missing studentName, score, or scoreSource' });
    }
    const newScore = {
      studentName,
      score: Number(score),
      scoreSource,
      class: "Unknown", // For new score entries, we default to "Unknown"
      timetable: new Date().toISOString()
    };
    const result = await db.collection('CSExamGame-UserScoreBoard').insertOne(newScore);
    res.json({ insertedId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});