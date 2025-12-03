const express = require('express');
const router = express.Router();
const pool = require('../db'); 

// Obtener todos los viajes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM viajes ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener viajes:', err);
    res.status(500).json({ error: 'Error al obtener viajes' });
  }
});

module.exports = router;
