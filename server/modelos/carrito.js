const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let carritoSchema = new Schema({
  precio: {
    type: Number,
    required: [true, "El nombre es necesario"],
  },
  cantidad: {
    type: Number,
    required: [true, "El apellido es necesario"],
  },
  porcentajedctoaplicado: {
    type: Number,
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

carritoSchema.plugin(uniqueValidator, {
  message: "{PATH} debe ser único",
});

module.exports = mongoose.model("Carrito", carritoSchema);
