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
  const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const DISCORD_CLIENT_SECRET = process.env.NEXT_PUBLIC_DISCORD_CLIENT_SECRET;
  const DISCORD_REDIRECT_URI = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI;

  try {
    // Exchange the authorization code for an access token
    const response = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: DISCORD_REDIRECT_URI,
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token } = response.data;

    // Get the user's profile using the access token
    const profileResponse = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userProfile = profileResponse.data;

    // Check if user exists
    const [rows] = await connection.execute('SELECT * FROM account WHERE acc_social_userId = ?', [userProfile.id]);

    let userId = null;

    if (rows.length > 0) {
        // Update user information
        await connection.execute(
            'UPDATE account SET acc_full_name = ?, acc_social_pictureUrl = ? WHERE acc_social_userId = ?',
            [userProfile.username, userProfile.avatar ? `https://cdn.discordapp.com/avatars/${userProfile.id}/${userProfile.avatar}.png` : null, userProfile.id]
        );
        // Use the ID from the existing user
        userId = rows[0].acc_id;
    } else {
        // Insert new user
        const [result] = await connection.execute(
            'INSERT INTO account (acc_social_userId, acc_full_name, acc_social_type, acc_social_pictureUrl) VALUES (?, ?, ?, ?)',
            [userProfile.id, userProfile.username, "discord", userProfile.avatar ? `https://cdn.discordapp.com/avatars/${userProfile.id}/${userProfile.avatar}.png` : null]
        );
        // Use the ID from the newly inserted user
        userId = result.insertId;
    }

    // Close the database connection
    await connection.end();

    // Create JWT with user ID and other relevant data
    const token = jwt.sign({ userId, fullName: userProfile.username }, process.env.JWT_SECRET);

    res.status(200).json({ user: userProfile, token });

  } catch (error) {
    const state = generateState();
    const authorizeUrl = `https://discord.com/api/oauth2/authorize?response_type=code&client_id=${DISCORD_CLIENT_ID}&redirect_uri=${DISCORD_REDIRECT_URI}&state=${state}&scope=identify%20email`;

    console.error('Error during Discord login:', error);
    console.error('Error response:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to authenticate with Discord', authorizeUrl });
  }
}
