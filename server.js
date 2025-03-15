const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
const { mongoUrl } = require('./config');  // Import the mongoUrl from config.js

const app = express();
const port = process.env.PORT || 3000;
const dbName = 'mongodbVSCodePlaygroundDB';
let db;

// Connect to MongoDB
MongoClient.connect(mongoUrl)
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Parse JSON bodies
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get aggregated sales (grouped by user/item) sorted from largest to smallest total sale amount
app.get('/sales', async (req, res) => {
  try {
    const sales = await db.collection('sales').aggregate([
      {
        $group: {
          _id: "$item",
          totalSaleAmount: { $sum: { $multiply: ["$price", "$quantity"] } }
        }
      },
      {
        $sort: { totalSaleAmount: -1 } // Sort descending: largest totals first
      }
    ]).toArray();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get the list of distinct users (items)
app.get('/users', async (req, res) => {
  try {
    const users = await db.collection('sales').distinct("item");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to add a new sale
// Expects JSON: { user: "username", saleAmount: number }
app.post('/sale', async (req, res) => {
  try {
    const { user, saleAmount } = req.body;
    if (!user || !saleAmount) {
      return res.status(400).json({ error: 'Missing user or saleAmount' });
    }
    // For simplicity, treat saleAmount as the price with a quantity of 1.
    const sale = {
      item: user,
      price: Number(saleAmount),
      quantity: 1,
      date: new Date()
    };
    const result = await db.collection('sales').insertOne(sale);
    res.json({ insertedId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});