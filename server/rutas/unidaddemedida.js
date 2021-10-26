const express = require("express");
const Unidaddemedida = require("../modelos/unidaddemedida");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const _ = require("underscore");
//const unidaddemedida = require("../modelos/unidaddemedida");
const app = express();

app.get("/unidades", function (req, res) {
  // res.json("GET usuarios");

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 50;
  limite = Number(limite);

  Unidaddemedida.find({ activo: true })
    .limit(limite)
    .skip(desde)
    .sort("unidaddemedida") //ordenar alfabeticamente
    // .populate("usuario", "nombre email")
    .exec((err, unidades) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Unidaddemedida.countDocuments({ activo: true }, (err, conteo) => {
        res.json({
          ok: true,
          unidades,
          cantidad: conteo,
        });
      });
    });
});

app.get("/unidades/:id", function (req, res) {
  // res.json("GET usuarios");

  let id = req.params.id;

  Unidaddemedida.findById(id).exec((err, unidades) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      unidades,
    });
  });
});

app.post("/unidades", function (req, res) {
  // res.json('POST usuarios')

  let body = req.body;

  let unidad = new Unidaddemedida({
    codigomedida: body.codigomedida,
    unidaddemedida: body.unidaddemedida,
    activo: body.activo,
    // usuario: req.usuario._id,
  });

  unidad.save((err, unidadDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      unidad: unidadDB,
    });
  });
});
app.put(
  "/unidades/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    // res.json("PUT usuarios");
    let id = req.params.id;
    let body = req.body;

    //verficar aqui
    Unidaddemedida.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true },
      (err, unidadDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        res.json({
          ok: true,
          unidad: unidadDB,
        });
      }
    );
  }
);

app.delete(
  "/unidades/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    let id = req.params.id;

    let estadoActualizado = {
      activo: false,
    };

    Unidaddemedida.findByIdAndUpdate(
      id,
      estadoActualizado,
      { new: true },
      (err, unidadBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!unidadBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Unidad de medida no encontrado",
            },
          });
        }

        res.json({
          ok: true,
          unidad: unidadBorrado,
        });
      }
    );
  }
);

module.exports = app;
