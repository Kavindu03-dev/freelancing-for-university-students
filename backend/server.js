import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import freelancerRoutes from './routes/student.js';
import freelancerOverviewRoutes from './routes/freelancer.js';
import serviceRoutes from './routes/services.js';

import resourceRoutes from './routes/resources.js';
import postRoutes from './routes/posts.js';
import verificationRoutes from './routes/verification.js';
import analyticsRoutes from './routes/analytics.js';
import orderRoutes from './routes/orders.js';
import jobApplicationRoutes from './routes/jobApplications.js';
import contactRoutes from './routes/contact.js';
import adminRoutes from './routes/admin.js';
import staffRoutes from './routes/staff.js';
import messageRoutes from './routes/messages.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

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
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/freelancer', freelancerRoutes);
app.use('/api/freelancer', freelancerOverviewRoutes);
app.use('/api/services', serviceRoutes);

app.use('/api/resources', resourceRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/job-applications', jobApplicationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/messages', messageRoutes);

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
