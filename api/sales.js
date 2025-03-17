// api/sales.js
const { connectToDatabase } = require('../lib/mongo');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const { db } = await connectToDatabase();
    const sales = await db.collection('sales').aggregate([
      {
        $group: {
          _id: "$item",
          totalSaleAmount: { $sum: { $multiply: ["$price", "$quantity"] } }
        }
      },
      {
        $sort: { totalSaleAmount: -1 } // descending order: largest totals first
      }
    ]).toArray();

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};