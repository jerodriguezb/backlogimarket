const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let stockSchema = new Schema({
  codproducto: {
    type: Schema.Types.ObjectId,
    ref: "Productserv",
  },

  movimiento: {
    type: Schema.Types.ObjectId,
    ref: "Tipomovimiento",
  },

  cantidad: {
    type: Number,
    required: [true, "Ingrese una cantidad valida"],
  },

  stockactual: {
    type: Number,
    required: [true, "Ingrese una cantidad valida"],
  },

  fecha: {
    type: Date,
    required: [true, "Ingrese una cantidad valida"],
  },

  activo: {
    type: Boolean,
    default: true,
  },
});

stockSchema.plugin(uniqueValidator, {
  message: "{PATH} debe ser único",
});

module.exports = mongoose.model("Stock", stockSchema);
