const express = require("express");
const Empresa = require("../modelos/empresa");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const _ = require("underscore");
const app = express();

app.get("/empresas", function (req, res) {
  // res.json("GET usuarios");

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 500;
  limite = Number(limite);

  Empresa.find({ activo: true })
    .limit(limite)
    .skip(desde)
    .sort("razonsocial") //ordenar alfabeticamente
    .populate({
      path: "localidad",
      populate: { path: "provincia" },
    })
    .populate("condicioniva")

    // .populate({ path: "condicioniva")
    // .populate({"localidad", "localidad codigopostal", populate:{"provincia", "provincia"}})
    // .populate("razonsocial")
    .exec((err, empresas) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Empresa.countDocuments({ activo: true }, (err, conteo) => {
        res.json({
          ok: true,
          empresas,
          cantidad: conteo,
        });
      });
    });
});

app.get("/empresas/:id", function (req, res) {
  // res.json("GET usuarios");

  let id = req.params.id;

  Empresa.findById(id).exec((err, empresas) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      empresas,
    });
  });
});

//LO COMENTADO ES CON VERIFICACION DE TOKEN
// app.post("/empresas", [verificaToken, verificaAdmin_role], function (req, res) {
app.post("/empresas", [verificaToken, verificaAdmin_role], function (req, res) {
 // res.json('POST usuarios')

  let body = req.body;

  let empresa = new Empresa({
    razonsocial: body.razonsocial,
    domicilio: body.domicilio,
    telefono: body.telefono,
    cuit: body.cuit,
    email: body.email,
    localidad: body.localidad,
    condicioniva: body.condicioniva,
    activo: body.activo,
    usuario: req.usuario._id,
  });

  empresa.save((err, empresaDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      empresa: empresaDB,
    });
  });
});
app.put(
  "/empresas/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    // res.json("PUT usuarios");
    let id = req.params.id;
    let body = req.body;

    Empresa.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true },
      (err, empresaDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        res.json({
          ok: true,
          empresa: empresaDB,
        });
      }
    );
  }
);

app.delete(
  "/empresas/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    let id = req.params.id;

    let estadoActualizado = {
      activo: false,
    };

    Empresa.findByIdAndUpdate(
      id,
      estadoActualizado,
      { new: true },
      (err, empresaBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!empresaBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Empresa no encontrada",
            },
          });
        }

        res.json({
          ok: true,
          empresa: empresaBorrado,
        });
      }
    );
  }
);

module.exports = app;
