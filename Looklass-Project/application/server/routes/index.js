const Express = require('express');
const router = Express.Router();

//exportamos las rutas y así acceder a estas.
module.exports = ()=>{

    //RUTA INDEX
    
    router.get('/',(request, response)=>{
        response.render('index');
    })


    //RUTA BUSQUEDA
    router.get('/busqueda',(request, response)=>{
        response.render('busqueda');
    })




    return router
}