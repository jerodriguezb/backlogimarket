const express = require("express");
const Lista = require("../modelos/lista");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const _ = require("underscore");
const app = express();

app.get("/listas", function (req, res) {
  // res.json("GET usuarios");

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 500;
  limite = Number(limite);

  Lista.find({ activo: true })
    .limit(limite)
    .skip(desde)
    .sort("lista") //ordenar alfabeticamente
    // .populate({
    //   path: "localidad",
    //   populate: { path: "provincia" },
    // })
    // .populate("condicioniva")

    // .populate({ path: "condicioniva")
    // .populate({"localidad", "localidad codigopostal", populate:{"provincia", "provincia"}})
    // .populate("razonsocial")
    .exec((err, listas) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Lista.countDocuments({ activo: true }, (err, conteo) => {
        res.json({
          ok: true,
          listas,
          cantidad: conteo,
        });
      });
    });
});

app.get("/listas/:id", function (req, res) {
  // res.json("GET usuarios");

  let id = req.params.id;

  Lista.findById(id).exec((err, listas) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      listas,
    });
  });
});

//LO COMENTADO ES CON VERIFICACION DE TOKEN
// app.post("/listas", [verificaToken, verificaAdmin_role], function (req, res) {
app.post("/listas", function (req, res) {
  // res.json('POST usuarios')

  let body = req.body;

  let lista = new Lista({
    codlista: body.codlista,
    lista: body.lista,
    activo: body.activo,
    // usuario: req.usuario._id,
  });

  lista.save((err, listaDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      lista: listaDB,
    });
  });
});
app.put(
  "/listas/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    // res.json("PUT usuarios");
    let id = req.params.id;
    let body = req.body;

    Lista.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true },
      (err, listaDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        res.json({
          ok: true,
          lista: listaDB,
        });
      }
    );
  }
);

app.delete(
  "/listas/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    let id = req.params.id;

    let estadoActualizado = {
      activo: false,
    };

    Lista.findByIdAndUpdate(
      id,
      estadoActualizado,
      { new: true },
      (err, listaBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!listaBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Lista no encontrada",
            },
          });
        }

        res.json({
          ok: true,
          lista: listaBorrado,
        });
      }
    );
  }
);

module.exports = app;
