const Express = require('express');
const router = Express.Router();
const usuario_modelo = require('../models/usuarios');
const centro_modelo = require('../models/centro');
const interaccion_modelo = require('../models/interaccion');
const db = require('../config/database');
const Sequelize = require('sequelize');
const nodemailer = require('nodemailer');
const os = require('os');
//Variable general del usuario
var usuario_sesion;
var centro_sesion;
var nota_valoracion;
var ip_ssoo = os.networkInterfaces();
var usuario_ssoo = os.userInfo().username;
var ip_usuario = new Map();

//Obtenemos la dirección MAC de la tarjeta de red del usuario.
Object.keys(ip_ssoo).forEach((claves)=>{
    ip_ssoo['Wi-Fi'].map((address)=>{
        ip_usuario.set('ipUsuario',address.mac);
    });
});

//Controladores de los modelos
const indexControlador = require('../controllers/indexController');
const busquedaControlador = require('../controllers/busquedaController');
const recuperacionControlador = require('../controllers/recuperacionController');
const informacionControlador = require('../controllers/informacionController');


//exportamos las rutas y así acceder a estas.
module.exports = () => {

    //RUTA INDEX
    router.get('/', indexControlador.rutaIndex);

    //RUTA BUSQUEDA
    router.get('/busqueda', busquedaControlador.rutaBusqueda);

    
    //RUTA DE INFORMACIÓN DE TÉRMINOS Y CONDICIONES
    router.get('/informacion',informacionControlador.rutaInformacion);


    //RUTA DE RECUPERACIÓN DE CUENTA
    router.get('/usuario/:id',recuperacionControlador.recuperarRuta);


    //Formulario de recuperación de contraseña
    router.post('/usuario/:id',recuperacionControlador.actualizarContrasena);


    //Formulario de Inicio
    router.post('/', indexControlador.operacionesIndex);

    //Formulario de Búsqueda
    router.post('/busqueda',busquedaControlador.operacionesBusqueda);

    return router;
}