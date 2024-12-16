const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    comentario: { type: String, required: true },
    estrellas: { type: Number, default: 5, min: 1, max: 5 },
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comentario', comentarioSchema);

