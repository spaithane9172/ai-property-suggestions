const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const db = mysql.createPool({
  host: "localhost",
  user: dbUser,
  password: dbPass,
  database: dbName,
});

module.exports = db;
