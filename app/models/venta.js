const mongoose = require("mongoose");

const Venta = mongoose.model(
    "Venta",
    new mongoose.Schema({
        productos: String,
        fecha: Date,
        total: Number,
        hora: String,
        usuario:String

    })
);

module.exports = Venta;