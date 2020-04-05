const Express = require('express');
const router = Express.Router();
const usuarios = require('../models/usuarios');
const centro = require('../models/centro');
const nodemailer = require('nodemailer');

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
        response.render('busqueda',{
            pagina:'Busqueda',
            centros:null
        });
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
                correo: request.body.r_correo
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
                        response.redirect('/busqueda');

                    } else {
                        console.log('Login incorrecto');
                        response.redirect('/');
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
        //AGREGAR CAMPOS TEMÁTICA Y PRECIO MÍNIMO Y MÁXIMO EN LA BBDD.
       
        let campos = request.body;
        let objeto = {};
        let arregloObjetos = [];
        let valoracion = campos.b_valoracion;
        let localizacion = campos.b_localizacion != '';
        let tematica = campos.b_tematica != '';
        
           

        async function buscarCentros(objetoCondicion){
            let filas = await centro.findAll();
            let array = [];
            let tematica; 
            let resultadosFilas = [];
            let centrox;
            
                
            console.log(campos);
            //Recorremos todos los centros
            for(let i = 0; i < filas.length; i++){
                //Guardamos los valores de temática de cada tabla
                tematica = filas[i].tematica;
                for(let j = 0; j < tematica.length; j++){
                    if(tematica.charAt(j) == ','){
                        array.push(j);
                    }
                }
            }
            
            
            for(x = 0; x < array.length; x++){
                let pal = array[x] - campos.b_tematica.length;
                if(x < array.length){
                    console.log(x);
                    if(x == filas.length){
                        tematica = filas[x-1].tematica
                    }else{
                        tematica = filas[x].tematica;
                    }
                    if(tematica.substr(pal, campos.b_tematica.length) == campos.b_tematica){
                        console.log('son iguales');
                        resultadosFilas.push(tematica);
                    }
                }
            }


            console.log(resultadosFilas);
            centrox = await centro.findAll({
                where:{
                    tematica:resultadosFilas
                }
            });

            console.log(centrox);
        
            
            response.render('busqueda',{
                pagina:'Busqueda',
                centros:centrox
            });
        }

        //Colocar filas de tematica en mayuscula no olvidar
        console.log(request.body);

       if(tematica){
           objeto.tematica = campos.b_tematica;
           buscarCentros(objeto);
       }else if(localizacion){
            objeto.localizacion = campos.b_localizacion;
            buscarCentros(objeto);  
       }else{
            objeto.tematica = campos.b_tematica;
            objeto.localizacion = campos.b_localizacion;
            buscarCentros(objeto);  
       }
        //IDEA:
        //DONDE EL WHERE, METER EN UNA VARIABLE EL OBJETO, EN BASE AL NÚMERO DE CAMPOS RELLENADOS.
        //DE ESA MANERA CREAMOS UNA CONSULTA FLEXIBLE, EN LA QUE DEPENDIENDO DEL NÚMERO DE CAMPOS RELLENADOS
        //METEMOS MÁS CAMPOS DENTRO DEL WHERE O NO.
        //ARREGLAR LOCALIZACIÓN E IMPLEMENTAR VALORACIÓN, CONTROL DE USUARIOS Y INPUT LIST AL EJS.
    });


    return router;
}