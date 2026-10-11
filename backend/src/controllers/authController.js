const Usuario = require('../models/usuario');
const Rol = require('../models/rol');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

console.log('Modelo Usuario:', Usuario.modelName);
console.log('findOne:', typeof Usuario.findOne);

const registrar = async (req, res) => {
    try {
        const { nombre, correo, contraseña, rol } = req.body;

        if (!nombre || !correo || !contraseña || !rol) {
            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            });
        }

        if (!['administrador', 'visualizador'].includes(rol)) {
            return res.status(400).json({
                message: 'Rol no válido'
            });
        }

        const usuarioExistente = await Usuario.findOne({
            correo: correo.toLowerCase()
        });

        if (usuarioExistente) {
            return res.status(409).json({
                message: 'El correo ya está registrado'
            });
        }

        const rolEncontrado = await Rol.findOne({
            nombre: rol
        });

        if (!rolEncontrado) {
            return res.status(400).json({
                message: 'El rol no existe'
            });
        }

        const contraseñaCifrada = await bcrypt.hash(contraseña, 10);

        const nuevoUsuario = new Usuario({
            nombre,
            correo,
            contraseña: contraseñaCifrada,
            id_rol: rolEncontrado._id
        });

        await nuevoUsuario.save();

        return res.status(201).json({
            message: 'Usuario registrado correctamente',
            usuario: {
                id: nuevoUsuario._id,
                nombre: nuevoUsuario.nombre,
                correo: nuevoUsuario.correo,
                rol: rolEncontrado.nombre
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { correo, contraseña } = req.body;

        if (!correo || !contraseña) {
            return res.status(400).json({
                message: 'Correo y contraseña son obligatorios'
            });
        }

        const usuario = await Usuario
            .findOne({ correo: correo.toLowerCase() })
            .populate('id_rol');

        if (!usuario) {
            return res.status(401).json({
                message: 'Correo o contraseña incorrectos'
            });
        }

        const contraseñaCorrecta = await bcrypt.compare(
            contraseña,
            usuario.contraseña
        );

        if (!contraseñaCorrecta) {
            return res.status(401).json({
                message: 'Correo o contraseña incorrectos'
            });
        }

        const token = jwt.sign(
            {
                id: usuario._id,
                rol: usuario.id_rol.nombre
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '2h'
            }
        );

        return res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.id_rol.nombre
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    registrar,
    login
};