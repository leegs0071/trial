// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const express = require('express');
const { Pool } = require('pg');
const connectionString = 'ep-snowy-king-089485-pooler.ap-southeast-1.postgres.vercel-storage.com';

// Create Express app
const app = express();

// Connect to PostgreSQL pool
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// Define your API routes as Serverless Functions
app.use(express.json());

app.post('/api/passwords', async (req, res) => {
  try {
    const { title, url, idinfo, pwinfo } = req.body;
    const client = await pool.connect();
    const query = 'INSERT INTO passwords (title, url, idinfo, pwinfo) VALUES ($1, $2, $3, $4)';
    const values = [title, url, idinfo, pwinfo];
    await client.query(query, values);
    res.sendStatus(201);
    client.release();
  } catch (error) {
    console.error('Failed to save password:', error);
    res.sendStatus(500);
  }
});

app.get('/api/passwords', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT id, title, url, idinfo, pwinfo, userinfo, updated_at FROM passwords');
    const passwords = result.rows;
    res.json(passwords);
    client.release();
  } catch (error) {
    console.error('Failed to get passwords:', error);
    res.sendStatus(500);
  }
});

// Handle other requests with Next.js
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  // Create HTTP server
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    // Handle API requests with Express app
    if (pathname.startsWith('/api')) {
      app(req, res);
    } else {
      // Handle other requests with Next.js
      handle(req, res, parsedUrl);
    }
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
