const express = require("express");
const Curso = require("../modelos/curso");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const _ = require("underscore");
const app = express();

app.get("/cursos", function (req, res) {
  // res.json("GET usuarios");

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  Curso.find({ estado: true })
    .limit(limite)
    .skip(desde)
    .sort("title") //ordenar alfabeticamente
    .populate("usuario", "nombre email")
    .exec((err, cursos) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Curso.countDocuments({ estado: true }, (err, conteo) => {
        res.json({
          ok: true,
          cursos,
          cantidad: conteo,
        });
      });
    });
});

app.get("/cursos/:id", function (req, res) {
  // res.json("GET usuarios");

  let id = req.params.id;

  Curso.findById(id).exec((err, curso) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      curso,
    });
  });
});

app.post("/cursos", [verificaToken, verificaAdmin_role], function (req, res) {
  // res.json('POST usuarios')

  let body = req.body;

  let curso = new Curso({
    title: body.title,
    imagen: body.imagen,
    detalle: body.detalle,
    video: body.video,
    img_mentor: body.img_mentor,
    mentor: body.mentor,
    usuario: req.usuario._id,
  });

  curso.save((err, cursoDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      curso: cursoDB,
    });
  });
});
app.put(
  "/cursos/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    // res.json("PUT usuarios");
    let id = req.params.id;
    let body = req.body;

    Curso.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true },
      (err, cursoDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        res.json({
          ok: true,
          curso: cursoDB,
        });
      }
    );
  }
);

app.delete(
  "/cursos/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    let id = req.params.id;

    let estadoActualizado = {
      estado: false,
    };

    Curso.findByIdAndUpdate(
      id,
      estadoActualizado,
      { new: true },
      (err, cursoBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!cursoBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Curso no encontrado",
            },
          });
        }

        res.json({
          ok: true,
          curso: cursoBorrado,
        });
      }
    );
  }
);

module.exports = app;
