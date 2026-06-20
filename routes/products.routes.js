const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

router.get('/products', async (req, res) => {
  try {
    const products = await req.db.collection('products').find().toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

router.get('/products/random', async (req, res) => {
  try {
    const count = await req.db.collection('products').countDocuments();
    if (count === 0) {
      return res.status(404).json({ message: 'Not found' });
    }
    const rand = Math.floor(Math.random() * count);
    const randomProduct = await req.db.collection('products').find().skip(rand).limit(1).toArray();
    res.json(randomProduct[0]);
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const prod = await req.db.collection('products').findOne({ _id: new ObjectId(req.params.id) });
    if (!prod) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json(prod);
    }
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

router.post('/products', async (req, res) => {
  const { name, client } = req.body;
  try {
    await req.db.collection('products').insertOne({ name, client });
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

router.put('/products/:id', async (req, res) => {
  const { name, client } = req.body;
  try {
    const result = await req.db.collection('products').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, client } }
    );
    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json({ message: 'OK' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const result = await req.db.collection('products').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json({ message: 'OK' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

module.exports = router;
