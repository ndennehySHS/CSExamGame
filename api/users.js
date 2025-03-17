// api/users.js
const { connectToDatabase } = require('../lib/mongo');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const { db } = await connectToDatabase();
    const users = await db.collection('sales').distinct("item");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};