const mysql = require('mysql2/promise');

const db = mysql.createPool({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'network_monitor'
});

module.exports = db;