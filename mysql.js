const mysql = require('mysql2')

const connection = mysql.createConnection({
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_MYSQLDATABASE,
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
})

exports.connection = connection
