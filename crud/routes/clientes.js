const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../db/database');
const enviarCorreoConfirmacion = require('../utils/mail');
const router = express.Router();

// Crear cliente
router.post('/', async (req, res) => {
  try {
    const { rut, nombre, direccion, comuna, provincia, region, fecha_nacimiento, email, telefono, contraseña } = req.body;

    if (!rut || !nombre || !direccion || !comuna || !provincia || !region || !fecha_nacimiento || !email || !contraseña) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const hash = await bcrypt.hash(contraseña, 10);
    const sql = `INSERT INTO Cliente (rut, nombre, direccion, comuna, provincia, region, fecha_nacimiento, email, telefono, contraseña, verificado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`;

    db.run(sql, [rut, nombre, direccion, comuna, provincia, region, fecha_nacimiento, email, telefono, hash], function (err) {
      if (err) return res.status(500).json({ error: err.message });

      const token = Buffer.from(email).toString('base64url');
      enviarCorreoConfirmacion(email, token);

      res.status(201).json({ mensaje: 'Cliente creado. Revisa tu correo para confirmar la cuenta.' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Confirmar cuenta
router.get('/confirmar/:token', (req, res) => {
  const { token } = req.params;
  const email = Buffer.from(token, 'base64url').toString();

  db.run('UPDATE Cliente SET verificado = 1 WHERE email = ?', [email], function (err) {
    if (err) return res.status(500).send('Error al confirmar cuenta');
    if (this.changes === 0) return res.status(400).send('Cuenta ya confirmada o inexistente');
    res.send('Cuenta confirmada correctamente');
  });
});

// Obtener todos los clientes
router.get('/', (req, res) => {
  db.all(`SELECT rut, nombre, direccion, comuna, provincia, region, fecha_nacimiento, email, telefono, verificado FROM Cliente`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Obtener un cliente
router.get('/:rut', (req, res) => {
  db.get(`SELECT rut, nombre, direccion, comuna, provincia, region, fecha_nacimiento, email, telefono, verificado FROM Cliente WHERE rut = ?`, [req.params.rut], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(row);
  });
});

// Actualizar cliente
router.put('/:rut', async (req, res) => {
  const { nombre, direccion, comuna, provincia, region, fecha_nacimiento, email, telefono, contraseña } = req.body;

  try {
    let fields = [], values = [];

    if (nombre) { fields.push("nombre = ?"); values.push(nombre); }
    if (direccion) { fields.push("direccion = ?"); values.push(direccion); }
    if (comuna) { fields.push("comuna = ?"); values.push(comuna); }
    if (provincia) { fields.push("provincia = ?"); values.push(provincia); }
    if (region) { fields.push("region = ?"); values.push(region); }
    if (fecha_nacimiento) { fields.push("fecha_nacimiento = ?"); values.push(fecha_nacimiento); }
    if (email) { fields.push("email = ?"); values.push(email); }
    if (telefono) { fields.push("telefono = ?"); values.push(telefono); }
    if (contraseña) {
      const hash = await bcrypt.hash(contraseña, 10);
      fields.push("contraseña = ?"); values.push(hash);
    }

    if (fields.length === 0) return res.status(400).json({ error: 'No hay campos para actualizar' });

    values.push(req.params.rut);
    const sql = `UPDATE Cliente SET ${fields.join(', ')} WHERE rut = ?`;

    db.run(sql, values, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar cliente
router.delete('/:rut', (req, res) => {
  db.run(`DELETE FROM Cliente WHERE rut = ?`, [req.params.rut], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Login cliente
router.post('/login', (req, res) => {
  const { email, contraseña } = req.body;

  if (!email || !contraseña) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  const sql = 'SELECT * FROM Cliente WHERE email = ?';
  db.get(sql, [email], async (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    if (!row.verificado) {
      return res.status(403).json({ error: 'Cuenta no verificada. Revisa tu correo.' });
    }

    const match = await bcrypt.compare(contraseña, row.contraseña);
    if (match) {
      res.json({ 
        mensaje: 'Login exitoso', 
        nombre: row.nombre, 
        email: row.email,
        rut: row.rut,
        tipo: 'cliente'
      });
    } else {
      res.status(401).json({ error: 'Contraseña incorrecta' });
    }
  });
});

module.exports = router;