const express = require('express');
const path = require('path');
const AWS = require('aws-sdk');
const Musician = require('./models/musician');
const musicianRoutes = require('./routes/musician');

const app = express();
const port = process.env.PORT || 3001;

// Configure AWS SDK (use environment variables or IAM roles in production)
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'YOUR_ACCESS_KEY',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET_KEY',
  region: process.env.AWS_REGION || 'YOUR_REGION'
});

// Include routes
app.use('/musician', musicianRoutes);

app.use(express.static('public'));

// Index route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Initialize musician model
const musician = new Musician();
app.locals.musician = musician;

// Optionally initialize the table on startup
musician.initStore()
  .then(() => console.log('Table initialized'))
  .catch(err => console.error('Error initializing table:', err));

// Start server
const server = app.listen(port, () => {
  console.log("Server started on port " + port);
});

module.exports = server;