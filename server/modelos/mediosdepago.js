const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let mediosdepagoSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es necesario"],
  },
  tipomediopago: {
    type: String,
    required: [true, "El tipo de pago es necesario"],
  },
  nrocuentabancaria: {
    type: String,
    required: false,
  },
  banco: {
    type: String,
    required: false,
  },
  cbu: {
    type: String,
    required: false,
  },

  alias: {
    type: String,
    required: false,
  },

  activo: {
    type: Boolean,
    required: false,
  },

  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
  },

  productserv: {
    type: Schema.Types.ObjectId,
    ref: "Productserv",
  },
});

mediosdepagoSchema.plugin(uniqueValidator, {
  message: "{PATH} debe ser único",
});

module.exports = mongoose.model("Carrito", mediosdepagoSchema);
