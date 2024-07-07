import dotenv from 'dotenv'
import mysql  from 'mysql2/promise';


dotenv.config();

 const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

export default pool;

