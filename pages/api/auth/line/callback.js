import axios from 'axios';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
function generateState() {
    return crypto.randomBytes(16).toString('hex'); // สร้าง state ยาว 32 ตัวอักษร
  }
  
const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});


export default async function handler(req, res) {
  const { code } = req.query;
  const LINE_CLIENT_ID = process.env.NEXT_PUBLIC_LINE_CLIENT_ID;
  const LINE_CLIENT_SECRET = process.env.NEXT_PUBLIC_LINE_CLIENT_SECRET;
  const LINE_REDIRECT_URI = process.env.NEXT_PUBLIC_LINE_REDIRECT_URI;

//   console.log('Received code:', code);

  try {
    // Exchange the authorization code for an access token
    const response = await axios.post(
      'https://api.line.me/oauth2/v2.1/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: LINE_REDIRECT_URI,
        client_id: LINE_CLIENT_ID,
        client_secret: LINE_CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token } = response.data;

    // Get the user's profile using the access token
    const profileResponse = await axios.get('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userProfile = profileResponse.data;
    // console.log('User profile:', userProfile);

    // Check if user exists
    const [rows] = await connection.execute('SELECT * FROM account WHERE acc_social_userId = ?', [userProfile.userId]);

    let userId = null;

    if (rows.length > 0) {
        // Update user information
        await connection.execute(
            'UPDATE account SET acc_full_name = ?, acc_social_pictureUrl = ? WHERE acc_social_userId = ?',
            [userProfile.displayName, userProfile.pictureUrl, userProfile.userId]
        );
        // Use the ID from the existing user
        userId = rows[0].acc_id;
    } else {
        // Insert new user
        const [result] = await connection.execute(
            'INSERT INTO account (acc_social_userId, acc_full_name, acc_social_type, acc_social_pictureUrl) VALUES (?, ?, ?, ?)',
            [userProfile.userId, userProfile.displayName, "line", userProfile.pictureUrl]
        );
        // Use the ID from the newly inserted user
        userId = result.insertId;
    }

    // Close the database connection
    await connection.end();

    // Create JWT with user ID and other relevant data
    const token = jwt.sign({ userId, fullName: userProfile.displayName }, process.env.JWT_SECRET);

    res.status(200).json({ user: userProfile, token });

  } catch (error) {
    const LINE_CLIENT_ID = process.env.NEXT_PUBLIC_LINE_CLIENT_ID;
    const LINE_REDIRECT_URI = process.env.NEXT_PUBLIC_LINE_REDIRECT_URI;
    const state = generateState();

    const authorizeUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${LINE_CLIENT_ID}&redirect_uri=${LINE_REDIRECT_URI}&state=${state}&scope=profile%20openid%20email`;


    console.error('Error during Line login:', error);
    console.error('Error response:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to authenticate with Line', authorizeUrl });
  }
}

