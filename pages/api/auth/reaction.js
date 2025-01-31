import { parse } from 'cookie';  // Changed to destructured import
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

// Create a connection pool instead of a single connection
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ status: 'error', error: 'Method Not Allowed' });
    }

    const userAgent = req.headers['user-agent'];

    // รายการเครื่องมือ/ไลบรารีที่ต้องการบล็อก
    const blockedTools = [
      /PostmanRuntime\//,
      /Bun\//,
      /curl\//,
      /wget\//,
      /axios\//,
      /insomnia\//i,
    ];
  
    const isBlocked = blockedTools.some((regex) => regex.test(userAgent));
  
    if (isBlocked) {
      return res.status(400).json({ message: 'Access denied: blocked tool or library' });
    }
  
    const { re_before, re_after } = req.body;
  
    // Check if nickname or level is undefined
    if (re_before === undefined || re_after === undefined) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบ.' });
    }
  
    try {
      // Parse cookies
    const cookieHeader = req.headers.cookie || '';
    const cookies = parse(cookieHeader);  // Using imported parse function directly
    const token = cookies.amToken;
  
      if (!token) {
        return res.status(401).json({ status: 'error', error: 'ไม่พบโทเค็นการตรวจสอบสิทธิ์ กรุณาเข้าสู่ระบบ.' });
      }
  
      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (jwtError) {
        const errorMessage = jwtError.name === 'TokenExpiredError' ? 'โทเค็นหมดอายุแล้ว กรุณาเข้าสู่ระบบอีกครั้ง' : 'โทเค็นไม่ถูกต้อง กรุณาเข้าสู่ระบบอีกครั้ง';
        return res.status(401).json({ status: 'error', error: errorMessage });
      }
  
      const { acc_id } = decoded;
  
       // Insert new user data
      const connection = await pool.getConnection();
      try {

        const [result_] = await connection.execute(
          'UPDATE account SET acc_level = ? WHERE acc_id = ? ',
          [re_after, acc_id || decoded.userId]
        );
  
        if (result_.affectedRows === 0) {
          return res.status(404).json({ status: 'error', error: 'ไม่พบผู้ใช้หรือไม่มีการเปลี่ยนแปลง' });
        }

        const [result] = await connection.execute(
          'INSERT INTO reaction (acc_id, re_before, re_after) VALUES (?, ?, ?)',
          [acc_id || decoded.userId, re_before, re_after]
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({ status: 'error', error: 'ไม่สามารถเพิ่ม Reaction ผู้ใช้ได้' });
        }

        return res.status(200).json({
          status: 'success',
          message: 'เพิ่ม Reaction ผู้ใช้เรียบร้อยแล้ว'
        });
      } finally {
        connection.release();
      } 
    } catch (error) {
      console.error('Error in /api/auth/reaction handler:', error);
      return res.status(500).json({ 
        status: 'error',
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  