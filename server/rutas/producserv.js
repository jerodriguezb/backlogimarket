const express = require("express");
const Producserv = require("../modelos/producserv");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const _ = require("underscore");
const app = express();

app.get("/producservs", function (req, res) {
  // res.json("GET usuarios");

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 500;
  limite = Number(limite);

  Producserv.find({ activo: true })
    .limit(limite)
    .skip(desde)
    .sort("descripcion") //ordenar alfabeticamente
    // .populate({
    //   path: "localidad",
    //   populate: { path: "provincia" },
    // })
    // .populate("condicioniva")

    // .populate({ path: "condicioniva")
    // .populate({"localidad", "localidad codigopostal", populate:{"provincia", "provincia"}})
    // .populate("razonsocial")
    .exec((err, producservs) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Producserv.countDocuments({ activo: true }, (err, conteo) => {
        res.json({
          ok: true,
          producservs,
          cantidad: conteo,
        });
      });
    });
});

app.get("/producservs/:id", function (req, res) {
  // res.json("GET usuarios");

  let id = req.params.id;

  Producserv.findById(id).exec((err, producservs) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      producservs,
    });
  });
});

//LO COMENTADO ES CON VERIFICACION DE TOKEN
// app.post("/productosyservicios", [verificaToken, verificaAdmin_role], function (req, res) {
app.post("/producservs", function (req, res) {
  // res.json('POST usuarios')

  let body = req.body;

  let producserv = new Producserv({
    codprod: body.codprod,
    descripcion: body.descripcion,
    rubro: body.rubro,
    marca: body.marca,
    unidaddemedida: body.unidaddemedida,
    tipo: body.tipo,
    iva: body.iva,
    activo: body.activo,
    // usuario: req.Usuario._id, //probar si graba
  });

  producserv.save((err, producservDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      producserv: producservDB,
    });
  });
});
app.put(
  "/producservs/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    // res.json("PUT usuarios");
    let id = req.params.id;
    let body = req.body;

    Producserv.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true },
      (err, producservDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        res.json({
          ok: true,
          producserv: producservDB,
        });
      }
    );
  }
);

app.delete(
  "/producservs/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    let id = req.params.id;

    let estadoActualizado = {
      activo: false,
    };

    Producserv.findByIdAndUpdate(
      id,
      estadoActualizado,
      { new: true },
      (err, producservBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!producservBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Producto o servicio no encontrado",
            },
          });
        }

        res.json({
          ok: true,
          producserv: producservBorrado,
        });
      }
    );
  }
);

module.exports = app;
