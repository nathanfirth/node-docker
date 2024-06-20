const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'password',
  database: 'chat'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

module.exports = db;
