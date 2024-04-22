const mongoose = require("mongoose");

const Productos = mongoose.model(
  "Stock",
  new mongoose.Schema({
    codigo:String,
    nombre: String,
    precio: Number,
    cantidad:Number,
  })
);

module.exports = Productos;
