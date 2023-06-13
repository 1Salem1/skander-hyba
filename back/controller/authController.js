// authController.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');


router.delete('/users/:email', (req, res) => {
    const { token } = req.body;
    const { email } = req.params;
  
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
  
    try {
      const decoded = jwt.verify(token, 'your_secret_key');
      if (decoded.type !== 'ROLE_ADMIN') {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }
  
      // Perform the CRUD operations for users with ROLE_ADMIN
      // Example code for deleting a user
      User.deleteByEmail(email, (err, result) => {
        if (err) {
          if (err.message === 'User not found') {
            res.status(404).json({ error: 'User not found' });
          } else {
            res.status(500).json({ error: 'Internal Server Error' });
          }
          return;
        }
        res.json({ message: 'User deleted successfully' });
      });
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  });









router.get('/users', (req, res) => {
    const { token } = req.body;
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
  
    try {
      const decoded = jwt.verify(token, 'your_secret_key');
      if (decoded.type !== 'ADMIN_ROLE') {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }
  
      // Perform the CRUD operations for users with ROLE_ADMIN
      // Example code for GET users
      User.getAll((err, users) => {
        if (err) {
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        res.json(users);
      });
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  });
  
  router.post('/users', (req, res) => {
    const { token } = req.body;
    const { email, password, type } = req.body;
  
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
  
    try {
      const decoded = jwt.verify(token, 'your_secret_key');
      if (decoded.type !== 'ADMIN_ROLE') {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }
  
      // Perform the CRUD operations for users with ROLE_ADMIN
      // Example code for creating a new user
      const newUser = new User({ email, password, type });
      User.create(newUser, (err, createdUser) => {
        if (err) {
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        res.json(createdUser);
      });
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  });












router.post('/login', (req, res) => {
  const { email, password } = req.body;
  User.findByUsername(email, (err, user) => {
   
    if (!user) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }
    User.comparePasswords(password, user.password, (err, isMatch) => {

      if (!isMatch) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }
      const token = jwt.sign({ email: user.email , type : user.type }, 'your_secret_key');
      res.json({ token });
    });
  });
});

router.post('/register', (req, res) => {
    const { email, password } = req.body;
    User.findByUsername(email, (err, user) => {
      if (user) {
        res.status(400).json({ error: 'Username already exists' });
        return;
      }
      const newUser = new User({ email, password, type: 'ROLE_USER' }); // Add 'type' attribute with default value
      User.create(newUser, (err, createdUser) => {
        if (err) {
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        res.json({ message: 'User registered successfully' });
      });
    });
  });
  
  


  router.patch('/users/:email', (req, res) => {
    const { token } = req.body;
    const { email } = req.params;
    const { type } = req.body;
  
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
  
    try {
      const decoded = jwt.verify(token, 'your_secret_key');
      if (decoded.type !== 'ROLE_ADMIN') {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }
  
      // Perform the CRUD operations for users with ROLE_ADMIN
      // Example code for updating the user's type
      User.updateTypeByEmail(email, type, (err, result) => {
        if (err) {
          if (err.message === 'User not found') {
            res.status(404).json({ error: 'User not found' });
          } else {
            res.status(500).json({ error: 'Internal Server Error' });
          }
          return;
        }
        res.json({ message: 'User type updated successfully' });
      });
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  });














module.exports = router;
