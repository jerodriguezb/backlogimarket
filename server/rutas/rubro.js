const express = require("express");
const Rubro = require("../modelos/rubro");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const _ = require("underscore");
const app = express();

app.get("/rubros", function (req, res) {
  // res.json("GET usuarios");

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 500;
  limite = Number(limite);

  Rubro.find({ activo: true })
    .limit(limite)
    .skip(desde)
    .sort("rubro") //ordenar alfabeticamente
    // .populate({
    //   path: "localidad",
    //   populate: { path: "provincia" },
    // })
    // .populate("condicioniva")

    // .populate({ path: "condicioniva")
    // .populate({"localidad", "localidad codigopostal", populate:{"provincia", "provincia"}})
    // .populate("razonsocial")
    .exec((err, rubros) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Rubro.countDocuments({ activo: true }, (err, conteo) => {
        res.json({
          ok: true,
          rubros,
          cantidad: conteo,
        });
      });
    });
});

app.get("/rubros/:id", function (req, res) {
  // res.json("GET usuarios");

  let id = req.params.id;

  Rubro.findById(id).exec((err, rubros) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      rubros,
    });
  });
});

//LO COMENTADO ES CON VERIFICACION DE TOKEN
// app.post("/rubros", [verificaToken, verificaAdmin_role], function (req, res) {
app.post("/rubros", function (req, res) {
  // res.json('POST usuarios')

  let body = req.body;

  let rubro = new Rubro({
    codrubro: body.codrubro,
    rubro: body.rubro,
    activo: body.activo,
    // usuario: req.usuario._id,
  });

  rubro.save((err, rubroDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      rubro: rubroDB,
    });
  });
});
app.put(
  "/rubros/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    // res.json("PUT usuarios");
    let id = req.params.id;
    let body = req.body;

    Rubro.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true },
      (err, rubroDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        res.json({
          ok: true,
          rubro: rubroDB,
        });
      }
    );
  }
);

app.delete(
  "/rubros/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    let id = req.params.id;

    let estadoActualizado = {
      activo: false,
    };

    Rubro.findByIdAndUpdate(
      id,
      estadoActualizado,
      { new: true },
      (err, rubroBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!rubroBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Rubro no encontrada",
            },
          });
        }

        res.json({
          ok: true,
          rubro: rubroBorrado,
        });
      }
    );
  }
);

module.exports = app;
