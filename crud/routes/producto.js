
const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Obtener todos los registros
router.get('/', (req, res) => {
  db.all('SELECT * FROM Producto', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Obtener un registro por ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM Producto WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(row);
  });
});

// Crear un nuevo registro
router.post('/', (req, res) => {
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);
  const placeholders = keys.map(() => '?').join(',');
  const query = `INSERT INTO Producto (${keys.join(',')}) VALUES (${placeholders})`;
  db.run(query, values, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});

// Actualizar un registro existente
router.put('/:id', (req, res) => {
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);
  const assignments = keys.map(k => `${k} = ?`).join(', ');
  const query = `UPDATE Producto SET ${assignments} WHERE id = ?`;
  db.run(query, [...values, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

// Eliminar un registro
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM Producto WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
