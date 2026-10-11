const Rol = require('../models/rol');

const crearRoles = async () => {
    try {
        const roles = ['administrador', 'visualizador'];

        for (const nombre of roles) {
            const rolExistente = await Rol.findOne({ nombre });

            if (!rolExistente) {
                await Rol.create({ nombre });
                console.log(`Rol creado: ${nombre}`);
            }
        }

        console.log('Roles verificados correctamente');

    } catch (error) {
        console.error('Error al crear los roles:', error.message);
        throw error;
    }
};

module.exports = crearRoles;