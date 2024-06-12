import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// Mysql connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(function (err) {
  if (err) {
    console.log("Error connecting to database", err);
  } else {
    console.log("Successfully connected to database");
  }
});

export default db;
