const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Crear cliente
router.post('/', (req, res) => {
  const { rut, nombre, direccion, comuna, provincia, region, fecha_nacimiento, email, telefono, contraseña } = req.body;
  const sql = `INSERT INTO Cliente (rut, nombre, direccion, comuna, provincia, region, fecha_nacimiento, email, telefono, contraseña) VALUES (?, ?, ?, ? , ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [rut, nombre, direccion, comuna, provincia, region, fecha_nacimiento, email, telefono, contraseña], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Obtener todos los clientes
router.get('/', (req, res) => {
  db.all(`SELECT * FROM Cliente`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Obtener un cliente
router.get('/:rut', (req, res) => {
  db.get(`SELECT * FROM Cliente WHERE rut = ?`, [req.params.rut], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(row);
  });
});

// Actualizar cliente
router.put('/:rut', (req, res) => {
  const { rut, nombre, direccion, comuna, provincia, region, fecha_nacimiento, email, telefono, contraseña } = req.body;
  const sql = `UPDATE Cliente SET nombre = ?, direccion = ? , comuna = ?, provincia = ?, region = ?, fecha_nacimiento = ?, email = ?, telefono = ?, contraseña = ? WHERE rut = ?`;
  db.run(sql, [nombre, direccion, req.params.rut], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

// Eliminar cliente
router.delete('/:rut', (req, res) => {
  db.run(`DELETE FROM Cliente WHERE rut = ?`, [req.params.rut], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
