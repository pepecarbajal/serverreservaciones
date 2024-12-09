const express = require('express');
const Usuario = require('../models/Usuario'); // Asegúrate de que la ruta del modelo sea correcta

const router = express.Router();


router.post('/', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        // Validaciones
        if (!correo || !contrasena) {
            return res.status(400).json({ error: "El correo y la contraseña son obligatorios." });
        }

        // Validar formato de correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            return res.status(400).json({ error: "El correo electrónico no tiene un formato válido." });
        }

        // Validar longitud de la contraseña
        if (contrasena.length < 6) {
            return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres." });
        }

        // Validar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ email: correo });
        if (usuarioExistente) {
            return res.status(400).json({ error: "El correo electrónico ya está registrado." });
        }

        // Crear un nuevo usuario
        const nuevoUsuario = new Usuario(req.body);
        const usuarioGuardado = await nuevoUsuario.save();

        res.status(201).json(usuarioGuardado);
    } catch (error) {
        res.status(500).json({ error: "Ocurrió un error en el servidor: " + error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        // Validaciones
        if (!correo || !contrasena) {
            return res.status(400).json({ error: "El correo y la contraseña son obligatorios." });
        }

        // Buscar el usuario en la base de datos por correo
        const usuario = await Usuario.findOne({ correo: correo });

        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        // Comparar la contraseña proporcionada con la almacenada
        if (usuario.contrasena !== contrasena) {
            return res.status(401).json({ error: "Contraseña incorrecta." });
        }

        // Devolver los datos del usuario
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ error: "Ocurrió un error en el servidor: " + error.message });
    }
});

// Eliminar un usuario por ID
router.delete('/:id', async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
