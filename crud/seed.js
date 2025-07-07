const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const db = new sqlite3.Database('./fukusuke.db');

async function seedDatabase() {
  console.log('🌱 Poblando base de datos...');

  // Crear tablas si no existen
  const createTables = `
    CREATE TABLE IF NOT EXISTS Cliente (
      rut TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      direccion TEXT,
      comuna TEXT,
      provincia TEXT,
      region TEXT,
      fecha_nacimiento TEXT,
      email TEXT UNIQUE NOT NULL,
      telefono TEXT,
      contraseña TEXT NOT NULL,
      verificado INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS trabajador (
      rut TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      fecha_nacimiento TEXT,
      email TEXT UNIQUE NOT NULL,
      telefono TEXT,
      contraseña TEXT NOT NULL,
      rol TEXT NOT NULL,
      verificado INTEGER DEFAULT 0
    );
  `;

  try {
    // Crear tablas
    await new Promise((resolve, reject) => {
      db.exec(createTables, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Hash de contraseñas
    const passwordHash = await bcrypt.hash('123456', 10);

    // Insertar clientes
    const clientes = [
      {
        rut: '12345678-9',
        nombre: 'Juan Pérez',
        direccion: 'Av. Providencia 123',
        comuna: 'Providencia',
        provincia: 'Santiago',
        region: 'Metropolitana',
        fecha_nacimiento: '1990-05-15',
        email: 'cliente1@test.com',
        telefono: '+56912345678',
        contraseña: passwordHash,
        verificado: 1
      },
      {
        rut: '23456789-0',
        nombre: 'María González',
        direccion: 'Calle Las Condes 456',
        comuna: 'Las Condes',
        provincia: 'Santiago',
        region: 'Metropolitana',
        fecha_nacimiento: '1985-08-22',
        email: 'cliente2@test.com',
        telefono: '+56923456789',
        contraseña: passwordHash,
        verificado: 1
      },
      {
        rut: '34567890-1',
        nombre: 'Carlos Rodríguez',
        direccion: 'Av. Vitacura 789',
        comuna: 'Vitacura',
        provincia: 'Santiago',
        region: 'Metropolitana',
        fecha_nacimiento: '1992-12-10',
        email: 'cliente3@test.com',
        telefono: '+56934567890',
        contraseña: passwordHash,
        verificado: 1
      }
    ];

    // Insertar trabajadores
    const trabajadores = [
      {
        rut: '11111111-1',
        nombre: 'Admin Principal',
        fecha_nacimiento: '1980-01-01',
        email: 'admin@fukusuke.com',
        telefono: '+56911111111',
        contraseña: passwordHash,
        rol: 'admin',
        verificado: 1
      },
      {
        rut: '22222222-2',
        nombre: 'Dueño Sushi',
        fecha_nacimiento: '1975-03-15',
        email: 'dueno@fukusuke.com',
        telefono: '+56922222222',
        contraseña: passwordHash,
        rol: 'dueno',
        verificado: 1
      },
      {
        rut: '33333333-3',
        nombre: 'Cajero Principal',
        fecha_nacimiento: '1990-06-20',
        email: 'cajero@fukusuke.com',
        telefono: '+56933333333',
        contraseña: passwordHash,
        rol: 'cajero',
        verificado: 1
      },
      {
        rut: '44444444-4',
        nombre: 'Chef Principal',
        fecha_nacimiento: '1985-04-25',
        email: 'chef@fukusuke.com',
        telefono: '+56944444444',
        contraseña: passwordHash,
        rol: 'chef',
        verificado: 1
      }
    ];

    // Insertar clientes
    for (const cliente of clientes) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR REPLACE INTO Cliente 
          (rut, nombre, direccion, comuna, provincia, region, fecha_nacimiento, email, telefono, contraseña, verificado)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          cliente.rut, cliente.nombre, cliente.direccion, cliente.comuna, 
          cliente.provincia, cliente.region, cliente.fecha_nacimiento, 
          cliente.email, cliente.telefono, cliente.contraseña, cliente.verificado
        ], function(err) {
          if (err) reject(err);
          else resolve();
        });
      });
      console.log(`✅ Cliente creado: ${cliente.email}`);
    }

    // Insertar trabajadores
    for (const trabajador of trabajadores) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR REPLACE INTO trabajador 
          (rut, nombre, fecha_nacimiento, email, telefono, contraseña, rol, verificado)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          trabajador.rut, trabajador.nombre, trabajador.fecha_nacimiento,
          trabajador.email, trabajador.telefono, trabajador.contraseña,
          trabajador.rol, trabajador.verificado
        ], function(err) {
          if (err) reject(err);
          else resolve();
        });
      });
      console.log(`✅ Trabajador creado: ${trabajador.email} (${trabajador.rol})`);
    }

    console.log('\n🎉 Base de datos poblada exitosamente!');
    console.log('\n📋 Credenciales de prueba:');
    console.log('\n👥 CLIENTES:');
    console.log('  • cliente1@test.com / 123456');
    console.log('  • cliente2@test.com / 123456');
    console.log('  • cliente3@test.com / 123456');
    console.log('\n👨‍💼 TRABAJADORES:');
    console.log('  • admin@fukusuke.com / 123456 (Admin)');
    console.log('  • dueno@fukusuke.com / 123456 (Dueño)');
    console.log('  • cajero@fukusuke.com / 123456 (Cajero)');
    console.log('  • chef@fukusuke.com / 123456 (Chef)');

  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
  } finally {
    db.close();
  }
}

seedDatabase(); 