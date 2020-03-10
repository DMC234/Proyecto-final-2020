const Express = require('express');
const router = Express.Router();
const usuarios = require('../models/usuarios');
const centro = require('../models/centro');

//exportamos las rutas y así acceder a estas.
module.exports = ()=>{

    //RUTA INDEX
    router.get('/',(request, response)=>{
        response.render('index',{
            pagina: 'Inicio'
        });
    });

    //RUTA BUSQUEDA
    router.get('/busqueda',(request, response)=>{
        response.render('busqueda');
    });


    //Formulario de Inicio
    router.post('/',(request, response)=>{
        console.log('Hola desde POST');
        console.log(request.body);

        if(request.body.operacion == "REGISTRARSE"){
            console.log('operación de registro');
            usuarios.create({
                idUsuario:0,
                nombreUsuario:request.body.r_n_usuario,
                pwd:request.body.r_pwd,
                nombreReal:request.body.r_n_personal,
                apellidoReal:request.body.r_apellidos,
                correo:request.body.r_correo
            })
            .then((valor)=>console.log('Usuario creado correctamente'))
            .catch((error)=>console.log(error));

        }else if(request.body.operacion == "INICIAR SESIÓN"){
            console.log('operación de login');
            /*usuarios.findByPk(1)
                .then((usuario)=>{
                    console.log(usuario);
                })
                .catch((error)=>console.log(error));*/
                usuarios.findOne({
                    where:{
                        nombreUsuario:request.body.l_n_usuario,
                        pwd:request.body.l_pwd
                    }
                })
                .then((valor)=>{
                    if(valor != null){
                        console.log('Login correcto!');
                        response.redirect('/busqueda');

                    }else{
                        console.log('Login incorrecto');
                    }
                })
                .catch((error)=>console.log(error));
        }
    });

    return router;
}