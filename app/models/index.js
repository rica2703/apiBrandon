const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const   db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.Producto=require("./productos");
db.venta=require("./venta");
// db.role = require("./role.model");
// db.mensaje=require("./mensajes.model");


module.exports = db;