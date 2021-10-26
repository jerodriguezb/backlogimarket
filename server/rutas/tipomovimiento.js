const express = require("express");
const Tipomovimiento = require("../modelos/tipomovimiento");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const _ = require("underscore");
const app = express();

app.get("/tipomovimientos", function (req, res) {
  // res.json("GET usuarios");

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 500;
  limite = Number(limite);

  Tipomovimiento.find({ activo: true })
    .limit(limite)
    .skip(desde)
    .sort("movimiento") //ordenar alfabeticamente
    // .populate({
    //   path: "localidad",
    //   populate: { path: "provincia" },
    // })
    // .populate("condicioniva")

    // .populate({ path: "condicioniva")
    // .populate({"localidad", "localidad codigopostal", populate:{"provincia", "provincia"}})
    // .populate("razonsocial")
    .exec((err, tipomovimientos) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Tipomovimiento.countDocuments({ activo: true }, (err, conteo) => {
        res.json({
          ok: true,
          tipomovimientos,
          cantidad: conteo,
        });
      });
    });
});

app.get("/tipomovimientos/:id", function (req, res) {
  // res.json("GET usuarios");

  let id = req.params.id;

  Tipomovimiento.findById(id).exec((err, tipomovimientos) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      tipomovimientos,
    });
  });
});

//LO COMENTADO ES CON VERIFICACION DE TOKEN
// app.post("/tipomovimientos", [verificaToken, verificaAdmin_role], function (req, res) {
app.post("/tipomovimientos", function (req, res) {
  // res.json('POST usuarios')

  let body = req.body;

  let tipomovimiento = new Tipomovimiento({
    codigomovimiento: body.codigomovimiento,
    movimiento: body.movimiento,
    factor: body.factor,
    activo: body.activo,
    // usuario: req.usuario._id,
  });

  tipomovimiento.save((err, tipomovimientoDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      tipomovimiento: tipomovimientoDB,
    });
  });
});
app.put(
  "/tipomovimientos/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    // res.json("PUT usuarios");
    let id = req.params.id;
    let body = req.body;

    Tipomovimiento.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true },
      (err, tipomovimientoDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        res.json({
          ok: true,
          tipomovimiento: tipomovimientoDB,
        });
      }
    );
  }
);

app.delete(
  "/tipomovimientos/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    let id = req.params.id;

    let estadoActualizado = {
      activo: false,
    };

    Tipomovimiento.findByIdAndUpdate(
      id,
      estadoActualizado,
      { new: true },
      (err, tipomovimientoBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!tipomovimientoBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Tipo movimiento no encontrada",
            },
          });
        }

        res.json({
          ok: true,
          tipomovimiento: tipomovimientoBorrado,
        });
      }
    );
  }
);

module.exports = app;
