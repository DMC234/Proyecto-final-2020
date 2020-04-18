const Sequelize = require('sequelize');

module.exports = new Sequelize('Looklass','root','',{
    host:'127.0.0.1',
    dialect:'mysql',
    port:'3306',
    define:{
        timestamps:false,
        freezeTableName:true
    },
    pool:{
        min:0,
        max:5,
        acquire:30000,
        idle:10000
    }
})