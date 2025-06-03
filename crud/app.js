const express = require('express');
const app = express();
const clientesRouter = require('./routes/clientes');
const choferRouter = require('./routes/chofer');
const despachoRouter = require('./routes/despacho');
const ingredienteRouter = require('./routes/ingrediente');
const pagoRouter = require('./routes/pago');
const pedidoRouter = require('./routes/pedido');
const pedidoitemRouter = require('./routes/pedidoitem');
const productoRouter = require('./routes/producto');
const productoingredienteRouter = require('./routes/productoingrediente');
const trabajadoresRouter = require('./routes/trabajadores');

app.use(express.json());
app.use('/clientes', clientesRouter);
app.use('/trabajadores', trabajadoresRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
