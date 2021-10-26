const express = require("express");
const Marca = require("../modelos/marca");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const _ = require("underscore");
const app = express();

app.get("/marcas", function (req, res) {
  // res.json("GET usuarios");

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 500;
  limite = Number(limite);

  Marca.find({ activo: true })
    .limit(limite)
    .skip(desde)
    .sort("marca") //ordenar alfabeticamente
    // .populate({
    //   path: "localidad",
    //   populate: { path: "provincia" },
    // })
    // .populate("condicioniva")

    // .populate({ path: "condicioniva")
    // .populate({"localidad", "localidad codigopostal", populate:{"provincia", "provincia"}})
    // .populate("razonsocial")
    .exec((err, marcas) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Marca.countDocuments({ activo: true }, (err, conteo) => {
        res.json({
          ok: true,
          marcas,
          cantidad: conteo,
        });
      });
    });
});

app.get("/marcas/:id", function (req, res) {
  // res.json("GET usuarios");

  let id = req.params.id;

  Marca.findById(id).exec((err, marcas) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      marcas,
    });
  });
});

//LO COMENTADO ES CON VERIFICACION DE TOKEN
// app.post("/marcas", [verificaToken, verificaAdmin_role], function (req, res) {
app.post("/marcas", function (req, res) {
  // res.json('POST usuarios')

  let body = req.body;

  let marca = new Marca({
    codmarca: body.codmarca,
    marca: body.marca,
    activo: body.activo,
    // usuario: req.usuario._id,
  });

  marca.save((err, marcaDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      marca: marcaDB,
    });
  });
});
app.put(
  "/marcas/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    // res.json("PUT usuarios");
    let id = req.params.id;
    let body = req.body;

    Marca.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true },
      (err, marcaDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        res.json({
          ok: true,
          marca: marcaDB,
        });
      }
    );
  }
);

app.delete(
  "/marcas/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    let id = req.params.id;

    let estadoActualizado = {
      activo: false,
    };

    Marca.findByIdAndUpdate(
      id,
      estadoActualizado,
      { new: true },
      (err, marcaBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!marcaBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Marca no encontrada",
            },
          });
        }

        res.json({
          ok: true,
          marca: marcaBorrado,
        });
      }
    );
  }
);

module.exports = app;
