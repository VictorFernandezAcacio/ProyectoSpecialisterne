const { Pool } = require('pg');

const pool = new Pool({
  host: 'pg-14bde8a4-fernandezacacio7-021c.h.aivencloud.com',
  port: 14685,
  user: 'avnadmin',
  password: 'AVNS_q7_CqtsRifaZMzS9BTn',
  database: 'Bug-Free_Travel',
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
