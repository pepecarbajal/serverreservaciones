const express = require('express');
const Comentario = require('../models/Comentarios');

const router = express.Router();

// Crear un nuevo comentario
router.post('/comentar', async (req, res) => {
  try {
    const { nombre, comentario, estrellas } = req.body;

    if (!nombre || !comentario) {
      return res.status(400).json({ error: "El nombre y el comentario son obligatorios." });
    }

    const estrellasNum = Number(estrellas);
    if (estrellas !== undefined && (isNaN(estrellasNum) || estrellasNum < 1 || estrellasNum > 5)) {
      return res.status(400).json({ error: "El número de estrellas debe ser entre 1 y 5." });
    }

    const nuevoComentario = new Comentario({ 
      nombre, 
      comentario, 
      estrellas: estrellas !== undefined ? estrellasNum : 5 // Usa 5 como valor predeterminado si no se proporciona
    });
    await nuevoComentario.save();

    res.status(201).json({ message: 'Comentario registrado exitosamente', data: nuevoComentario });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar comentario: ' + error.message });
  }
});

router.get('/comentarios', async (req, res) => {
  try {
    const comentarios = await Comentario.find().sort({ fecha: -1 });
    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener comentarios: ' + error.message });
  }
});

module.exports = router;

