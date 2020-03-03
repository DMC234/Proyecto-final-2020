const Sequelize = require('sequelize');
const db = require('../config/database');
const usuarios = require('./usuarios');

//Definimos el modelo de la tabla.
const centro = db.define('usuarios',{
    //Definimos los campos de la tabla.
    numeroCentro:{
        type:Sequelize.INTEGER,
        notNull:true,
        primaryKey:true
    },
    nombreCentro:{
        type:Sequelize.STRING,
        notNull:true,
        Unique:true
    },
    localizacion:{
        type:Sequelize.STRING,
        notNull:true
    },
    precio:{
        type:Sequelize.DECIMAL,
        notNull:true
    },
    descripcionCentro:{
        type:Sequelize.STRING,
        notNull:true
    },
    img:{
        type:Sequelize.STRING,
        notNull:true
    },
    enlace:{
        type:Sequelize.STRING,
        notNull:true
    },
    visita:{
        type:Sequelize.BOOLEAN,
        notNull:true
    },
    valoracion:{
        type:Sequelize.DECIMAL
    },
    idUsuario:{
        type:Sequelize.INTEGER,
        notNull:true
    }

});

centro.hasOne(usuarios,{
    foreignKey:'idUsuario'
});

usuarios.belongsTo(centro);
module.exports = centro;