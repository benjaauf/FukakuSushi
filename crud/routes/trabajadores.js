const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../db/database');
const enviarCorreoConfirmacion = require('../utils/mail');
const router = express.Router();

// Crear trabajador
router.post('/trabajadores', async (req, res) => {
  try {
    const { rut, nombre, fecha_nacimiento, email, telefono, contraseña, rol } = req.body;

    if (!rut || !nombre || !fecha_nacimiento || !email || !contraseña || !rol) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const hash = await bcrypt.hash(contraseña, 10);

    const sql = `
      INSERT INTO trabajador (rut, nombre, fecha_nacimiento, email, telefono, contraseña, rol, verificado)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `;

    db.run(sql, [rut, nombre, fecha_nacimiento, email, telefono, hash, rol], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const token = Buffer.from(email).toString('base64url');
      enviarCorreoConfirmacion(email, token);

      res.status(201).json({ mensaje: 'Trabajador creado correctamente. Revisa tu correo para confirmar la cuenta.' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Confirmar cuenta
router.get('/confirmar/:token', (req, res) => {
  const { token } = req.params;
  const email = Buffer.from(token, 'base64url').toString();

  db.run('UPDATE trabajador SET verificado = 1 WHERE email = ?', [email], function (err) {
    if (err) {
      return res.status(500).send('Error al confirmar cuenta');
    }
    if (this.changes === 0) {
      return res.status(400).send('Cuenta ya confirmada o inexistente');
    }
    res.send('Cuenta confirmada correctamente');
  });
});

// Obtener todos los trabajadores
router.get('/trabajadores', (req, res) => {
  db.all('SELECT rut, nombre, fecha_nacimiento, email, telefono, rol, verificado FROM trabajador', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Actualizar trabajador
router.put('/trabajadores/:rut', async (req, res) => {
  const { rut } = req.params;
  const { nombre, fecha_nacimiento, email, telefono, contraseña, rol } = req.body;

  try {
    let updateFields = [], values = [];

    if (nombre) { updateFields.push("nombre = ?"); values.push(nombre); }
    if (fecha_nacimiento) { updateFields.push("fecha_nacimiento = ?"); values.push(fecha_nacimiento); }
    if (email) { updateFields.push("email = ?"); values.push(email); }
    if (telefono) { updateFields.push("telefono = ?"); values.push(telefono); }
    if (contraseña) {
      const hash = await bcrypt.hash(contraseña, 10);
      updateFields.push("contraseña = ?"); values.push(hash);
    }
    if (rol) { updateFields.push("rol = ?"); values.push(rol); }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
    }

    values.push(rut);
    const sql = `UPDATE trabajador SET ${updateFields.join(', ')} WHERE rut = ?`;

    db.run(sql, values, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Trabajador no encontrado' });
      }
      res.json({ mensaje: 'Trabajador actualizado correctamente' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar trabajador
router.delete('/trabajadores/:rut', (req, res) => {
  const { rut } = req.params;

  db.run('DELETE FROM trabajador WHERE rut = ?', [rut], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Trabajador no encontrado' });
    }
    res.json({ mensaje: 'Trabajador eliminado correctamente' });
  });
});

// Login trabajador
router.post('/login', (req, res) => {
  const { email, contraseña } = req.body;

  if (!email || !contraseña) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  const sql = 'SELECT * FROM trabajador WHERE email = ?';
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
        rol: row.rol,
        rut: row.rut,
        tipo: 'trabajador'
      });
    } else {
      res.status(401).json({ error: 'Contraseña incorrecta' });
    }
  });
});

module.exports = router;

