const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");

const Usuario = require("../modelos/usuario");
const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const app = express();

//Ruta GET
// app.get("/usuarios", [verificaToken, verificaAdmin_role], function (req, res) {

app.get("/usuarios", function (req, res) {
  let desde = req.query.desde || 0;
  desde = Number(desde);
  let limite = req.query.limite || 500;
  limite = Number(limite);

  // res.json("GET usuarios");
  Usuario.find({ activo: true })
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Usuario.countDocuments({ activo: true }, (err, conteo) => {
        res.json({
          ok: true,
          usuarios,
          cantidad: conteo,
        });
      });
    });
});

// app.get(
//   "/usuarios/:id",
//   [verificaToken, verificaAdmin_role],

//sin verificar token
app.get("/usuarios/:id", function (req, res) {
  let id = req.params.id;
  // res.json("GET usuarios");
  Usuario.findById(id).exec((err, usuario) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      usuario,
    });
  });
});

//Ruta POST
app.post("/usuarios", function (req, res) {
  // res.json('POST usuarios')
  let body = req.body;

  let usuario = new Usuario({
    nombres: body.nombres,
    apellidos: body.apellidos,
    dni: body.dni,
    email: body.email,
    avatar: body.avatar,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
    activo: true,
    // idempresa: req.empresa._id,
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB,
    });
  });
});

//Ruta PUT
app.put(
  "/usuarios/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    let body = _.pick(req.body, [
      "nombre",
      "apellido",
      "dni",
      "email",
      "avatar",
      "role",
    ]);
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        usuario: usuarioDB,
      });
    });
  }
);

//Ruta Delete
app.delete(
  "/usuarios/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    // res.json("DELETE usuarios");
    let id = req.params.id;

    let estadoActualizado = {
      activo: false,
    };

    Usuario.findByIdAndUpdate(
      id,
      estadoActualizado,
      { new: true },
      (err, usuarioBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!usuarioBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Usuario no encontrado",
            },
          });
        }
        res.json({
          ok: true,
          usuario: usuarioBorrado,
        });
      }
    );
  }
);

module.exports = app;
