//Librerías estándar.
const Express = require('express');
const app = Express();
const router = require('./routes/index');
//valores opcionales
const puerto = 5000;


//Obtenemos las rutas de la aplicación.
app.use(router());








//puerto de escucha del servidor
app.listen(puerto,()=>{
    console.log(`Servidor abierto, puerto:${puerto}`);
})
