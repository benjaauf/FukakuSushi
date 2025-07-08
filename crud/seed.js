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

      CREATE TABLE IF NOT EXISTS sushi (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price INTEGER,
      image TEXT,
      ingredients TEXT,
      categories TEXT
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
      }
    ];


    const sushis = [
    {
      id: 1,
      name: "Nigiri",
      description: "Arroz, Salmón",
      price: 9990,
      image: "/sushi3.jpg",
      ingredients: ["Arroz", "Salmón"],
      categories: ["Populares"]
    },
    {
      id: 2,
      name: "Smoked Salmon Roll",
      description: "Arroz, Salmón, Palta, Alga Nori",
      price: 9990,
      image: "/sushi2.jpg",
      ingredients: ["Arroz", "Salmón", "Palta", "Alga Nori"],
      categories: ["Populares", "Nori", "Avocado"]
    },
    {
      id: 3,
      name: "Tobiko California Roll",
      description: "Arroz, Pepino, Cangrejo, Palta, Tobiko",
      price: 9990,
      image: "/sushi1.jpg",
      ingredients: ["Arroz", "Pepino", "Cangrejo", "Palta", "Tobiko"],
      categories: ["Populares", "Avocado"]
    },
    {
      id: 4,
      name: "Yasu Roll",
      description: "Arroz, Camarón, Queso crema, Salmón, Cebollín",
      price: 9990,
      image: "/sushi4.jpg",
      ingredients: ["Arroz", "Camarón", "Queso crema", "Salmón", "Cebollín"],
      categories: ["Populares"]
    },
    {
      id: 5,
      name: "Tempura Roll",
      description: "Arroz, Camarón tempura, Palta, Salsa especial",
      price: 10990,
      image: "/sushi1.jpg",
      ingredients: ["Arroz", "Camarón tempura", "Palta", "Salsa especial"],
      categories: ["Tempura", "Avocado"]
    },
    {
      id: 6,
      name: "Nori Special",
      description: "Arroz, Salmón, Alga Nori, Aguacate",
      price: 11990,
      image: "/sushi2.jpg",
      ingredients: ["Arroz", "Salmón", "Alga Nori", "Aguacate"],
      categories: ["Nori", "Avocado"]
    },
    {
      id: 7,
      name: "California Roll",
      description: "Arroz, Palta, Kanikama",
      price: 8990,
      image: "/sushi5.jpg",
      ingredients: ["Arroz", "Palta", "Kanikama"],
      categories: ["Clásicos"]
    },
    {
      id: 8,
      name: "Sake Roll",
      description: "Salmón, Queso Crema",
      price: 10490,
      image: "/sushi6.jpg",
      ingredients: ["Salmón", "Queso Crema"],
      categories: ["Populares"]
    },
    {
      id: 9,
      name: "Dragon Roll",
      description: "Anguila, Palta",
      price: 11990,
      image: "/sushi7.jpg",
      ingredients: ["Anguila", "Palta"],
      categories: ["Especiales"]
    },
    {
      id: 10,
      name: "Ebi Roll",
      description: "Camarón, Palta",
      price: 9590,
      image: "/sushi8.jpg",
      ingredients: ["Camarón", "Palta"],
      categories: ["Clásicos"]
    },
    {
      id: 11,
      name: "Veggie Roll",
      description: "Palta, Pepino, Zanahoria",
      price: 7990,
      image: "/sushi9.jpg",
      ingredients: ["Palta", "Pepino", "Zanahoria"],
      categories: ["Vegetarianos"]
    },
    {
      id: 12,
      name: "Spicy Tuna",
      description: "Atún Picante, Mayo",
      price: 9990,
      image: "/sushi10.jpg",
      ingredients: ["Atún", "Mayonesa Picante"],
      categories: ["Picantes"]
    },
    {
      id: 13,
      name: "Sushi Pollo Teriyaki",
      description: "Pollo, Salsa Teriyaki",
      price: 8990,
      image: "/sushi11.jpg",
      ingredients: ["Pollo", "Teriyaki"],
      categories: ["Alternativos"]
    },
    {
      id: 14,
      name: "Avocado Roll",
      description: "Palta, Arroz",
      price: 7590,
      image: "/sushi12.jpg",
      ingredients: ["Palta", "Arroz"],
      categories: ["Vegetarianos"]
    },
    {
      id: 15,
      name: "Philadelphia Roll",
      description: "Salmón, Queso Crema",
      price: 10490,
      image: "/sushi13.jpg",
      ingredients: ["Salmón", "Queso Crema"],
      categories: ["Populares"]
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
    
    for (const sushi of sushis) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR REPLACE INTO sushi 
          (id, name, description, price, image, ingredients, categories)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          sushi.id,
          sushi.name,
          sushi.description,
          sushi.price,
          sushi.image,
          JSON.stringify(sushi.ingredients),
          JSON.stringify(sushi.categories)
        ], function(err) {
          if (err) reject(err);
          else resolve();
        });
      });
      console.log(`🍣 Sushi creado: ${sushi.name}`);
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