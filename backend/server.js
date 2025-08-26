<<<<<<< Updated upstream
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
=======
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import freelancerRoutes from './routes/student.js';
import clientRoutes from './routes/client.js';
import serviceRoutes from './routes/services.js';
>>>>>>> Stashed changes

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Routes
<<<<<<< Updated upstream
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/student', require('./routes/student'));
app.use('/api/services', require('./routes/services'));
=======
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/freelancer', freelancerRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/services', serviceRoutes);
>>>>>>> Stashed changes

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Freelancing for University Students API' });
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
