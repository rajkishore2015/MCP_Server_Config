const mysql = require('mysql2');
const mssql = require('mssql');

function getMySQLPool(database) {
  return mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database,
    port: process.env.MYSQL_PORT,
    ssl: process.env.MYSQL_SSL === 'true',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

function getMSSQLConfig(database) {
  return {
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASSWORD,
    server: process.env.MSSQL_HOST,
    database,
    port: parseInt(process.env.MSSQL_PORT, 10),
    options: {
      encrypt: false,
      trustServerCertificate: true
    }
  };
}

module.exports = { getMySQLPool, getMSSQLConfig };
