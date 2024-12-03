const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config(); // For environment variables

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Routes
app.get('/applications', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM applications');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/applications', async (req, res) => {
  const { title, company, app_date, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO applications (title, company, app_date, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, company, app_date, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update application status
app.put('/applications', async (req, res) => {
  const { id, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
