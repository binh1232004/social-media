const mysql = require('mysql2/promise');
require('dotenv').config();
const createConnection = async () =>{
    return mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      port: process.env.PORT_DATABASE
    })
}
module.exports = createConnection;