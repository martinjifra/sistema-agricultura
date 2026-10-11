const mongoose = require('mongoose');

const rolSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        enum: ['administrador', 'visualizador']
    }
});

module.exports = mongoose.model('Rol', rolSchema);