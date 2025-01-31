// /lib/dbConnection.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',      
    port: 8889, 
    user: 'root',            
    password: 'root',   
    database: 'hnawny_chat_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
