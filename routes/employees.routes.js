const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

router.get('/employees', async (req, res) => {
  try {
    const employees = await req.db.collection('employees').find().toArray();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

router.get('/employees/random', async (req, res) => {
  try {
    const count = await req.db.collection('employees').countDocuments();
    if (count === 0) {
      return res.status(404).json({ message: 'Not found' });
    }
    const rand = Math.floor(Math.random() * count);
    const randomEmployee = await req.db.collection('employees').find().skip(rand).limit(1).toArray();
    res.json(randomEmployee[0]);
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

router.get('/employees/:id', async (req, res) => {
  try {
    const emp = await req.db.collection('employees').findOne({ _id: new ObjectId(req.params.id) });
    if (!emp) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json(emp);
    }
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

router.post('/employees', async (req, res) => {
  const { firstName, lastName, department } = req.body;
  try {
    await req.db.collection('employees').insertOne({ firstName, lastName, department });
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

router.put('/employees/:id', async (req, res) => {
  const { firstName, lastName, department } = req.body;
  try {
    const result = await req.db.collection('employees').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { firstName, lastName, department } }
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

router.delete('/employees/:id', async (req, res) => {
  try {
    const result = await req.db.collection('employees').deleteOne({ _id: new ObjectId(req.params.id) });
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
