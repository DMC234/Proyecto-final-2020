const Sequelize = require('sequelize');
const db = require('../config/database');


const interaccion = db.define('interaccion',{
    idUsuario:{
        type:Sequelize.INTEGER,
        notNull:true,
        primaryKey:true
    },
    visita:{
        type:Sequelize.INTEGER
    },
    valoracion:{
        type:Sequelize.DECIMAL
    },
    numeroCentro:{
        type:Sequelize.INTEGER,
        notNull:true
    }
});

module.exports = interaccion;