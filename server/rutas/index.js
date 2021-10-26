const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require("./usuario"));
app.use(require("./proveedor"));
app.use(require("./cliente"));
app.use(require("./empresa"));
app.use(require("./unidaddemedida"));
app.use(require("./localidad"));
app.use(require("./provincia"));
app.use(require("./tipoiva"));
app.use(require("./ruta"));
app.use(require("./producserv"));
app.use(require("./precio"));
app.use(require("./lista"));
app.use(require("./rubro"));
app.use(require("./marca"));
app.use(require("./stock"));
app.use(require("./deposito"));
app.use(require("./comanda"));
app.use(require("./tipomovimiento"));

app.use(require("./login"));

// app.use(require("./unidaddemedida"));

// app.use(require("./curso"));
// app.use(require("./propiedad"));

module.exports = app;
