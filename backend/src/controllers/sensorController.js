const Sensor = require('../models/sensor');

// CREAR SENSOR
const crearSensor = async (req, res) => {
    try {
        const {
            ubicacion,
            tipo_sensor,
            estado
        } = req.body;

        if (!ubicacion || !tipo_sensor) {
            return res.status(400).json({
                message: 'Ubicación y tipo de sensor son obligatorios'
            });
        }

        const tiposPermitidos = [
            'temperatura',
            'humedad',
            'luminosidad'
        ];

        if (!tiposPermitidos.includes(tipo_sensor)) {
            return res.status(400).json({
                message: 'Tipo de sensor no válido'
            });
        }

        const nuevoSensor = new Sensor({
            ubicacion,
            tipo_sensor,
            estado: estado || 'activo'
        });

        await nuevoSensor.save();

        return res.status(201).json({
            message: 'Sensor registrado correctamente',
            sensor: nuevoSensor
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Error al registrar el sensor',
            error: error.message
        });
    }
};


// LISTAR TODOS LOS SENSORES
const listarSensores = async (req, res) => {
    try {
        const sensores = await Sensor.find();

        return res.status(200).json(sensores);

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los sensores',
            error: error.message
        });
    }
};


// BUSCAR SENSOR POR ID
const obtenerSensor = async (req, res) => {
    try {
        const sensor = await Sensor.findById(req.params.id);

        if (!sensor) {
            return res.status(404).json({
                message: 'Sensor no encontrado'
            });
        }

        return res.status(200).json(sensor);

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener el sensor',
            error: error.message
        });
    }
};


// ACTUALIZAR SENSOR
const actualizarSensor = async (req, res) => {
    try {
        const {
            ubicacion,
            tipo_sensor,
            estado
        } = req.body;

        const sensor = await Sensor.findByIdAndUpdate(
            req.params.id,
            {
                ubicacion,
                tipo_sensor,
                estado
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!sensor) {
            return res.status(404).json({
                message: 'Sensor no encontrado'
            });
        }

        return res.status(200).json({
            message: 'Sensor actualizado correctamente',
            sensor
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al actualizar el sensor',
            error: error.message
        });
    }
};


// ELIMINAR SENSOR
const eliminarSensor = async (req, res) => {
    try {
        const sensor = await Sensor.findByIdAndDelete(req.params.id);

        if (!sensor) {
            return res.status(404).json({
                message: 'Sensor no encontrado'
            });
        }

        return res.status(200).json({
            message: 'Sensor eliminado correctamente'
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al eliminar el sensor',
            error: error.message
        });
    }
};


module.exports = {
    crearSensor,
    listarSensores,
    obtenerSensor,
    actualizarSensor,
    eliminarSensor
};