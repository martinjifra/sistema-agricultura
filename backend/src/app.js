const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const datoRoutes = require('./routes/datoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/sensores', sensorRoutes);

app.use('/api/datos', datoRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'API del sistema de agricultura funcionando correctamente'
    });
});

module.exports = app;