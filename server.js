//server.js

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.static('public'));
app.use(express.json());

// 비밀번호 저장 API
app.post('/api/passwords', async (req, res) => {
  const { title, url, id, password, user, updatedAt } = req.body;
  try {
    const client = await pool.connect();
    const query = 'INSERT INTO passwords (title, url, id, password, "user", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6)';
    const values = [title, url, id, password, user, updatedAt];
    await client.query(query, values);
    res.sendStatus(201);
    client.release();
  } catch (error) {
    console.error('Failed to save password:', error);
    res.sendStatus(500);
  }
});

// 저장된 비밀번호 조회 API
app.get('/api/passwords', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM passwords ORDER BY "updatedAt" DESC');
    const passwords = result.rows;
    res.json(passwords);
    client.release();
  } catch (error) {
    console.error('Failed to get passwords:', error);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
