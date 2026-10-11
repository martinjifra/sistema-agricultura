const express = require('express');

const {
    registrarDato,
    listarDatos,
    datosPorSensor
} = require('../controllers/datoController');

const router = express.Router();

router.post('/', registrarDato);

router.get('/', listarDatos);

router.get('/sensor/:id_sensor', datosPorSensor);

module.exports = router;