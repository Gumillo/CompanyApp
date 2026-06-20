const express = require('express');
const router = express.Router();
const Employee = require('../models/employee.model');

// get all employees
router.get('/employees', async (req, res) => {
  try {
    res.json(await Employee.find().populate('department'));
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

// get random employee
router.get('/employees/random', async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    if (count === 0) {
      return res.status(404).json({ message: 'Not found' });
    }
    const rand = Math.floor(Math.random() * count);
    const emp = await Employee.findOne().skip(rand).populate('department');
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

// get employee by id
router.get('/employees/:id', async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id).populate('department');
    if (!emp) res.status(404).json({ message: 'Not found' });
    else res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

// add new employee
router.post('/employees', async (req, res) => {
  const { firstName, lastName, department } = req.body;
  try {
    const newEmployee = new Employee({ firstName, lastName, department });
    await newEmployee.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

// update employee
router.put('/employees/:id', async (req, res) => {
  const { firstName, lastName, department } = req.body;
  try {
    const emp = await Employee.findById(req.params.id);
    if (emp) {
      if (firstName) emp.firstName = firstName;
      if (lastName) emp.lastName = lastName;
      if (department) emp.department = department;
      await emp.save();
      res.json({ message: 'OK' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

// delete employee
router.delete('/employees/:id', async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (emp) {
      await Employee.deleteOne({ _id: req.params.id });
      res.json({ message: 'OK' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
});

module.exports = router;
