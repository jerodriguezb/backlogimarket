const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");
require("./config/config");

const app = express();

//CORS
app.use(cors());

// app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(require("./rutas/index"));

mongoose.connect(
  process.env.URLDB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err, res) => {
    if (err) throw err;
    console.log("Base de datos online", process.env.URLDB);
  }
);

app.listen(process.env.PORT, () => {
  console.log("Escuchando en puerto", process.env.PORT);
});

//CODIGO EVENNODE

// var mongoPassword = "kaka8596";

// var http = require("http");
// var server = http.createServer(function (req, res) {
//   res.writeHead(200, { "Content-Type": "text/plain" });

//   //var config = JSON.parse(process.env.APP_CONFIG);
//   var MongoClient = require("mongodb").MongoClient;

//   MongoClient.connect(
//     "mongodb://" +
//       "cc40df585d057fdd63c20ed9414b027f" +
//       ":" +
//       encodeURIComponent(mongoPassword) +
//       "@" +
//       "mongodb:27018/cc40df585d057fdd63c20ed9414b027f",
//     function (err, db) {
//       if (!err) {
//         res.end("We are connected to MongoDB");
//       } else {
//         res.end("Error while connecting to MongoDB");
//       }
//     }
//   );
// });
// server.listen(process.env.PORT);
