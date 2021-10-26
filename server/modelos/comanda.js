const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let comandaSchema = new Schema({
  nrodecomanda: {
    type: Number,
    required: [true, "Ingrese el codigo valido"],
  },

  codcli: {
    type: Schema.Types.ObjectId,
    ref: "Cliente",
  },

  lista: {
    type: Schema.Types.ObjectId,
    ref: "Lista",
  },

  codprod: {
    type: Schema.Types.ObjectId,
    ref: "Productserv",
  },

  cantidad: {
    type: Number,
    required: [true, "Ingrese la cantidad"],
  },

  monto: {
    type: Number,
  },

  fecha: {
    type: Date,
    default: Date.now(),
  },

  entregado: {
    type: Boolean,
    default: false,
  },

  activo: {
    type: Boolean,
    default: true,
  },

  //   usuario: {
  //     type: Schema.Types.ObjectId,
  //     ref: "Usuario",
  //   },
});

comandaSchema.plugin(uniqueValidator, {
  message: "{PATH} debe ser único",
});

module.exports = mongoose.model("Comanda", comandaSchema);
