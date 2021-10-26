const express = require("express");
const Ruta = require("../modelos/ruta");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const _ = require("underscore");
//const unidaddemedida = require("../modelos/unidaddemedida");
const app = express();

app.get("/rutas", function (req, res) {
  // res.json("GET usuarios");

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 50;
  limite = Number(limite);

  Ruta.find({ activo: true })
    .limit(limite)
    .skip(desde)
    .sort("ruta") //ordenar alfabeticamente
    // .populate("")
    .exec((err, rutas) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Ruta.countDocuments({ activo: true }, (err, conteo) => {
        res.json({
          ok: true,
          rutas,
          cantidad: conteo,
        });
      });
    });
});

app.get("/rutas/:id", function (req, res) {
  // res.json("GET usuarios");

  let id = req.params.id;

  Ruta.findById(id).exec((err, rutas) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      rutas,
    });
  });
});

app.post("/rutas", function (req, res) {
  // res.json('POST usuarios')

  let body = req.body;

  let ruta = new Ruta({
    ruta: body.ruta,
    activo: body.activo,
    // usuario: req.usuario._id,
  });

  ruta.save((err, rutaDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      ruta: rutaDB,
    });
  });
});
app.put("/rutas/:id", [verificaToken, verificaAdmin_role], function (req, res) {
  // res.json("PUT usuarios");
  let id = req.params.id;
  let body = req.body;

  //verficar aqui
  Ruta.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, rutaDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        ruta: rutaDB,
      });
    }
  );
});

app.delete(
  "/rutas/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    let id = req.params.id;

    let estadoActualizado = {
      activo: false,
    };

    Ruta.findByIdAndUpdate(
      id,
      estadoActualizado,
      { new: true },
      (err, rutaBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!rutaBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Ruta no encontrada",
            },
          });
        }

        res.json({
          ok: true,
          ruta: rutaBorrado,
        });
      }
    );
  }
);

module.exports = app;
