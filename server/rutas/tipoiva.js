const express = require("express");
const Tipoiva = require("../modelos/tipoiva");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const _ = require("underscore");
//const unidaddemedida = require("../modelos/unidaddemedida");
const app = express();

app.get("/iva", function (req, res) {
  // res.json("GET usuarios");

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 50;
  limite = Number(limite);

  Tipoiva.find({ activo: true })
    .limit(limite)
    .skip(desde)
    .sort("ruta") //ordenar alfabeticamente
    // .populate("provincia", "provincia")
    .exec((err, iva) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Tipoiva.countDocuments({ activo: true }, (err, conteo) => {
        res.json({
          ok: true,
          iva,
          cantidad: conteo,
        });
      });
    });
});

app.get("/iva/:id", function (req, res) {
  // res.json("GET usuarios");

  let id = req.params.id;

  Tipoiva.findById(id).exec((err, iva) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      iva,
    });
  });
});

app.post("/iva", function (req, res) {
  // res.json('POST usuarios')

  let body = req.body;

  let iva = new Tipoiva({
    codigoiva: body.codigoiva,
    iva: body.iva,
    activo: body.activo,
    // usuario: req.usuario._id,
  });

  iva.save((err, ivaDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      iva: ivaDB,
    });
  });
});
app.put("/iva/:id", [verificaToken, verificaAdmin_role], function (req, res) {
  // res.json("PUT usuarios");
  let id = req.params.id;
  let body = req.body;

  //verficar aqui
  Tipoiva.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, ivaDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        iva: ivaDB,
      });
    }
  );
});

app.delete(
  "/iva/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    let id = req.params.id;

    let estadoActualizado = {
      activo: false,
    };

    Tipoiva.findByIdAndUpdate(
      id,
      estadoActualizado,
      { new: true },
      (err, ivaBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!ivaBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "iva no encontrada",
            },
          });
        }

        res.json({
          ok: true,
          iva: ivaBorrado,
        });
      }
    );
  }
);

module.exports = app;
