const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let empresaSchema = new Schema({
  razonsocial: {
    type: String,
    required: [true, "La Razon social de la empresa/cliente es necesaria"],
  },
  domicilio: {
    type: String,
    required: [true, "El domicilio debe completarse"],
  },
  telefono: {
    type: String,
    required: [true, "El telefono debe completarse"],
  },
  cuit: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    unique: false,
  },

  localidad: {
    type: Schema.Types.ObjectId,
    ref: "Localidad",
  },

  condicioniva: {
    type: Schema.Types.ObjectId,
    ref: "Tipoiva",
  },

  activo: {
    type: Boolean,
    default: true,
  },

  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
  },
});

empresaSchema.plugin(uniqueValidator, {
  message: "{PATH} debe ser único",
});

module.exports = mongoose.model("Empresa", empresaSchema);
