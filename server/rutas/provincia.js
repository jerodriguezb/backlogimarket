const express = require("express");
const Provincia = require("../modelos/provincia");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const _ = require("underscore");
//const unidaddemedida = require("../modelos/unidaddemedida");
const app = express();

app.get("/provincias", function (req, res) {
  // res.json("GET usuarios");

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 50;
  limite = Number(limite);

  Provincia.find({ activo: true })
    .limit(limite)
    .skip(desde)
    .sort("provincia") //ordenar alfabeticamente
    // .populate("usuario", "nombre email")
    .exec((err, provincias) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Provincia.countDocuments({ activo: true }, (err, conteo) => {
        res.json({
          ok: true,
          provincias,
          cantidad: conteo,
        });
      });
    });
});

app.get("/provincias/:id", function (req, res) {
  // res.json("GET usuarios");

  let id = req.params.id;

  Provincia.findById(id).exec((err, provincias) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      provincias,
    });
  });
});

app.post("/provincias", function (req, res) {
  // res.json('POST usuarios')

  let body = req.body;

  let provincia = new Provincia({
    codigoprovincia: body.codigoprovincia,
    provincia: body.provincia,
    activo: body.activo,
    // usuario: req.usuario._id,
  });

  provincia.save((err, provinciaDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      provincia: provinciaDB,
    });
  });
});
app.put(
  "/provincias/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    // res.json("PUT usuarios");
    let id = req.params.id;
    let body = req.body;

    //verficar aqui
    Provincia.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true },
      (err, provinciaDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        res.json({
          ok: true,
          provincia: provinciaDB,
        });
      }
    );
  }
);

app.delete(
  "/provincias/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    let id = req.params.id;

    let estadoActualizado = {
      activo: false,
    };

    Provincia.findByIdAndUpdate(
      id,
      estadoActualizado,
      { new: true },
      (err, provinciaBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!provinciaBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Provincia no encontrada",
            },
          });
        }

        res.json({
          ok: true,
          provincia: provinciaBorrado,
        });
      }
    );
  }
);

module.exports = app;
