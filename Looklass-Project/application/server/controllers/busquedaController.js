//Modelos
const usuario_modelo = require('../models/usuarios');
const centro_modelo = require('../models/centro');
const interaccion_modelo = require('../models/interaccion');
const db = require('../config/database');
const Sequelize = require('sequelize');
const nodemailer = require('nodemailer');

//Controladores
const busquedaControlador = require('./busquedaController');
const recuperacionControlador = require('./recuperacionController');


//Algoritmos propios
Array.prototype.unique = function(){
    return this.filter((valor,indice,propiamatriz)=>{
        return propiamatriz.indexOf(valor) === indice;
    });
}

Array.prototype.clear = function(){
    return this.splice(0,this.length);
}

//Variables Generales
var usuario_sesion;
var centro_sesion;
var tematica_resultados = new Array();
var rating_n_centro = new Array();
var rating_n_valoracion = new Array();
var rating_n_visitas = new Array();

//Funciones Generales

//FUNCIÓN PARA BUSCAR CENTROS POR VALORACIÓN Y CARGAR MEDIA DE VALORACIÓN Y SUMA DE VISITAS.
async function buscarRating(response, valoracion, fila_recorrido){

    console.log('dentro de la función de buscar rating');

    if(fila_recorrido == undefined || fila_recorrido == null){
        fila_recorrido = await db.query('SELECT DISTINCT(numeroCentro) FROM interaccion',{type:Sequelize.QueryTypes.SELECT});
    }else{
        fila_recorrido = await fila_recorrido;
    }
    let consulta_valoracion;
    let consulta_visitas;
    let media_valoracion;
    let media_visitas;

    for(let i = 0; i < fila_recorrido.length; i++){
        console.log(fila_recorrido[i].numeroCentro);
        consulta_valoracion = await db.query(`SELECT AVG(valoracion) as n_estrellas FROM interaccion WHERE numeroCentro = ${fila_recorrido[i].numeroCentro}`,
        {type:Sequelize.QueryTypes.SELECT});
        consulta_visitas = await db.query(`SELECT SUM(visita) as n_visitas FROM interaccion WHERE numeroCentro = ${fila_recorrido[i].numeroCentro}`,
        {type:Sequelize.QueryTypes.SELECT});
        media_valoracion = Math.round(parseFloat(consulta_valoracion[0].n_estrellas).toFixed(1));
        media_visitas = consulta_visitas[0].n_visitas;

        console.log(media_valoracion);
        console.log(media_visitas);

        if(valoracion == undefined || valoracion == null){
            rating_n_centro.push(fila_recorrido[i].numeroCentro);
            if(media_visitas == null || media_valoracion == null){
                rating_n_valoracion.push(0);
                rating_n_visitas.push(0);
            }else{
                rating_n_valoracion.push(media_valoracion);
                rating_n_visitas.push(media_visitas);
            }
        }else{
            if(media_valoracion == valoracion){
                rating_n_centro.push(fila_recorrido[i].numeroCentro);
                rating_n_valoracion.push(media_valoracion);
                rating_n_visitas.push(media_visitas);
            }
        }
    }

    centro_sesion = await centro_modelo.findAll({where:{numeroCentro:rating_n_centro}});
    centro_sesion.forEach((contenido)=>console.log(contenido.nombreCentro));

    return redirigirError(response,centro_sesion,'NO HAY RESULTADOS');
}

//FUNCIÓN PARA BUSCAR CENTROS POR TEMÁTICA
async function buscarTematica(response, tematica, fila_recorrido){

    let tematica_normalizada = tematica.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    console.log(tematica_normalizada);

    if(fila_recorrido == undefined || fila_recorrido == null){
        fila_recorrido = await centro_modelo.findAll();
    }else{
        fila_recorrido = await fila_recorrido;
    }
    
    for(let i = 0; i < fila_recorrido.length; i++){
        let fila_tematica = fila_recorrido[i].tematica;
        if(fila_tematica.includes(tematica_normalizada,0)){
            console.log('lo incluye');
            tematica_resultados.push(fila_tematica);
        }else{
            console.log('no lo incluye');
        }
    }
    centro_sesion = await centro_modelo.findAll({where:{tematica:tematica_resultados}});
    //Se vacía el arreglo con los numeros de los centros tras cada consulta
    tematica_resultados.clear();

    return redirigirError(response,centro_sesion,'NO HAY RESULTADOS');
}

//FUNCIÓN PARA BUSCAR CENTROS POR LOCALIZACIÓN
async function buscarLocalizacion(response, localizacion){
    centro_sesion = await centro_modelo.findAll({where:{localizacion}});
    return redirigirError(response,centro_sesion,'NO HAY RESULTADOS');
}
 
//FUNCIÓN PARA VISITAR EL CENTRO Y CONTAR LA VISITA
async function visitarCentro(response, enlaceCentro){

    console.log('ENTRADA AL MÉTODO DE CONTAR VISITA');
    if(usuario_sesion != null){
        centro_sesion = await centro_modelo.findOne({where:{enlace:enlaceCentro}});
        let interaccion_sesion = await interaccion_modelo.findOne({where:{
            idUsuario:usuario_sesion.idUsuario,
            numeroCentro:centro_sesion.numeroCentro
        }});

        if(interaccion_sesion != null){
            console.log('la visita ya cuenta');
        }else{
         let compensar_nota = await interaccion_modelo.findOne({where:{numeroCentro:centro_sesion.numeroCentro}});
           console.log(compensar_nota);
         if(compensar_nota == null){
            await interaccion_modelo.create({
                idUsuario:usuario_sesion.idUsuario,
                visita:1,
                valoracion:0,
                numeroCentro:centro_sesion.numeroCentro
            });
         }else{
            await interaccion_modelo.create({
                idUsuario:usuario_sesion.idUsuario,
                visita:1,
                valoracion:compensar_nota.valoracion,
                numeroCentro:centro_sesion.numeroCentro
            });
         }
        } 
    }
    //redirigimos al usuario al centro buscado.
    response.redirect(enlaceCentro);
}
//FUNCIÓN PARA VALORAR EL CENTRO CON UNA NOTA
async function valorarCentro(response, notaCentro, idCentro){
    centro_sesion = await centro_modelo.findOne({where:{numeroCentro:idCentro}});
    let fila_centro = await interaccion_modelo.findOne({where:{numeroCentro:idCentro,idUsuario:usuario_sesion.idUsuario}});
    let consulta;
    if(fila_centro == null){
        mensajeBusqueda(response,'DEBES VISITAR PRIMERO EL CENTRO ANTES DE VALORARLO',null);
    }else{
        console.log(usuario_sesion.idUsuario);
        consulta = await db.query(`UPDATE interaccion set valoracion = ${notaCentro} where numeroCentro = ${idCentro} AND idUsuario = ${usuario_sesion.idUsuario}`);
        mensajeBusqueda(response,`CENTRO ${centro_sesion.nombreCentro} VALORADO EN ${notaCentro} ESTRELLAS`,null);
    }
}

//FUNCIÓN DE REDIRECCIÓN A LA PÁGINA DE BÚSQUEDA, CON LOS PARÁMETROS.
async function mensajeBusqueda(response, mensaje, centro_filas){
    response.render('busqueda',{
        pagina:'Busqueda',
        centros:await centro_filas,
        usuario:usuario_sesion,
        aviso:mensaje,
        valoracion:rating_n_valoracion,
        visitas:rating_n_visitas
    });
    //limpiamos valoraciones, visitas y numeros de centros
    rating_n_centro.clear();rating_n_valoracion.clear();rating_n_visitas.clear();
}

function redirigirError(response,fila_recorrido,mensaje){
    if(fila_recorrido.length == 0 || fila_recorrido == undefined){
        mensajeBusqueda(response,mensaje,null);
    }else{
        return fila_recorrido;
    }
}

//Funciones de exportación
exports.obtenerSesionIndex = function(usuario_sesion_index){
    usuario_sesion = usuario_sesion_index;
}

exports.rutaBusqueda = (request, response) => {
    console.log(request.query);
        if(request.query.operacion == 'salir_sesion'){
            usuario_sesion = null;
            response.redirect('/');
        }else if(request.query.operacion == 'visitar'){
            console.log('dentro de visitar');
            let enlace = request.query.r;
            visitarCentro(response, enlace);
        }else if(request.query.operacion == 'tendencia'){
            console.log('dentro de tendencias');
            console.log(request.query);
            let tendencia = request.query.tematica_centro;
            let centro_tendencia = buscarTematica(response,tendencia,undefined);
            centro_sesion = buscarRating(response,null,centro_tendencia);
            mensajeBusqueda(response,null,centro_sesion);
        }else{
            response.render('busqueda',{
                pagina:'Busqueda',
                centros:null,
                aviso:null,
                usuario:usuario_sesion
            });
        }
};

exports.operacionesBusqueda = (request, response)=>{
    console.log(request.body);
    let campo_valoracion = request.body.b_valoracion;
    let campo_localizacion = request.body.b_localizacion;
    let campo_tematica = request.body.b_tematica;
    let centro_resultado;
    let centro_enviar;
    let centro_aux;

    if(request.body.operacion == 'BUSCAR'){
        console.log('dentro de buscar');
        if(campo_valoracion != undefined && campo_localizacion != '' && campo_tematica != ''){
            
            console.log('Busqueda con valoración, localización y temática');
            centro_aux = buscarLocalizacion(response,campo_localizacion);
            centro_enviar = buscarTematica(response,campo_tematica,centro_aux);
            centro_resultado = buscarRating(response,campo_valoracion,centro_enviar);
            mensajeBusqueda(response,null,centro_resultado);

        }else if(campo_valoracion != undefined && campo_tematica != ''){

            console.log('busqueda con tematica y valoración');
            centro_enviar = buscarTematica(response,campo_localizacion);
            centro_resultado = buscarRating(response,campo_valoracion,centro_enviar);
            mensajeBusqueda(response,null,centro_resultado);

        }else if(campo_valoracion != undefined && campo_localizacion != ''){

            console.log('busqueda con localizacion y valoración');
            centro_enviar = buscarLocalizacion(response,campo_localizacion);
            centro_resultado = buscarRating(response,campo_valoracion,centro_enviar);
            mensajeBusqueda(response,null,centro_resultado);

        }else if(campo_localizacion != '' && campo_tematica != ''){

            console.log('Busqueda con localización y temática');
            centro_aux = buscarLocalizacion(response,campo_localizacion);
            centro_enviar = buscarTematica(response,campo_tematica,centro_aux);
            centro_resultado = buscarRating(response,undefined,centro_enviar);
            mensajeBusqueda(response,null,centro_resultado);

        }else if(campo_valoracion != undefined){

            console.log('dentro de busqueda de valoración unica');
            centro_resultado = buscarRating(response,campo_valoracion,undefined);
            mensajeBusqueda(response,null,centro_resultado);

        }else if(campo_localizacion != ''){
            
            console.log('dentro de busqueda de localización unica');
            centro_enviar = buscarLocalizacion(response,campo_localizacion);
            centro_resultado = buscarRating(response,undefined,centro_enviar);
            mensajeBusqueda(response,null,centro_resultado);

        }else if(campo_tematica != ''){
            console.log('dentro de busqueda de tematica unica');
            centro_enviar = buscarTematica(response,campo_tematica,undefined);
            centro_resultado = buscarRating(response,undefined,centro_enviar);
            mensajeBusqueda(response,null,centro_resultado);
        }else{
            mensajeBusqueda(response,'NO SE HA RELLENADO NINGÚN CAMPO',null);
        }
    }else if(request.body.operacion == 'Valorar'){
        console.log('dentro de valorar');
        let notaCentro = request.body.valorar_centro;
        let idCentro = request.query.idCentro
        console.log(request.body);
        console.log(request.query);
        if(notaCentro == null){
            mensajeBusqueda(response,'NO SE HA ASIGNADO UNA NOTA AL CENTRO',null);
        }else{
            valorarCentro(response,notaCentro,idCentro);
        }
        
    }
}