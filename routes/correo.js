// routes/correo.js
const express = require('express');
const sgMail = require('@sendgrid/mail');
const router = express.Router();

sgMail.setApiKey(process.env.SGKEY);

router.post('/correo', async (req, res) => {
    const { to, message } = req.body;
    const subject = "Restaurante Don Antonio";

    if (!to || !message) {
        return res.status(400).send("Faltan parámetros 'to' o 'message'");
    }

    const msg = {
        to,
        from: process.env.CORREO,
        subject,
        // Aquí usamos 'content' en lugar de 'message'
        content: [
            {
                type: 'text/html',   // o 'text/plain' dependiendo de lo que quieras enviar
                value: message,      // El contenido HTML o texto
            },
        ],
    };

    try {
        await sgMail.send(msg);
        res.sendStatus(204);
    } catch (e) {
        console.error(e.response?.body?.errors || e);
        const messages = e.response?.body?.errors
            ?.map(err => err.message)
            .join(' ') || "Error al enviar el correo";
        res.status(400).send(messages);
    }
});

module.exports = router;
