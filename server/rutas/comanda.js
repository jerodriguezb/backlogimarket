const express = require("express");
const Comanda = require("../modelos/comanda");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const _ = require("underscore");
const app = express();

app.get("/comandas", function (req, res) {
  // res.json("GET usuarios");

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 500;
  limite = Number(limite);

  Comanda.find({ activo: true })
    .limit(limite)
    .skip(desde)
    .sort("nrodecomanda") //ordenar alfabeticamente
    // .populate({
    //   path: "localidad",
    //   populate: { path: "provincia" },
    // })
    // .populate("condicioniva")

    // .populate({ path: "condicioniva")
    // .populate({"localidad", "localidad codigopostal", populate:{"provincia", "provincia"}})
    // .populate("razonsocial")
    .exec((err, comandas) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Comanda.countDocuments({ activo: true }, (err, conteo) => {
        res.json({
          ok: true,
          comandas,
          cantidad: conteo,
        });
      });
    });
});

app.get("/comandas/:id", function (req, res) {
  // res.json("GET usuarios");

  let id = req.params.id;

  Comanda.findById(id).exec((err, comandas) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      comandas,
    });
  });
});

//LO COMENTADO ES CON VERIFICACION DE TOKEN
// app.post("/comandas", [verificaToken, verificaAdmin_role], function (req, res) {
app.post("/comandas", function (req, res) {
  // res.json('POST usuarios')

  let body = req.body;

  let comanda = new Comanda({
    nrodecomanda: body.nrodecomanda,
    codcli: body.codcli,
    lista: body.lista,
    codprod: body.codprod,
    cantidad: body.cantidad,
    monto: body.monto,
    entregado: body.entregado,
    activo: body.activo,
    // usuario: req.usuario._id,
  });

  comanda.save((err, comandaDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      comanda: comandaDB,
    });
  });
});
app.put(
  "/comandas/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    // res.json("PUT usuarios");
    let id = req.params.id;
    let body = req.body;

    Comanda.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true },
      (err, comandaDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        res.json({
          ok: true,
          comanda: comandaDB,
        });
      }
    );
  }
);

app.delete(
  "/comandas/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    let id = req.params.id;

    let estadoActualizado = {
      activo: false,
    };

    Comanda.findByIdAndUpdate(
      id,
      estadoActualizado,
      { new: true },
      (err, comandaBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!comandaBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Comanda no encontrada",
            },
          });
        }

        res.json({
          ok: true,
          comanda: comandaBorrado,
        });
      }
    );
  }
);

module.exports = app;
