const Sequelize = require('sequelize');
const db = require('../config/database');

//Definimos el modelo de la tabla.
const centro = db.define('centro',{
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
    
    descripcionCentro:{
        type:Sequelize.STRING,
        notNull:true
    },
    img:{
        type:Sequelize.STRING,
        notNull:true,
        Unique:true
    },
    enlace:{
        type:Sequelize.STRING,
        notNull:true
    },
    tematica:{
        type:Sequelize.STRING,
        notNull:true
    }
});

module.exports = centro;