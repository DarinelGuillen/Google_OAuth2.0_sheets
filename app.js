// app.js
const express = require('express');
const app = express();
const PORT = 3000;
require('dotenv').config();

// Servir archivos estáticos
app.use(express.static('.'));

// Endpoint para proporcionar el CLIENT_ID de forma segura
app.get('/config', (req, res) => {
    res.json({
        CLIENT_ID: process.env.CLIENT_ID,
        SCOPES: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets',
    });
});

app.listen(PORT, () => {
    console.log(`App running at http://localhost:${PORT}`);
});
