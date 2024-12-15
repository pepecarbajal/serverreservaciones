// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Rutas
const usuariosRoutes = require('./routes/usuarios');
const reservacionesRoutes = require('./routes/reservaciones');
const comentariosRoutes = require('./routes/comentarios');
const correoRoutes = require('./routes/correo');

app.use('/enviar', correoRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/reservaciones', reservacionesRoutes);
app.use('/comentarios', comentariosRoutes);


app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de Reservas!');
})

// Middleware para errores globales
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
});


// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
