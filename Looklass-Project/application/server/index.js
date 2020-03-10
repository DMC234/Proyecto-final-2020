//Librerías estándar.
const Express = require('express');
const app = Express();
const router = require('./routes/index');
const db = require('./config/database');
const path = require('path');
const configs = require('./config/index');
const bodyParser = require('body-parser');
//valores opcionales
const puerto = 5000;


//Conexión BBDD
db.authenticate()
    .then(()=>console.log('Conexión Correcta a BBDD!!'))
    .catch((error)=>console.log(error));



//Habilitamos CSS
app.use(Express.static('public'));


//Habilitamos modos de ejecución de la aplicación.
const config = configs[app.get('env')];
app.locals.titulox = config.sitioWeb;

//BodyParser para los valores de los formularios
app.use(bodyParser.urlencoded({extended:false}));

//Obtenemos las rutas de la aplicación.
app.use(router());



//Habilitamos las vistas y la tecnología EJS.
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


//puerto de escucha del servidor
app.listen(puerto,()=>{
    console.log(`Servidor abierto, puerto:${puerto}`);
})
