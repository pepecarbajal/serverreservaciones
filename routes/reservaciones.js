const express = require('express');
const Reservacion = require('../models/Reservacion'); // Asegúrate de que la ruta del modelo sea correcta

const router = express.Router();


// Guardar una nueva reservación
router.post('/', async (req, res) => {
    try {
        const { numeroMesa, reservadoPor, fecha, hora, estaReservada } = req.body;

        // Validaciones
        if (!numeroMesa || typeof numeroMesa !== 'number' || numeroMesa <= 0) {
            return res.status(400).json({ error: "El número de mesa es obligatorio y debe ser un número mayor a 0." });
        }

        if (!reservadoPor || typeof reservadoPor !== 'string' || reservadoPor.trim().length === 0) {
            return res.status(400).json({ error: "El nombre de la persona que reservó es obligatorio y debe ser válido." });
        }

        if (!fecha || isNaN(new Date(fecha).getTime())) {
            return res.status(400).json({ error: "La fecha es obligatoria y debe ser válida." });
        }

        const horaRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/; // Formato HH:mm
        if (!hora || !horaRegex.test(hora)) {
            return res.status(400).json({ error: "La hora es obligatoria y debe estar en el formato HH:mm." });
        }

        if (typeof estaReservada !== 'boolean') {
            return res.status(400).json({ error: "El estado de la reservación (estaReservada) debe ser un valor booleano." });
        }

        // Crear la nueva reservación
        const nuevaReservacion = new Reservacion({ numeroMesa, reservadoPor, fecha, hora, estaReservada });
        const reservacionGuardada = await nuevaReservacion.save();

        res.status(201).json(reservacionGuardada);
    } catch (error) {
        res.status(500).json({ error: "Error al guardar la reservación: " + error.message });
    }
});

// Eliminar una reservación por ID
router.delete('/:id', async (req, res) => {
    try {
        const reservacionEliminada = await Reservacion.findByIdAndDelete(req.params.id);

        if (!reservacionEliminada) {
            return res.status(404).json({ error: 'Reservación no encontrada' });
        }

        res.status(200).json({ message: 'Reservación eliminada' });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la reservación: " + error.message });
    }
});



router.get('/', async (req, res) => {
    const { fecha, hora } = req.query;

    // Validaciones para la fecha y hora
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/; // Formato YYYY-MM-DD
    if (!fecha || !fechaRegex.test(fecha)) {
        return res.status(400).json({ error: 'La fecha es requerida y debe estar en el formato YYYY-MM-DD.' });
    }

    const horaRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/; // Formato HH:mm
    if (!hora || !horaRegex.test(hora)) {
        return res.status(400).json({ error: 'La hora es requerida y debe estar en el formato HH:mm.' });
    }

    try {
        // Buscar reservaciones que coincidan exactamente con la fecha y hora
        const reservacionesEnHorario = await Reservacion.find({ fecha, hora });

        // Lista de todas las mesas (ajustar según la lógica de tu sistema)
        const todasLasMesas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        // Extraer los números de las mesas reservadas
        const mesasReservadas = reservacionesEnHorario.map(reservacion => reservacion.numeroMesa);

        // Filtrar las mesas disponibles
        const mesasDisponibles = todasLasMesas.filter(mesa => !mesasReservadas.includes(mesa));

        res.status(200).json({ mesasDisponibles });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las mesas disponibles: " + error.message });
    }
});


// Eliminar una reservación por su ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validar que el ID de la reservación esté presente y sea válido
        if (!id) {
            return res.status(400).json({ error: "El ID de la reservación es obligatorio." });
        }

        // Eliminar la reservación de la base de datos
        const reservacionEliminada = await Reservacion.findByIdAndDelete(id);

        if (!reservacionEliminada) {
            return res.status(404).json({ error: "Reservación no encontrada." });
        }

        res.status(200).json({ message: "Reservación eliminada exitosamente.", reservacionEliminada });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la reservación: " + error.message });
    }
});

router.post('/user', async (req, res) => {
    try {
        const { nombre } = req.body;

        // Validar que el nombre esté presente y sea válido
        if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
            return res.status(400).json({ error: "El nombre del usuario es obligatorio y debe ser válido." });
        }

        // Buscar reservaciones realizadas por el usuario
        const reservacionesUsuario = await Reservacion.find({ reservadoPor: nombre });

        if (reservacionesUsuario.length === 0) {
            return res.status(404).json({ error: "No se encontraron reservaciones para el usuario proporcionado." });
        }

        res.status(200).json(reservacionesUsuario);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las reservaciones del usuario: " + error.message });
    }
});




module.exports = router;
