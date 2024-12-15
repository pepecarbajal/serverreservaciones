const express = require('express');
const Comentario = require('../models/Comentarios');

const router = express.Router();

router.post('/comentar', async (req, res) => {
    try {
        const { nombre, comentario } = req.body;

        const nuevoComentario = new Comentario({ nombre, comentario });
        await nuevoComentario.save();

        res.status(201).json({ message: 'Comentario registrado exitosamente', data: nuevoComentario });
    } catch (error) {
        console.error('Error al registrar comentario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/comentarios', async (req, res) => {
    try {
        const comentarios = await Comentario.find();
        res.status(200).json(comentarios);
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;

