import jwt from 'jsonwebtoken';
import { parse } from 'cookie';  // Changed to destructured import
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
  if (req.method !== 'GET') {
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

  try {
    // Step 1: Parse cookies safely with explicit parse function
    const cookieHeader = req.headers.cookie || '';
    const cookies = parse(cookieHeader);  // Using imported parse function directly
    const token = cookies.amToken;

    if (!token) {
      return res.status(401).json({ status: 'error', error: 'ไม่พบโทเค็นการตรวจสอบสิทธิ์ กรุณาเข้าสู่ระบบ.' });
    }

    // Step 2: Token validation with error handling
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'โทเค็นหมดอายุแล้ว กรุณาเข้าสู่ระบบอีกครั้ง' });
      }
      return res.status(401).json({ error: 'โทเค็นไม่ถูกต้อง กรุณาเข้าสู่ระบบอีกครั้ง' });
    }


    const { 
      acc_id,
    } = decoded;

    // Step 3: Query database using connection pool
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM account WHERE acc_id = ?', 
        [acc_id || decoded.userId]
      );
      
      if (!rows || rows.length === 0) {
        return res.status(404).json({ error: 'ไม่พบผู้ใช้' });
      }

      const user = rows[0]; // Get the first user since ID should be unique

      // Step 4: Return user and account data
      return res.status(200).json({
        status: 'success',
        account: {
          id: user.id,
          // Add other user fields you want to expose
          ...user
        }
      });
    } finally {
      connection.release(); // Always release the connection back to the pool
    }
  } catch (error) {
    console.error('Error in /api/auth/@me handler:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}