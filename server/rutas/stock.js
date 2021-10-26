const express = require("express");
const Stock = require("../modelos/stock");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const _ = require("underscore");
const app = express();

app.get("/stocks", function (req, res) {
  // res.json("GET usuarios");

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 500;
  limite = Number(limite);

  Stock.find({ activo: true })
    .limit(limite)
    .skip(desde)
    .sort("fecha") //ordenar alfabeticamente
    // .populate({
    //   path: "localidad",
    //   populate: { path: "provincia" },
    // })
    // .populate("condicioniva")

    // .populate({ path: "condicioniva")
    // .populate({"localidad", "localidad codigopostal", populate:{"provincia", "provincia"}})
    // .populate("razonsocial")
    .exec((err, stocks) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Stock.countDocuments({ activo: true }, (err, conteo) => {
        res.json({
          ok: true,
          stocks,
          cantidad: conteo,
        });
      });
    });
});

app.get("/stocks/:id", function (req, res) {
  // res.json("GET usuarios");

  let id = req.params.id;

  Stock.findById(id).exec((err, stocks) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      stocks,
    });
  });
});

//LO COMENTADO ES CON VERIFICACION DE TOKEN
// app.post("/stocks", [verificaToken, verificaAdmin_role], function (req, res) {
app.post("/stocks", function (req, res) {
  // res.json('POST usuarios')

  let body = req.body;

  let stock = new Stock({
    codproducto: body.razonsocial,
    movimiento: body.movimiento,
    cantidad: body.cantidad,
    stockactual: body.stockactual,
    fecha: body.fecha,
    activo: body.activo,
    // usuario: req.usuario._id,
  });

  stock.save((err, stockDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      stock: stockDB,
    });
  });
});
app.put(
  "/stocks/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    // res.json("PUT usuarios");
    let id = req.params.id;
    let body = req.body;

    Stock.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true },
      (err, stockDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        res.json({
          ok: true,
          stock: stockDB,
        });
      }
    );
  }
);

app.delete(
  "/stocks/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    let id = req.params.id;

    let estadoActualizado = {
      activo: false,
    };

    Stock.findByIdAndUpdate(
      id,
      estadoActualizado,
      { new: true },
      (err, stockBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!stockBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Stock no encontrado",
            },
          });
        }

        res.json({
          ok: true,
          stock: stockBorrado,
        });
      }
    );
  }
);

module.exports = app;
