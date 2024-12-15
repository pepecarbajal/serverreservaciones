const mongoose = require('mongoose');

// Definir el esquema
const comentarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    comentario: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
});

// Exportar el modelo
module.exports = mongoose.model('Comentario', comentarioSchema);
