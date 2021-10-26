const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let cursoSchema = new Schema({
  title: {
    type: String,

    required: [true, "El título es necesario"],
  },
  imagen: {
    type: String,
    default:
      "https://i0.wp.com/elfutbolito.mx/wp-content/uploads/2019/04/image-not-found.png?ssl=1",
  },
  detalle: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    default: "https://www.youtube.com/embed/iUrFW4JTv3c",
  },
  mentor: {
    type: String,
    required: true,
  },
  img_mentor: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx_7XSeoV5uoxiFIbSEg9QT-YT7TFqgvuxag&usqp=CAU",
  },
  estado: {
    type: Boolean,
    default: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
  },
});

cursoSchema.plugin(uniqueValidator, {
  message: "{PATH} debe ser único",
});

module.exports = mongoose.model("Curso", cursoSchema);
