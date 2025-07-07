const express = require('express');
const cors = require('cors');
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

app.use(cors());
app.use(express.json());
app.use('/clientes', clientesRouter);
app.use('/chofer', choferRouter);
app.use('/despacho', despachoRouter);
app.use('/ingrediente', ingredienteRouter);
app.use('/pago', pagoRouter);
app.use('/pedido', pedidoRouter);
app.use('/pedidoitem', pedidoitemRouter);
app.use('/producto', productoRouter);
app.use('/productoingrediente', productoingredienteRouter);
app.use('/trabajadores', trabajadoresRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
