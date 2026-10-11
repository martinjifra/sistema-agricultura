const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    ubicacion: {
        type: String,
        required: true,
        trim: true
    },

    tipo_sensor: {
        type: String,
        required: true,
        enum: [
            'temperatura',
            'humedad',
            'luminosidad'
        ]
    },

    estado: {
        type: String,
        required: true,
        enum: [
            'activo',
            'inactivo'
        ],
        default: 'activo'
    }
}, {
    collection: 'sensores'
});

module.exports = mongoose.model('Sensor', sensorSchema);