// api/sale.js
const { connectToDatabase } = require('../lib/mongo');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { user, saleAmount } = req.body;
    if (!user || !saleAmount) {
      res.status(400).json({ error: 'Missing user or saleAmount' });
      return;
    }
    const { db } = await connectToDatabase();
    const sale = {
      item: user,
      price: Number(saleAmount),
      quantity: 1,
      date: new Date()
    };
    const result = await db.collection('sales').insertOne(sale);
    res.status(200).json({ insertedId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};