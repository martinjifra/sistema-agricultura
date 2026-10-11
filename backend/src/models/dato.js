const mongoose = require('mongoose');

const datoSchema = new mongoose.Schema({
    dato: {
        type: Number,
        required: true
    },

    unidad: {
        type: String,
        required: true,
        enum: ['°C', '%']
    },

    fecha_hora: {
        type: Date,
        required: true
    },

    id_sensor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sensor',
        required: true
    }
}, {
    collection: 'datos'
});

module.exports = mongoose.model('Dato', datoSchema);