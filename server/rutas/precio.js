const express = require("express");
const Precio = require("../modelos/precio");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const _ = require("underscore");
const app = express();

app.get("/precios", function (req, res) {
  // res.json("GET usuarios");

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 500;
  limite = Number(limite);

  Precio.find({ activo: true })
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
    .exec((err, precios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Precio.countDocuments({ activo: true }, (err, conteo) => {
        res.json({
          ok: true,
          precios,
          cantidad: conteo,
        });
      });
    });
});

app.get("/precios/:id", function (req, res) {
  // res.json("GET usuarios");

  let id = req.params.id;

  Precio.findById(id).exec((err, precios) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      precios,
    });
  });
});

//LO COMENTADO ES CON VERIFICACION DE TOKEN
// app.post("/precios", [verificaToken, verificaAdmin_role], function (req, res) {
app.post("/precios", function (req, res) {
  // res.json('POST usuarios')

  let body = req.body;

  let precio = new Precio({
    codproducto: body.codproducto,
    lista: body.lista,
    precionetodecompra: body.precionetodecompra,
    ivacompra: body.ivacompra,
    preciototalcompra: body.preciototalcompra,
    precionetoventa: body.precionetoventa,
    ivaventa: body.ivaventa,
    preciototalventa: body.preciototalventa,
    activo: body.activo,
    // usuario: req.usuario._id,
  });

  precio.save((err, precioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      precio: precioDB,
    });
  });
});
app.put(
  "/precios/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    // res.json("PUT usuarios");
    let id = req.params.id;
    let body = req.body;

    Precio.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true },
      (err, precioDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        res.json({
          ok: true,
          precio: precioDB,
        });
      }
    );
  }
);

app.delete(
  "/precios/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    let id = req.params.id;

    let estadoActualizado = {
      activo: false,
    };

    Precio.findByIdAndUpdate(
      id,
      estadoActualizado,
      { new: true },
      (err, precioBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!precioBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Precio no encontrada",
            },
          });
        }

        res.json({
          ok: true,
          precio: precioBorrado,
        });
      }
    );
  }
);

module.exports = app;
