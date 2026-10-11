const Dato = require('../models/dato');
const Sensor = require('../models/sensor');

const registrarDato = async (req, res) => {
    try {
        const {
            dato,
            fecha_hora,
            id_sensor
        } = req.body;

        if (dato === undefined || !fecha_hora || !id_sensor) {
            return res.status(400).json({
                message: 'dato, fecha_hora e id_sensor son obligatorios'
            });
        }

        const sensor = await Sensor.findById(id_sensor);

        if (!sensor) {
            return res.status(404).json({
                message: 'Sensor no encontrado'
            });
        }

        if (sensor.estado !== 'activo') {
            return res.status(400).json({
                message: 'El sensor se encuentra inactivo'
            });
        }

        let unidad;

        if (sensor.tipo_sensor === 'temperatura') {
            unidad = '°C';
        } else if (
            sensor.tipo_sensor === 'humedad' ||
            sensor.tipo_sensor === 'luminosidad'
        ) {
            unidad = '%';
        } else {
            return res.status(400).json({
                message: 'Tipo de sensor no válido'
            });
        }

        if (
            (sensor.tipo_sensor === 'humedad' ||
                sensor.tipo_sensor === 'luminosidad') &&
            (dato < 0 || dato > 100)
        ) {
            return res.status(400).json({
                message: 'El porcentaje debe estar entre 0 y 100'
            });
        }

        const nuevoDato = new Dato({
            dato,
            unidad,
            fecha_hora,
            id_sensor
        });

        await nuevoDato.save();

        return res.status(201).json({
            message: 'Dato registrado correctamente',
            dato: {
                id: nuevoDato._id,
                tipo_sensor: sensor.tipo_sensor,
                ubicacion: sensor.ubicacion,
                dato: nuevoDato.dato,
                unidad: nuevoDato.unidad,
                fecha_hora: nuevoDato.fecha_hora,
                id_sensor: nuevoDato.id_sensor
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Error al registrar el dato',
            error: error.message
        });
    }
};


const listarDatos = async (req, res) => {
    try {
        const datos = await Dato
            .find()
            .populate(
                'id_sensor',
                'ubicacion tipo_sensor estado'
            )
            .sort({ fecha_hora: -1 });

        return res.status(200).json(datos);

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los datos',
            error: error.message
        });
    }
};


const datosPorSensor = async (req, res) => {
    try {
        const sensor = await Sensor.findById(req.params.id_sensor);

        if (!sensor) {
            return res.status(404).json({
                message: 'Sensor no encontrado'
            });
        }

        const datos = await Dato
            .find({
                id_sensor: req.params.id_sensor
            })
            .sort({
                fecha_hora: -1
            });

        return res.status(200).json({
            sensor: {
                id: sensor._id,
                ubicacion: sensor.ubicacion,
                tipo_sensor: sensor.tipo_sensor,
                estado: sensor.estado
            },
            datos
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los datos del sensor',
            error: error.message
        });
    }
};


module.exports = {
    registrarDato,
    listarDatos,
    datosPorSensor
};