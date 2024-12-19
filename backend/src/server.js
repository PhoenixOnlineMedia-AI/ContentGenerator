require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const { handleError } = require('./utils/errorHandler');
const setupSwagger = require('./config/swagger');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());

// Regular body parsing for other routes
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Import routes
const authRoutes = require('./routes/auth');
console.log('Auth routes loaded:', typeof authRoutes);

const contentRoutes = require('./routes/content');
console.log('Content routes loaded:', typeof contentRoutes);

const contentEnhancementRoutes = require('./routes/contentEnhancement');
console.log('Enhancement routes loaded:', typeof contentEnhancementRoutes);

const serpAnalysisRoutes = require('./routes/serpAnalysis');
console.log('SERP routes loaded:', typeof serpAnalysisRoutes);

const analyticsRoutes = require('./routes/analytics');
console.log('Analytics routes loaded:', typeof analyticsRoutes);

const apiKeyRoutes = require('./routes/apiKeys');
console.log('API Key routes loaded:', typeof apiKeyRoutes);

const subscriptionRoutes = require('./routes/subscription');
console.log('Subscription routes loaded:', typeof subscriptionRoutes);

const webhookRoutes = require('./routes/webhook');
console.log('Webhook routes loaded:', typeof webhookRoutes);

const teamRoutes = require('./routes/team');
console.log('Team routes loaded:', typeof teamRoutes);

// Try mounting routes one by one
try {
  app.use('/api/auth', authRoutes);
  console.log('Auth routes mounted');
  
  app.use('/api/content', contentRoutes);
  console.log('Content routes mounted');
  
  app.use('/api/enhance', contentEnhancementRoutes);
  console.log('Enhancement routes mounted');
  
  app.use('/api/serp', serpAnalysisRoutes);
  console.log('SERP routes mounted');
  
  app.use('/api/analytics', analyticsRoutes);
  console.log('Analytics routes mounted');
  
  app.use('/api/keys', apiKeyRoutes);
  console.log('API Key routes mounted');
  
  app.use('/api/subscription', subscriptionRoutes);
  console.log('Subscription routes mounted');
  
  app.use('/api/team', teamRoutes);
  console.log('Team routes mounted');
  
  // Special handling for Stripe webhooks
  app.post('/webhook/stripe', express.raw({type: 'application/json'}), webhookRoutes);
  console.log('Webhook routes mounted');
} catch (error) {
  console.error('Error mounting routes:', error);
}

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to AI Content Generator API' });
});

// Setup Swagger
setupSwagger(app);

// Handle undefined routes
app.all('*', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
});

// Error handling middleware
app.use(handleError);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

module.exports = app;
