const express = require('express');
const path = require('path');
const Musician = require('./models/musician');
const musicianRoutes = require('./routes/musician');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3001;

// Database configuration
const dbConfig = {
  host: process.env.RDS_HOSTNAME || 'your-rds-endpoint',
  user: process.env.RDS_USERNAME || 'your-username',
  password: process.env.RDS_PASSWORD || 'your-password',
  database: process.env.RDS_DB_NAME || 'your-database',
  port: process.env.RDS_PORT || 3306
};

// include routes
app.use('/musician', musicianRoutes);
app.use(express.static('public'));

// Index route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Initialize database and musician model
async function initializeApp() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const musician = new Musician(connection);
    app.locals.musician = musician;
    
    // start server
    const server = app.listen(port, () => {
      console.log("Server started on port " + port);
    });
    
    return server;
  } catch (error) {
    console.error('Failed to initialize app:', error);
    process.exit(1);
  }
}

initializeApp();

module.exports = app;