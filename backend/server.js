require('dotenv').config();

const app = require('./src/app');
const conectarDB = require('./src/config/db');
const crearRoles = require('./src/config/CrearRoles');
const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
    try {
        await conectarDB();

        // Crear roles si todavía no existen
        await crearRoles();

        app.listen(PORT, () => {
            console.log(`Servidor funcionando en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
};

iniciarServidor();