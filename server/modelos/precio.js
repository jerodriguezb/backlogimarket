const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let tiposivaValidos = {
  values: [10.5, 21],
  message: "{VALUE} no es tipo valido ",
};

let Schema = mongoose.Schema;

let precioSchema = new Schema({
  codproducto: {
    type: Schema.Types.ObjectId,
    ref: "Productserv",
  },

  lista: {
    type: Schema.Types.ObjectId,
    ref: "Lista",
  },

  precionetocompra: {
    type: Number,
    required: [true, "Ingrese el codigo valido"],
  },

  ivacompra: {
    type: Number,
    enum: tiposivaValidos,
  },

  preciototalcompra: {
    type: Number,
    required: [true, "Ingrese el codigo valido"],
  },

  precionetoventa: {
    type: Number,
    required: [true, "Ingrese el codigo valido"],
  },

  ivaventa: {
    type: Number,
    enum: tiposivaValidos,
  },

  preciototalventa: {
    type: Number,
    required: [true, "Ingrese el codigo valido"],
  },

  fecha: {
    type: Date,
    default: Date.now(),
  },

  activo: {
    type: Boolean,
    default: true,
  },
});

precioSchema.plugin(uniqueValidator, {
  message: "{PATH} debe ser único",
});

module.exports = mongoose.model("Precio", precioSchema);
