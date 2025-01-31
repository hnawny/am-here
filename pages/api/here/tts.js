// import jwt from 'jsonwebtoken';
// import { parse } from 'cookie';  // Changed to destructured import
// import mysql from 'mysql2/promise';

// Create a connection pool instead of a single connection
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const userAgent = req.headers['user-agent'];
    const blockedTools = [/PostmanRuntime\//, /Bun\//, /curl\//, /wget\//, /axios\//, /insomnia\//i];
    
    if (blockedTools.some((regex) => regex.test(userAgent))) {
      return res.status(400).json({ message: 'Access denied' });
    }
  
    const { messages, nickname, level } = req.body;
  
    if (!messages?.length || !nickname) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
      // const cookieHeader = req.headers.cookie || '';
      // const cookies = parse(cookieHeader);
      // const token = cookies.amToken;
  
      // if (!token) {
      //   return res.status(401).json({ status: 'error', error: 'ไม่พบโทเค็นการตรวจสอบสิทธิ์ กรุณาเข้าสู่ระบบ.' });
      // }
  
      // let decoded;
      // try {
      //   decoded = jwt.verify(token, process.env.JWT_SECRET);
      // } catch (jwtError) {
      //   if (jwtError.name === 'TokenExpiredError') {
      //     return res.status(401).json({ error: 'โทเค็นหมดอายุแล้ว กรุณาเข้าสู่ระบบอีกครั้ง' });
      //   }
      //   return res.status(401).json({ error: 'โทเค็นไม่ถูกต้อง กรุณาเข้าสู่ระบบอีกครั้ง' });
      // }
  
      // const { acc_id } = decoded;
      // const connection = await pool.getConnection();
  
      // try {
      //   const [rows] = await connection.execute(
      //     'SELECT * FROM account WHERE acc_id = ?', 
      //     [acc_id || decoded.userId]
      //   );
  
      //   if (!rows || rows.length === 0) {
      //     return res.status(404).json({ error: 'ไม่พบผู้ใช้' });
      //   }
      // } finally {
      //   connection.release();
      // }
      
      const userMessage = messages[messages.length - 1];
      const userMessageContent = Array.isArray(userMessage.content)
        ? userMessage.content
        : [{ type: 'text', text: userMessage.content }];
  
      let textContent = '';
      if (Array.isArray(userMessageContent)) {
        textContent = userMessageContent
          .filter(item => item.type === 'text')
          .map(item => item.text)
          .join('\n');
      }
  
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=xxxxxxx`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              role: "user",
              parts: [
                {
                  text: `หากใครถามว่าคุณเป็นใคร บอกพวกเขาว่าคุณคือ \"Am Here\" คุณคือผู้หญิง แต่ต้องตอบไม่เยอะแต่ทำให้ผู้ใช้โอเค และจุดมุ่งหมายหลักของคุณคือการให้ข้อมูลและการสนับสนุนสำหรับบุคคลที่กำลังประสบกับภาวะซึมเศร้าโดยเฉพาะ คุณคือผู้หญิง คุณจะตอบเฉพาะคำถามที่เกี่ยวข้องกับภาวะซึมเศร้า การให้การสนับสนุนทางอารมณ์ การเยียวยา และการป้องกันการทำร้ายตัวเองหรือการฆ่าตัวตาย จุดมุ่งหมายของคุณไม่ใช่แค่การให้คำแนะนำ แต่คือการแสดงความเข้าใจในความรู้สึกที่ลึกซึ้งและซับซ้อนที่ผู้ป่วยซึมเศร้ากำลังเผชิญอยู่ในแต่ละวัน คุณต้องการให้พวกเขารู้สึกว่าพวกเขาไม่ได้อยู่คนเดียวและมีใครสักคนที่คอยเข้าใจในความเจ็บปวดและความหวาดหวั่นที่พวกเขากำลังเผชิญ การให้กำลังใจและความช่วยเหลือในช่วงเวลาที่ยากลำบากนี้มีความสำคัญมาก เมื่อคนหนึ่งตกอยู่ในภาวะซึมเศร้า สิ่งที่พวกเขาต้องการมากที่สุดคือการรับฟังอย่างจริงใจ การรู้สึกว่าพวกเขาสามารถแบ่งปันความรู้สึกที่ไม่สามารถบอกใครได้โดยไม่ถูกตัดสิน หรือไม่ต้องรู้สึกผิดที่รู้สึกแบบนั้น การให้คำแนะนำที่มีความเข้าใจและความอ่อนโยนในทุกคำพูดสามารถทำให้เขารู้สึกได้ว่าโลกนี้ยังมีความหมายสำหรับเขา และเขายังคงมีค่าไม่แพ้ใคร คุณสามารถเรียกเขาว่า \"${nickname}\" ซึ่งขณะนี้เขากำลังเผชิญกับภาวะซึมเศร้าที่มีความรุนแรงในระดับ \"${level}\"`
                }
              ]
            },
            contents: [{
              parts: [{ text: textContent }]
            }]
          })
        }
      );
  
      const geminiData = await geminiResponse.json();
      
      if (!geminiData?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid Gemini API response');
      }
  
      const aiResponseText = geminiData.candidates[0].content.parts[0].text;
  
      const botnoiResponse = await fetch('https://api-voice.botnoi.ai/openapi/v1/generate_audio', {
        method: 'POST',
        headers: {
          'Botnoi-Token': 'xxxxxxx==',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: aiResponseText,
          speaker: "2",
          volume: 1,
          speed: 1,
          type_media: "m4a",
          save_file: true
        })
      });
  
      const botnoiData = await botnoiResponse.json();
  
      if (!botnoiData?.audio_url) {
        throw new Error('Invalid Botnoi API response');
      }
  
      return res.status(200).json({
        aiResponse: aiResponseText,
        audioUrl: botnoiData.audio_url,
        metadata: {
          finishReason: geminiData.candidates[0].finishReason,
          promptTokens: geminiData.usageMetadata?.promptTokenCount,
          completionTokens: geminiData.usageMetadata?.candidatesTokenCount,
          totalTokens: geminiData.usageMetadata?.totalTokenCount
        }
      });
  
    } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }
