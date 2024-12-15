const mongoose = require('mongoose');

const reservacionSchema = new mongoose.Schema({
  numeroMesa: { type: Number, required: true },
  reservadoPor: { type: String, required: true },
  fecha: { type: String, required: true },
  hora: { type: String, required: true },
  estaReservada: { type: Boolean, required: true, default: true } // Cambiado el default a true
});

module.exports = mongoose.model('Reservacion', reservacionSchema);