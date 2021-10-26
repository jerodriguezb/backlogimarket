const express = require("express");
const Deposito = require("../modelos/deposito");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const _ = require("underscore");
const app = express();

app.get("/depositos", function (req, res) {
  // res.json("GET usuarios");

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 500;
  limite = Number(limite);

  Deposito.find({ activo: true })
    .limit(limite)
    .skip(desde)
    .sort("deposito") //ordenar alfabeticamente
    // .populate({
    //   path: "localidad",
    //   populate: { path: "provincia" },
    // })
    // .populate("condicioniva")

    // .populate({ path: "condicioniva")
    // .populate({"localidad", "localidad codigopostal", populate:{"provincia", "provincia"}})
    // .populate("razonsocial")
    .exec((err, depositos) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Deposito.countDocuments({ activo: true }, (err, conteo) => {
        res.json({
          ok: true,
          depositos,
          cantidad: conteo,
        });
      });
    });
});

app.get("/depositos/:id", function (req, res) {
  // res.json("GET usuarios");

  let id = req.params.id;

  Deposito.findById(id).exec((err, depositos) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      depositos,
    });
  });
});

//LO COMENTADO ES CON VERIFICACION DE TOKEN
// app.post("/depositos", [verificaToken, verificaAdmin_role], function (req, res) {
app.post("/depositos", function (req, res) {
  // res.json('POST usuarios')

  let body = req.body;

  let deposito = new Deposito({
    coddeposito: body.coddeposito,
    deposito: body.deposito,
    tipodeposito: body.tipodeposito,
    activo: body.activo,
    // usuario: req.usuario._id,
  });

  deposito.save((err, depositoDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      deposito: depositoDB,
    });
  });
});
app.put(
  "/depositos/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    // res.json("PUT usuarios");
    let id = req.params.id;
    let body = req.body;

    Deposito.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true },
      (err, depositoDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        res.json({
          ok: true,
          deposito: depositoDB,
        });
      }
    );
  }
);

app.delete(
  "/depositos/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    let id = req.params.id;

    let estadoActualizado = {
      activo: false,
    };

    Deposito.findByIdAndUpdate(
      id,
      estadoActualizado,
      { new: true },
      (err, depositoBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!depositoBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Deposito no encontrado",
            },
          });
        }

        res.json({
          ok: true,
          deposito: depositoBorrado,
        });
      }
    );
  }
);

module.exports = app;
