const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },

    correo: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    contraseña: {
        type: String,
        required: true
    },

    id_rol: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rol',
        required: true
    }
});

module.exports = mongoose.model('Usuario', usuarioSchema);