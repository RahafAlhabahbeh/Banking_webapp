const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'bankuser',
  password: 'Bank@1234',
  database: 'banking_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
