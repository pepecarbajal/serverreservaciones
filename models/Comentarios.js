const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    comentario: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comentario', comentarioSchema);

