const Sequelize = require('sequelize');
const db = require('../config/database');

//Definimos el modelo de la tabla.
const usuario = db.define('usuarios',{
    //Definimos los campos de la tabla.
    idUsuario:{
        type:Sequelize.INTEGER,
        notNull:true,
        primaryKey:true
    },
    nombreUsuario:{
        type:Sequelize.STRING,
        notNull:true,
        Unique:true
    },
    pwd:{
        type:Sequelize.STRING,
        notNull:true
    },
    nombreReal:{
        type:Sequelize.STRING,
        notNull:true
    },
    apellidoReal:{
        type:Sequelize.STRING,
        notNull:true
    },
    correo:{
        type:Sequelize.STRING,
        notNull:true
    },
    d_mac:{
        type:Sequelize.STRING
    }

});


module.exports = usuario;