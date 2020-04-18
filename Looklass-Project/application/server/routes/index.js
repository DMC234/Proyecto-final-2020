const Express = require('express');
const router = Express.Router();
const usuarios = require('../models/usuarios');
const centro = require('../models/centro');
const interaccion = require('../models/interaccion');
const db = require('../config/database');
const Sequelize = require('sequelize');
const nodemailer = require('nodemailer');
const os = require('os');
//Variable general del usuario
var usuario;
var centro_general;
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

//exportamos las rutas y así acceder a estas.
module.exports = () => {

    //RUTA INDEX
    router.get('/', (request, response) => {
        response.render('index', {
            pagina: 'Inicio'
        });
    });

    //RUTA BUSQUEDA
    router.get('/busqueda', (request, response) => {
        console.log(request.query);
        if(request.query.operacion == "visitar"){
            console.log(request.query);
            if(request.query.r != undefined){
                async function contarVisita(enlacex){
                    let interaccion_valor;
                    let interaccion_fila;
                    let estado;
                    //Se busca si la visita del usuario ya ha sido contabilizada
                    //Comprobamos la sesión del usuario
                    centro_general = await centro.findOne({where:{enlace:enlacex}});
                    if(usuario == null){
                        let anonimo = await usuarios.findOne({where:{d_mac:ip_usuario.get('ipUsuario')}});
                        if(anonimo == null){
                            await usuarios.create({
                                idUsuario:0,
                                nombreUsuario:'anonimo',
                                pwd:'000000',
                                nombreReal:'anonimo',
                                apellidoReal:'anonimo',
                                correo:'anonimo',
                                d_mac:ip_usuario.get('ipUsuario')
                            });
                            anonimo = await usuarios.findOne({where:{d_mac:ip_usuario.get('ipUsuario')}});
                        }
    
                        interaccion_fila = await interaccion.findOne({where:{idUsuario:anonimo.idUsuario,numeroCentro:centro_general.numeroCentro}});
                        estado = anonimo.idUsuario;
                    }else{
                        interaccion_fila = await interaccion.findOne({where:{idUsuario:usuario.idUsuario,numeroCentro:centro_general.numeroCentro}});
                        estado = usuario.idUsuario;
                    }
    
                    if(interaccion_fila != null){
                        console.log('La visita ya cuenta');
                    }else{
                    //Dentro de este método se implementa el modelo de la tabla interacción y se crea la fila 
                    //con la Id del usuario y la id del centro.
                    interaccion_valor = await interaccion.create({
                        idUsuario:estado,
                        visita:1,
                        valoracion:0,
                        numeroCentro:centro_general.numeroCentro
                        });
                    }
                }
                //llamamos a la función asíncrona para contar la visita
                contarVisita(request.query.r);
    
                //El servidor redirige al cliente a la página oficial del centro.
                response.redirect(request.query.r);        
            }
                //Se limpia la redirección para así poder ser utilizada
                request.query.r = undefined;
        }else if(request.query.operacion == "salir_sesion"){
            usuario = null;
            response.redirect('/');
        }else{
            if(usuario == null){
                response.render('busqueda',{
                    pagina:'Busqueda',
                    centros:null,
                    aviso:null,
                    usuario:null
                });
            }else{
                response.render('busqueda',{
                    pagina:'Busqueda',
                    centros:null,
                    aviso:null,
                    usuario:usuario
                });
            }
        }
    });

    

    //RUTA DE INFORMACIÓN DE TÉRMINOS Y CONDICIONES
    router.get('/informacion',(request, response)=>{
        response.render('informacion');
    });



    //RUTA DE RECUPERACIÓN DE CUENTA
    router.get('/usuario/:id',(request,response)=>{
        response.render('recuperacion',{
            pagina:'Recuperación de la cuenta',
            id:request.params.id
        });
    });


    router.post('/usuario/:id',(request, response)=>{
        console.log('recuperación de la contraseña');

        console.log(request.body);
        let valores = request.body;

        if(valores.c_contrasena_1 === valores.c_contrasena_2){
            console.log('Las contraseñas coinciden');
            async function actualizarContraseña(){
                let persona = await usuarios.findOne({where:{idUsuario:request.params.id}});
                persona.pwd = request.body.c_contrasena_2;
                await persona.save();
                console.log('Contraseña cambiada correctamente');
                response.redirect('/');
            }
            actualizarContraseña();
        }else{
            console.log('Las contraseñas no coinciden');
            response.redirect(`/usuario/${request.params.id}`);
        }
    });


    //Formulario de Inicio
    router.post('/', (request, response) => {
        console.log('Hola desde POST');
        console.log(request.body);

        if (request.body.operacion == "REGISTRARSE") {
            console.log('operación de registro');
            usuarios.create({
                idUsuario: 0,
                nombreUsuario: request.body.r_n_usuario,
                pwd: request.body.r_pwd,
                nombreReal: request.body.r_n_personal,
                apellidoReal: request.body.r_apellidos,
                correo: request.body.r_correo,
                d_mac:null
            })
                .then((valor) => {
                    console.log('Usuario creado correctamente');
                    response.redirect('/');
                })
                .catch((error) => console.log(error));

        } else if (request.body.operacion == "INICIAR SESIÓN") {
            console.log('operación de login');
            usuarios.findOne({
                where: {
                    nombreUsuario: request.body.l_n_usuario,
                    pwd: request.body.l_pwd
                }
            })
                .then((valor) => {
                    if (valor != null) {
                        console.log('Login correcto!');
                        response.render('busqueda',{
                            pagina:'Busqueda',
                            centros:null,
                            aviso:null,
                            usuario:valor
                        });
                        usuario = valor;

                    } else {
                        console.log('Login incorrecto');
                        response.redirect('/');
                        usuario = null;
                    }
                })
                .catch((error) => console.log(error));
        } else if (request.body.operacion == "RECUPERAR CUENTA") {
            console.log('Acceso a la condición de recuperación de cuenta');
            //Obtenemos el usuario a través del correo introducido
            async function obtenerUsuario(correo_r) {
                let usu = await usuarios.findOne({ where: { correo: correo_r } });

                //Creamos el transporte del correo con nuestra cuenta.
                let transporte = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'rabahretmix@gmail.com',
                        pass: 'Tubaplus952000'
                    }
                });

                //Creamos la plantilla HTML para el correo.
                let html = `<html>

<head>
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
    integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
<style>
    /*Fuentes de letra*/
    @font-face {
        font-family: 'roboto';
        src: url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
    }

    body {
        font-family: 'roboto', sans-serif;
    }

    /*Encabezado*/
    #header {
        clear: both;
        float: left;
        width: 10%;
        background-color: rgba(133, 181, 204, 0.98);
        display: flex;
        padding: 1% 45%;
    }

    #header>img {
        float: left;
        display: block;
        width: 80%;
    }

    /*Mensaje*/
    #message {
        clear: both;
        float: left;
        width: 100%;
        background-color: rgba(72, 219, 251, 0.8);
    }

    #message>div {
        float: left;
        width: 90%;
        padding: 2% 5%;
        background-color: rgba(0, 0, 0, 0.3);
    }

    #titulo {
        float: left;
        border: outset 1px rgba(133, 181, 204, 1.0);
        border-radius: 10px;
        width: 100%;
        padding: 1% 0%;
        text-align: center;
        color: whitesmoke;
        font-size: 1.5vw;
        letter-spacing: 2.4px;
    }

    #cuerpo {
        float: left;
        border: solid 1px rgba(133, 181, 204, 1.0);
        width: 90%;
        padding: 1% 5%;
        font-size: 1.3vw;
        color: whitesmoke;
        font-weight: bold;
        letter-spacing: 2px;

    }

    #cuerpo>article {
        clear: both;
        float: right;
        width: 30%;
        padding: 2% 0%;
        color: rgba(32, 184, 143, 0.98);

    }

    #cuerpo>article>div {
        float: left;
        width: auto;
        color: rgba(40, 255, 198, 0.98);
    }

    #cuerpo>article>div:nth-child(2) {
        padding: 2% 0%;
    }

    /*Pie de correo*/
    #pie_correo{
        float: left;
        width: 100%;
        padding: 2% 0%;
    }

    #pie_correo>article{
        float: left;
        width: 90%;
        padding: 0% 5%;
    }

    #pie_correo>article{
        float: left;
        width: 90%;
        font-size: 1.1vw;
        letter-spacing: 2px;
        color: whitesmoke;
    }

    #pie_correo>article>div{
        float: left;
        width: 20%;
        padding: 0% 15%;
    }
    #pie_correo>article>div>img{
        float: left;
        width: 40%;
        padding: 0% 0%;
    }
</style>
</head>

<body>
<div id='header'>
    <img src="https://lh3.googleusercontent.com/Dr2ion3FFGQb3QpSDS6EfelTy2UJv77873HEmZKY0EyZqtAhTeKOtATXXRKEt7y7FE1vXtlATs_InyDczDVR0lNZlgJ9G87qlWbwEUiel288QhyjpuZoXw-QxJ6cLEf3GgCp2mOoKwiwCGTuRQ1NpGbW6zXsGkBkRlh7buGRP8Sltka8DSu446y8toewHH42-aFJG6CaIk_HrLfEcef_GfhSoi6WoBqKKDb5uNBdjm4wFoyoaoBKVuRVighJnpNHFLHCSJZNuwGkIqbsTUF8A5_BhyK9um_TCChMTydt3a8Ia-43eZWnLZHLEVx5foumrb0OK-c9cbFdSsnnrQo6dgTaBl5WDK78eqISZh5Imh3vi4-fOE_jRDvwFwe-vnzIejONR2Dq141WIXyrEVtZzEzSEKIiM6sx7J-b93XT4Z-2dMkt2DK6gssTJ_d6Bgttm2hK53qxd8Td98GT7C7AMunQMqIKjgOd8vjTGAjwomW2-D5yqiAl1Kbbj2eLm-HPKdsRdhvOediDFvHyZZ91R60cAHjt32tIx-6bqjLshzP5Auh-pJhOgNLq4XJ_Jg-k7sAvoUfEMB0soHMbw_z08N64Lh8TVgDy47oG_9OuYWVtYurZ8Cw2ysUfhMS4mnemJpYtXgjBVfQnqsFMlC1y-vEVb_w0YSHlWcf3XDTb_A4cqP8bziIQqEMmeOrKSg=w676-h654-no"
        title="logo" alt="logo">
</div>
<div id='message'>
    <div>
        <div id="titulo">
            <h3>Estimad@ ${usu.nombreReal}:</h3>
        </div>
        <div id="cuerpo">
            <p>Hemos Recibido correctamente su petición para restablecer la contraseña,
                deberá rellenar un campo con su nueva contraseña, asegúrese de no olvidarla.
            </p>
            <p>Acceda al siguiente link para restablecer la contraseña:</p>
            <a href="http://127.0.0.1:5000/usuario/${usu.idUsuario}">http://127.0.0.1:5000/usuario/${usu.idUsuario}</a>
             <p>Si usted no ha solicitado este cambio, Inmediatamente ignórelo, cualquier duda
                  puede ponerse en contacto a través de nuestro correo.
                </p>
                <article>
                    <div><i class="fas fa-2x fa-envelope-square"></i></div>
                 <div>tucentroideal@looklass.es</div>
                </article>
            </div>
            <div id="pie_correo">
                <article>Atentamente:</article>
                <article>
                    <div><h3>Grupo Looklass</h3></div>
                    <div><img src="https://lh3.googleusercontent.com/Dr2ion3FFGQb3QpSDS6EfelTy2UJv77873HEmZKY0EyZqtAhTeKOtATXXRKEt7y7FE1vXtlATs_InyDczDVR0lNZlgJ9G87qlWbwEUiel288QhyjpuZoXw-QxJ6cLEf3GgCp2mOoKwiwCGTuRQ1NpGbW6zXsGkBkRlh7buGRP8Sltka8DSu446y8toewHH42-aFJG6CaIk_HrLfEcef_GfhSoi6WoBqKKDb5uNBdjm4wFoyoaoBKVuRVighJnpNHFLHCSJZNuwGkIqbsTUF8A5_BhyK9um_TCChMTydt3a8Ia-43eZWnLZHLEVx5foumrb0OK-c9cbFdSsnnrQo6dgTaBl5WDK78eqISZh5Imh3vi4-fOE_jRDvwFwe-vnzIejONR2Dq141WIXyrEVtZzEzSEKIiM6sx7J-b93XT4Z-2dMkt2DK6gssTJ_d6Bgttm2hK53qxd8Td98GT7C7AMunQMqIKjgOd8vjTGAjwomW2-D5yqiAl1Kbbj2eLm-HPKdsRdhvOediDFvHyZZ91R60cAHjt32tIx-6bqjLshzP5Auh-pJhOgNLq4XJ_Jg-k7sAvoUfEMB0soHMbw_z08N64Lh8TVgDy47oG_9OuYWVtYurZ8Cw2ysUfhMS4mnemJpYtXgjBVfQnqsFMlC1y-vEVb_w0YSHlWcf3XDTb_A4cqP8bziIQqEMmeOrKSg=w676-h654-no" alt="logo_centro" title="logo_centro"></div>
                </article>
         </div>
        </div>

    </div>
</body>

</html>`;

                //Parámetros del correo.
                let opciones = {
                    from: 'rabahretmix@gmail.com',
                    to: usu.correo,
                    subject: 'Recuperación de la contraseña - Looklass',
                    html: html
                };

                //Enviamos el correo.
                transporte.sendMail(opciones, (error, estado) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(estado.response);
                    }
                });

                response.redirect('/');
            }

            //Llamamos a la función asíncrona para obtener el usuario y enviar el correo
            obtenerUsuario(request.body.c_recuperacion);
        }
    });

    //Formulario de Búsqueda
    router.post('/busqueda',(request, response)=>{
       if(request.body.operacion == "Valorar"){
         console.log('Entrada a valorar');
         console.log(request.body);
         console.log(request.query);

         async function valorarCentro(){
            //Buscamos el centro clickeado y posteriormente con el numerocentro y la idUsuario de la sesión
            //Buscamos la visita en la tabla interacción y modificiamos la valoración.
            centro_general = await centro.findOne({where:{numeroCentro:request.query.idCentro}});
            let fila_interaccion = await interaccion.findOne({where:{numeroCentro:centro_general.numeroCentro,idUsuario:usuario.idUsuario}});
            fila_interaccion.valoracion = request.body.valorar_centro;
            let consulta = await db.query(`UPDATE interaccion set valoracion = ${request.body.valorar_centro}
            WHERE numeroCentro = ${fila_interaccion.numeroCentro} AND idUsuario = ${fila_interaccion.idUsuario}`);
            //Redirigimos al usuario a la página de búsqueda.
            response.render('busqueda',{
                pagina:'Busqueda',
                centros:null,
                aviso:`Centro ${centro_general.nombreCentro} valorado en ${fila_interaccion.valoracion} estrellas`,
                usuario:usuario
            });
        }  

        valorarCentro();
         
         
       }else if(request.body.operacion == "BUSCAR"){
            //Valores Iniciales
        let campos = request.body;
        let valoracion = campos.b_valoracion != undefined;
        let localizacion = campos.b_localizacion != '';
        let tematica = campos.b_tematica != '';
        
        async function prepararBusqueda(){
            //Obtenemos los valores de los formularios con comparaciones para ahorrar código
            //a su vez también tenemos los arrays y el objeto para pasar a la función incluirResultados
            //y así obtener las filas correspondientes.
            //Campos del formulario
            let campo_tematica = campos.b_tematica;
            let campo_localizacion = campos.b_localizacion;
            let campo_valoracion = campos.b_valoracion;
            //Matrices de almacenamiento
            let comprobar_valoracion = new Set();
            let comprobar_valor = [0];
            let resultados_tematica = new Array();
            let resultados_valoracion = new Array();
            //Objeto y variables generales
            let objetoConsulta = {};
            let objetoRender = {};
            var centrox,centrox_valoracion,centrox_visitas;
            //Variables de uso
            let centro_valoracion;
            let centro_tematica;
            var centros_valorados = [];
            var centros_valoracion = [];
            var centros_visita = [];
            var consulta_valoracion;
            
            //Comprobamos los campos rellenados
            if(valoracion && localizacion && tematica){
                centro_valoracion = await buscarValoracion();
                buscarTematica(centro_valoracion);
                centrox = await centro.findAll({where:{localizacion:campo_localizacion,tematica:resultados_tematica}});
                buscarRating(centrox);
            }else if(valoracion && localizacion){
                centro_valoracion = await buscarValoracion();
                centrox = await centro.findAll({where:{localizacion:campo_localizacion,numeroCentro:resultados_valoracion}});
                buscarRating(centrox);
            }else if(valoracion && tematica){
                centro_valoracion = await buscarValoracion();
                buscarTematica(centro_valoracion);
                centrox = await centro.findAll({where:{tematica:resultados_tematica}});
                buscarRating(centrox);
            }else if(localizacion && tematica){
                centro_tematica = await centro.findAll();
                buscarTematica(centro_tematica);
                centrox = await centro.findAll({where:{localizacion:campo_localizacion,tematica:resultados_tematica}});
                buscarRating(centrox);
            }else if(valoracion){
                centro_valoracion = await buscarValoracion();
                console.log(centro_valoracion);
                buscarRating(centro_valoracion);
            }
            else if(localizacion){
                centrox = await centro.findAll({where:{localizacion:campo_localizacion}});
                buscarRating(centrox);
            }
            else if(tematica){
                centro_tematica = await centro.findAll();
                buscarTematica(centro_tematica);
                centrox = await centro.findAll({where:{tematica:resultados_tematica}});
                buscarRating(centrox);
            }else{
                //Si el usuario no envía información.
                //Se reenvía a la misma página con un aviso.
                response.render('busqueda',{
                    pagina:'Busqueda',
                    centros:null,
                    aviso:'NO HAY RESULTADOS',
                    usuario:usuario,

                });
            }

            async function buscarCentro(objetoRender){
                console.log('Buscando el centro');
                console.log(objetoRender);
                //Comprobamos si hay resultados que responden a la consulta
                if(objetoRender.centros.length > 0){
                    response.render('busqueda',objetoRender);
                }else{
                    response.render('busqueda',{
                    pagina:'Busqueda',
                    centros:null,
                    aviso:'NO HAY RESULTADOS',
                    usuario:usuario,
                    valoracion:null,
                    visitas:null
                    });
                }
            }

            async function buscarRating(fila_resultados){
                if(fila_resultados.length > 0){
                    for(let i = 0; i < fila_resultados.length; i++){
                        centrox_visitas = await interaccion.findOne({where:{numeroCentro:fila_resultados[i].numeroCentro}});
    
                        if(centrox_visitas == null){
                            //Si el centro no se ha visitado por nadie y no hay valoración,
                            //Simplemente se rellena las matrices a mostrar por 0.
                            console.log('No ha visitado el centro');
                            console.log(fila_resultados[i].numeroCentro);
                            centros_valorados.push(0);

                        }else{
                            console.log('Ha visitado el centro');
                            console.log(fila_resultados[i].numeroCentro);
                            centros_valorados.push(centrox_visitas.numeroCentro);
                        }    
                    }

                    console.log(centros_valorados);
                    //Importante, a la hora de obtener el resultado de una db.query(), es importante indicar el tipo.
                    //en los select hay que colocar, type:{Sequelize.QueryTypes.SELECT}
                    for(let j = 0; j < centros_valorados.length; j++){
                        consulta_valoracion = await db.query(`SELECT SUM(visita) as n_visitas, valoracion as n_estrellas FROM interaccion WHERE numeroCentro = ${centros_valorados[j]}`,
                        {type:Sequelize.QueryTypes.SELECT})
                        consulta_valoracion.forEach(valor=>console.log(valor));
                        if(consulta_valoracion[0].n_visitas == null && consulta_valoracion[0].n_estrellas == null){
                            console.log('Centro no visitado');
                            centros_visita.push(0);
                            centros_valoracion.push(0);
                        }else{
                            console.log('Centro visitado');
                            centros_visita.push(consulta_valoracion[0].n_visitas);
                            centros_valoracion.push(consulta_valoracion[0].n_estrellas);
                        }
                    }
                }
                
                objetoRender.pagina = 'Busqueda';
                objetoRender.centros = fila_resultados;
                objetoRender.aviso = null;
                objetoRender.usuario = usuario;
                objetoRender.valoracion = centros_valoracion;
                objetoRender.visitas = centros_visita;
                buscarCentro(objetoRender);
            }

            async function buscarValoracion(){
                let fila_valoracion = await interaccion.findAll({where:{valoracion:campo_valoracion}});
                //Almacenamos el número del centro
                fila_valoracion.forEach((valor)=>{comprobar_valoracion.add(valor.numeroCentro)});
                for(let i of comprobar_valoracion.values()){resultados_valoracion.push(i)};
                let fila_centro = await centro.findAll({where:{numeroCentro:resultados_valoracion}});
                return fila_centro;
            }

            //Función asíncrona que contiene el algoritmo para obtener las filas de temáticas
            //y asimismo el objeto que contiene los where para personalizar la consulta del buscador.
            async function buscarTematica(filas_buscadas){
                for(let i = 0; i < filas_buscadas.length; i++){
                    let valor = filas_buscadas[i].tematica;
                    if(valor.includes('|')){
                        for(let i = 0; i < valor.length; i++){
                            if(valor.charAt(i) == '|'){
                                comprobar_valor.push(i);
                            }
                        }
                        for(let i = 0; i < comprobar_valor.length; i++){
                            if(valor.includes(campo_tematica,comprobar_valor[i])){
                                resultados_tematica.push(valor);
                            }
                        }
                    }else{
                        if(campo_tematica == valor){
                            resultados_tematica.push(valor);
                        }
                    }
                }
            }
        }   
        //Llamamos a la función asíncrona para buscar los centros
        prepararBusqueda();
       }
    });

    return router;
}