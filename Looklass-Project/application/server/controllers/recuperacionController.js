//Modelos
const usuario_modelo = require('../models/usuarios');
const nodemailer = require('nodemailer');

//Funciones Generales
async function actualizarPassword(request, response){
    let valores = request.body;
    let idUsuario = request.params.id;
    if(valores.c_contrasena_1 === valores.c_contrasena_2){
        console.log('Las contraseñas coinciden');
        let persona = await usuario_modelo.findOne({where:{idUsuario:idUsuario}});
        persona.pwd = valores.c_contrasena_2;
        await persona.save();
        console.log('Contraseña cambiada correctamente');
        return true;
    }else{
        console.log('Las contraseñas no coinciden');
        return false;
    }
}

function mensajeRecuperacion(response,idUsuario,mensaje){
    response.render('recuperacion',{
        pagina:'Recuperacion de la cuenta',
        id:idUsuario,
        mensaje
    });
}

//Funciones de Exportación
exports.recuperarRuta = (request,response)=>{
    response.render('recuperacion',{
        pagina:'Recuperación de la cuenta',
        id:request.params.id,
        mensaje:null
    });
};

exports.actualizarContrasena = (request, response)=>{
    console.log('recuperación de la contraseña');
    console.log(request.body);
    let estadoActualizacion = actualizarPassword(request,response);
    estadoActualizacion.then((estado)=>{
        if(estado == true){
            response.redirect('/');
        }else{
            mensajeRecuperacion(response,request.params.id,'Las contraseñas no coinciden!');
        }
    }); 
};

exports.enviarEmail = async function(correo_destino){
    let usuario_correo = await usuario_modelo.findOne({where:{correo:correo_destino}});
    console.log(usuario_correo);
    
    if(usuario_correo == null){
        return false;
    }else{
        let html_correo = `<html>
    <head>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
    integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
    <style>
    /*Fuentes de letra*/
    @font-face {font-family: 'roboto';src: url('https://fonts.googleapis.com/css?family=Roboto&display=swap');}
    body {font-family: 'roboto', sans-serif;}
    /*Encabezado*/
    #header {clear: both;float: left;width: 10%;background-color: rgba(133, 181, 204, 0.98);
    display: flex;padding: 1% 45%;}
    #header>img {float: left;display: block;width: 80%;}
    
    /*Mensaje*/
    #message {clear: both;float: left;width: 100%;background-color: rgba(72, 219, 251, 0.8);}
    #message>div {float: left;width: 90%;padding: 2% 5%;background-color: rgba(0, 0, 0, 0.3);}
    #titulo {float: left;border: outset 1px rgba(133, 181, 204, 1.0);border-radius: 10px;
    width: 100%;padding: 1% 0%;text-align: center;color: whitesmoke;font-size: 1.5vw;letter-spacing: 2.4px;}
    #cuerpo {float: left;border: solid 1px rgba(133, 181, 204, 1.0);width: 90%;padding: 1% 5%;font-size: 1.3vw;
    color: whitesmoke;font-weight: bold;letter-spacing: 2px;}
    #cuerpo>article {clear: both;float: right;width: 30%;padding: 2% 0%;color: rgba(32, 184, 143, 0.98);}
    #cuerpo>article>div {float: left;width: auto;color: rgba(40, 255, 198, 0.98);}
    #cuerpo>article>div:nth-child(2) {padding: 2% 0%;}
    
    /*Pie de correo*/
    #pie_correo{float: left;width: 100%;padding: 2% 0%;}
    #pie_correo>article{float: left;width: 90%;padding: 0% 5%;}
    #pie_correo>article{float: left;width: 90%;font-size: 1.1vw;letter-spacing: 2px;color: whitesmoke;}
    #pie_correo>article>div{float: left;width: 20%;padding: 0% 15%;}
    #pie_correo>article>div>img{float: left;width: 40%;padding: 0% 0%;}
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
            <h3>Estimad@ ${usuario_correo.nombreReal}:</h3>
        </div>
        <div id="cuerpo">
            <p>Hemos Recibido correctamente su petición para restablecer la contraseña,
                deberá rellenar un campo con su nueva contraseña, asegúrese de no olvidarla.
            </p>
            <p>Acceda al siguiente link para restablecer la contraseña:</p>
            <a href="http://192.168.1.104:5000/usuario/${usuario_correo.idUsuario}">http://192.168.1.104:5000/usuario/${usuario_correo.idUsuario}</a>
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
    let transporte = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'rabahretmix@gmail.com',
            pass:'SilentHill4_952000*'
        }
    });
        
    let condiciones_email = {
        from:'rabahretmix@gmail.com',
        to: correo_destino,
        subject:'Recuperación de la contraseña - Looklass',
         html:html_correo
    };
    
    await transporte.sendMail(condiciones_email);
    return true;
    }
}