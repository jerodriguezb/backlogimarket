const express = require("express");
const Localidad = require("../modelos/localidad");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const _ = require("underscore");
//const unidaddemedida = require("../modelos/unidaddemedida");
const app = express();

app.get("/localidades", function (req, res) {
  // res.json("GET usuarios");

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 50;
  limite = Number(limite);

  Localidad.find({ activo: true })
    .limit(limite)
    .skip(desde)
    .sort("localidad") //ordenar alfabeticamente
    .populate("provincia")
    .exec((err, localidades) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Localidad.countDocuments({ activo: true }, (err, conteo) => {
        res.json({
          ok: true,
          localidades,
          cantidad: conteo,
        });
      });
    });
});

app.get("/localidades/:id", function (req, res) {
  // res.json("GET usuarios");

  let id = req.params.id;

  Localidad.findById(id).exec((err, localidades) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      localidades,
    });
  });
});

app.post("/localidades", function (req, res) {
  // res.json('POST usuarios')

  let body = req.body;

  let localidad = new Localidad({
    localidad: body.localidad,
    codigopostal: body.codigopostal,
    provincia: body.provincia,
    activo: body.activo,
    // usuario: req.usuario._id,
  });

  localidad.save((err, localidadDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      localidad: localidadDB,
    });
  });
});
app.put(
  "/localidades/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    // res.json("PUT usuarios");
    let id = req.params.id;
    let body = req.body;

    //verficar aqui
    Localidad.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true },
      (err, localidadDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        res.json({
          ok: true,
          localidad: localidadDB,
        });
      }
    );
  }
);

app.delete(
  "/localidades/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    let id = req.params.id;

    let estadoActualizado = {
      activo: false,
    };

    Localidad.findByIdAndUpdate(
      id,
      estadoActualizado,
      { new: true },
      (err, localidadBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!localidadBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Localidad no encontrada",
            },
          });
        }

        res.json({
          ok: true,
          localidad: localidadBorrado,
        });
      }
    );
  }
);

module.exports = app;
