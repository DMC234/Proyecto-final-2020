//Modelos
const usuario_modelo = require('../models/usuarios');
const centro_modelo = require('../models/centro');

//Controladores
const busquedaControlador = require('./busquedaController');
const recuperacionControlador = require('./recuperacionController');

//Variables Generales
var usuario_sesion;

//Funciones Generales
async function iniciarSesion(request,response){
    console.log(request.body.iniciar_sesion_nombre_usuario);
    if(request.body.iniciar_sesion_nombre_usuario.includes('@')){
        usuario_sesion = await usuario_modelo.findOne({where:{
            email:request.body.iniciar_sesion_nombre_usuario,
            pwd:request.body.iniciar_sesion_pwd
        }});
    }else{
        usuario_sesion = await usuario_modelo.findOne({where:{
            nombreUsuario:request.body.iniciar_sesion_nombre_usuario,
            pwd:request.body.iniciar_sesion_pwd
        }});
    }

    if(usuario_sesion == null){
        mensajeIndex(response,'NOMBRE DE USUARIO O CLAVE INCORRECTA');
    }else{
        busquedaControlador.obtenerSesionIndex(usuario_sesion);
        response.redirect('/busqueda');
    }
    console.log(usuario_sesion);
}

async function registrarUsuario(request,response){
    let comprobar_disponibilidad_email = await usuario_modelo.findOne({where:{correo:request.body.registro_email}});
    let comprobar_disponibilidad_usuario = await usuario_modelo.findOne({where:{nombreUsuario:request.body.registro_nombre_usuario}});

    if(comprobar_disponibilidad_email == null && comprobar_disponibilidad_usuario == null){
        usuario_sesion = await usuario_modelo.create({
            idUsuario: 0,
            nombreUsuario: request.body.registro_nombre_usuario,
            pwd: request.body.registro_pwd,
            nombreReal: request.body.registro_nombre_real,
            apellidoReal: request.body.registro_apellido_real,
            correo: request.body.registro_email,
            d_mac:null
        });
        mensajeIndex(response,'USUARIO REGISTRADO CORRECTAMENTE');
    }else{
        mensajeIndex(response,'EL CORREO O USUARIO YA SE ENCUENTRA REGISTRADO');
    }
    
}

function mensajeIndex(response,mensaje){
    response.render('index',{
        pagina:'Inicio',
        mensaje:mensaje
    });
}


//Funciones de exportación
exports.rutaIndex = (request, response) => {
    response.render('index', {
        pagina: 'Inicio',
        mensaje:null
    });
};

exports.operacionesIndex = (request, response) => {
    console.log('Hola desde POST');
    console.log(request.body);
    if (request.body.operacion == "REGISTRARSE") {
        console.log('dentro de registrarse');
        registrarUsuario(request,response);
    }else if(request.body.operacion == 'INICIAR SESIÓN'){
        console.log('dentro de iniciar sesión');
        iniciarSesion(request,response);
    }else if(request.body.operacion == 'RECUPERAR CUENTA'){
        console.log('dentro de recuperar cuenta');
        let estadoEmail = recuperacionControlador.enviarEmail(request.body.recuperacion_email);
        estadoEmail.then((estado)=>{
            if(estado == true){
                mensajeIndex(response,'CORREO ENVIADO CORRECTAMENTE');
            }else{
                mensajeIndex(response,'EL CORREO INTRODUCIDO NO ESTÁ REGISTRADO');
            }
        });
    }
};