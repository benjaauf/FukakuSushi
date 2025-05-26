const express = require('express');
const app = express();
const clientesRouter = require('./routes/clientes');

app.use(express.json());
app.use('/clientes', clientesRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
