const mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER,
    perfi: process.env.DB_PERFIL,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE

});

connection.connect((error)=>{
    if(error){
        console.log('EL ERROR DE CONEXION ES: ' +error);
        return;
    }
    console.log('¡CONECTADO A LA BASE DE DATOS!');
});
module.exports = connection;

