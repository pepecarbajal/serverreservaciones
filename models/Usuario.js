const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombreCompleto: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  telefono: { type: String, required: true },
  administrador: { type: Boolean, default: false },
});

module.exports = mongoose.model('Usuario', usuarioSchema);
