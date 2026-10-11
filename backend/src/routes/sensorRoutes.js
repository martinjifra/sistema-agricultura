const express = require('express');

const {
    crearSensor,
    listarSensores,
    obtenerSensor,
    actualizarSensor,
    eliminarSensor
} = require('../controllers/sensorController');

const router = express.Router();

router.post('/', crearSensor);

router.get('/', listarSensores);

router.get('/:id', obtenerSensor);

router.put('/:id', actualizarSensor);

router.delete('/:id', eliminarSensor);

module.exports = router;