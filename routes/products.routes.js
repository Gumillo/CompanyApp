const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');

// get all products
router.get('/products', async (req, res) => {
  try {
    res.json(await Product.find());
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

// get random product
router.get('/products/random', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      return res.status(404).json({ message: 'Not found' });
    }
    const rand = Math.floor(Math.random() * count);
    const prod = await Product.findOne().skip(rand);
    res.json(prod);
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

// get product by id
router.get('/products/:id', async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) res.status(404).json({ message: 'Not found' });
    else res.json(prod);
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

// add new product
router.post('/products', async (req, res) => {
  const { name, client } = req.body;
  try {
    const newProduct = new Product({ name, client });
    await newProduct.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

// update product
router.put('/products/:id', async (req, res) => {
  const { name, client } = req.body;
  try {
    const prod = await Product.findById(req.params.id);
    if (prod) {
      if (name) prod.name = name;
      if (client) prod.client = client;
      await prod.save();
      res.json({ message: 'OK' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

// delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (prod) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'OK' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

module.exports = router;
