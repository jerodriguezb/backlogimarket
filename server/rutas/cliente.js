const express = require("express");
const Cliente = require("../modelos/cliente");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const _ = require("underscore");
const app = express();

app.get("/clientes", function (req, res) {
  // res.json("GET usuarios");

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 500;
  limite = Number(limite);

  Cliente.find({ activo: true })
    .limit(limite)
    .skip(desde)
    .sort("razonsocial") //ordenar alfabeticamente
    .populate({
      path: "localidad",
      populate: { path: "provincia" },
    })
    .populate("condicioniva")
    .populate("ruta")

    // .populate({ path: "condicioniva")
    // .populate({"localidad", "localidad codigopostal", populate:{"provincia", "provincia"}})
    // .populate("razonsocial")
    .exec((err, clientes) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Cliente.countDocuments({ activo: true }, (err, conteo) => {
        res.json({
          ok: true,
          clientes,
          cantidad: conteo,
        });
      });
    });
});

app.get("/clientes/:id", function (req, res) {
  // res.json("GET usuarios");

  let id = req.params.id;

  Cliente.findById(id).exec((err, clientes) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      clientes,
    });
  });
});

//LO COMENTADO ES CON VERIFICACION DE TOKEN
// app.post("/clientes", [verificaToken, verificaAdmin_role], function (req, res) {
app.post("/clientes", function (req, res) {
  // res.json('POST usuarios')

  let body = req.body;

  let cliente = new Cliente({
    codcli: body.codcli,
    razonsocial: body.razonsocial,
    domicilio: body.domicilio,
    telefono: body.telefono,
    cuit: body.cuit,
    email: body.email,
    localidad: body.localidad,
    condicioniva: body.condicioniva,
    ruta: body.ruta,
    activo: body.activo,
    // usuario: req.Usuario._id, //probar si graba
  });

  cliente.save((err, clienteDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      cliente: clienteDB,
    });
  });
});
app.put(
  "/clientes/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    // res.json("PUT usuarios");
    let id = req.params.id;
    let body = req.body;

    Cliente.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true },
      (err, clienteDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        res.json({
          ok: true,
          cliente: clienteDB,
        });
      }
    );
  }
);

app.delete(
  "/clientes/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    let id = req.params.id;

    let estadoActualizado = {
      activo: false,
    };

    Cliente.findByIdAndUpdate(
      id,
      estadoActualizado,
      { new: true },
      (err, clienteBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!clienteBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Cliente no encontrado",
            },
          });
        }

        res.json({
          ok: true,
          cliente: clienteBorrado,
        });
      }
    );
  }
);

module.exports = app;
