const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

router.get('/departments', async (req, res) => {
  try {
    const departments = await req.db.collection('departments').find().toArray();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

router.get('/departments/random', async (req, res) => {
  try {
    const count = await req.db.collection('departments').countDocuments();
    if (count === 0) {
      return res.status(404).json({ message: 'Not found' });
    }
    const rand = Math.floor(Math.random() * count);
    const randomDepartment = await req.db.collection('departments').find().skip(rand).limit(1).toArray();
    res.json(randomDepartment[0]);
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

router.get('/departments/:id', async (req, res) => {
  try {
    const dep = await req.db.collection('departments').findOne({ _id: new ObjectId(req.params.id) });
    if (!dep) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json(dep);
    }
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

router.post('/departments', async (req, res) => {
  const { name } = req.body;
  try {
    await req.db.collection('departments').insertOne({ name });
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

router.put('/departments/:id', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await req.db.collection('departments').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name } }
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

router.delete('/departments/:id', async (req, res) => {
  try {
    const result = await req.db.collection('departments').deleteOne({ _id: new ObjectId(req.params.id) });
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
