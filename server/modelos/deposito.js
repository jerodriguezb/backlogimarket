const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let tipodepositosValidos = {
  values: ["FIJO", "MOVIL"],
  message: "{VALUE} no es tipo valido ",
};

let Schema = mongoose.Schema;

let depositoSchema = new Schema({
  coddeposito: {
    type: Number,
    required: [true, "Ingrese el codigo valido"],
  },

  deposito: {
    type: String,
    required: [true, "Debe ingresar un deposito valido"],
    enum: tipodepositosValidos,
  },

  tipodeposito: {
    type: String,
    required: [true, "Debe ingresar un tipo de deposito"],
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

depositoSchema.plugin(uniqueValidator, {
  message: "{PATH} debe ser único",
});

module.exports = mongoose.model("Deposito", depositoSchema);
