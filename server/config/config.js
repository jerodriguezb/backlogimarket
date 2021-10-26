//Port
process.env.PORT = process.env.PORT || 3004;

//La firma del token
process.env.SEED = process.env.SEED || "esta_es_la_firma";

//La fecha de expiracion del token
process.env.EXPIRACION = "48h";

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

let urlDB;

if (process.env.MODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/logimarket2";
} else {
  //urlDB = process.env.MONGO_URI;
  urlDB = "mongodb://localhost:27017/logimarket2";
}

process.env.URLDB = urlDB;

//"mongodb://cc40df585d057fdd63c20ed9414b027f:kaka8596@12a.mongo.evennode.com:27018/cc40df585d057fdd63c20ed9414b027f";

//"mongodb://cc40df585d057fdd63c20ed9414b027f:kaka8596@12a.mongo.evennode.com:27018,12b.mongo.evennode.com:27018/52f8f3c80ee6733ef1b477e6216e5877?authSource=cc40df585d057fdd63c20ed9414b027f&replicaSet=us-12%22%20-u%2052f8f3c80ee6733ef1b477e6216e5877&readPreference=primary&appname=MongoDB%20Compass&ssl=false";

//"mongodb+srv://user:kakaroto@cluster0.47bwt.mongodb.net/academy";
