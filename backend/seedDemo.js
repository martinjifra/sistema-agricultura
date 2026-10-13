require('dotenv').config({ path: './.env' });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const conectarDB = require('./src/config/db');
const crearRoles = require('./src/config/CrearRoles');
const Rol = require('./src/models/rol');
const Usuario = require('./src/models/usuario');
const Sensor = require('./src/models/sensor');
const Dato = require('./src/models/dato');

const usuariosDemo = require('./demo/usuarios.json');
const sensoresDemo = require('./demo/sensores.json');
const datosDemo = require('./demo/datos.json');

const obtenerUnidadPorTipo = (tipoSensor) => {
    if (tipoSensor === 'temperatura') return '°C';
    if (tipoSensor === 'humedad' || tipoSensor === 'luminosidad') return '%';
    throw new Error(`Tipo de sensor no soportado: ${tipoSensor}`);
};

const cargarUsuariosDemo = async () => {
    const resultados = [];

    for (const usuarioDemo of usuariosDemo) {
        const correo = (usuarioDemo.correo || '').toLowerCase();

        if (!correo || !usuarioDemo.nombre || !usuarioDemo.contraseña || !usuarioDemo.rol) {
            throw new Error('Usuario demo incompleto en usuarios.json');
        }

        const usuarioExistente = await Usuario.findOne({ correo });

        if (usuarioExistente) {
            resultados.push({ correo, accion: 'existente' });
            continue;
        }

        const rolEncontrado = await Rol.findOne({ nombre: usuarioDemo.rol });

        if (!rolEncontrado) {
            throw new Error(`No existe el rol: ${usuarioDemo.rol}`);
        }

        const contraseñaCifrada = await bcrypt.hash(usuarioDemo.contraseña, 10);

        await Usuario.create({
            nombre: usuarioDemo.nombre,
            correo,
            contraseña: contraseñaCifrada,
            id_rol: rolEncontrado._id
        });

        resultados.push({ correo, accion: 'creado' });
    }

    return resultados;
};

const cargarSensoresDemo = async () => {
    const mapaCodigo = new Map();

    for (const sensorDemo of sensoresDemo) {
        const clave = sensorDemo.codigo;

        if (!clave) {
            throw new Error('Sensor demo sin codigo en sensores.json');
        }

        const sensorExistente = await Sensor.findOne({
            ubicacion: sensorDemo.ubicacion,
            tipo_sensor: sensorDemo.tipo_sensor
        });

        if (sensorExistente) {
            mapaCodigo.set(clave, sensorExistente);
            continue;
        }

        const sensorCreado = await Sensor.create({
            ubicacion: sensorDemo.ubicacion,
            tipo_sensor: sensorDemo.tipo_sensor,
            estado: sensorDemo.estado || 'activo'
        });

        mapaCodigo.set(clave, sensorCreado);
    }

    return mapaCodigo;
};

const cargarDatosDemo = async (mapaCodigo) => {
    let contador = 0;

    for (const datoDemo of datosDemo) {
        if (!datoDemo.sensor_codigo || datoDemo.dato === undefined || !datoDemo.fecha_hora) {
            throw new Error('Dato demo incompleto en datos.json');
        }

        const sensor = mapaCodigo.get(datoDemo.sensor_codigo);

        if (!sensor) {
            throw new Error(`No se encontró el sensor para codigo: ${datoDemo.sensor_codigo}`);
        }

        const unidad = obtenerUnidadPorTipo(sensor.tipo_sensor);
        const fecha = new Date(datoDemo.fecha_hora);

        const datoExistente = await Dato.findOne({
            id_sensor: sensor._id,
            dato: datoDemo.dato,
            fecha_hora: fecha
        });

        if (datoExistente) {
            continue;
        }

        await Dato.create({
            dato: datoDemo.dato,
            unidad,
            fecha_hora: fecha,
            id_sensor: sensor._id
        });

        contador += 1;
    }

    return contador;
};

const ejecutarSeed = async () => {
    try {
        console.log('Conectando a MongoDB...');
        await conectarDB();
        console.log('MongoDB conectado');

        await crearRoles();
        console.log('Roles verificados');

        const usuarios = await cargarUsuariosDemo();
        console.log(`Usuarios demo cargados: ${usuarios.length}`);

        const mapaCodigo = await cargarSensoresDemo();
        console.log(`Sensores demo cargados: ${mapaCodigo.size}`);

        const datosCreados = await cargarDatosDemo(mapaCodigo);
        console.log(`Datos demo cargados: ${datosCreados}`);

        console.log('Dataset demo cargado correctamente');
    } catch (error) {
        console.error('Error al cargar el dataset demo:', error.message);
        throw error;
    } finally {
        await mongoose.connection.close();
        console.log('Conexión MongoDB cerrada');
    }
};

ejecutarSeed();
