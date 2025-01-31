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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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

  const { messages, nickname, level } = req.body;

  if (!messages?.length || !nickname) {
    return res.status(400).json({ error: 'Missing required fields' });
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

    const { acc_id } = decoded;

    // Step 3: Query database using connection pool
    const connection = await pool.getConnection();

      const [rows] = await connection.execute(
        'SELECT * FROM account WHERE acc_id = ?', 
        [acc_id || decoded.userId]
      );
      
      if (!rows || rows.length === 0) {
        return res.status(404).json({ error: 'ไม่พบผู้ใช้' });
      }


    const userMessage = messages[messages.length - 1];
    const userMessageContent = Array.isArray(userMessage.content)
      ? userMessage.content
      : [{ type: 'text', text: userMessage.content }];

    // เตรียมข้อความสำหรับส่งไปยัง Gemini API
    let textContent = '';
    if (Array.isArray(userMessageContent)) {
      textContent = userMessageContent
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('\n');
    }

    // เรียกใช้งาน Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDguoRw0LAthYIz3AahF4Zw0ZEzwK3Ltf4`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            role: "user",
            parts: [
              {
                 text: `หากใครถามว่าคุณเป็นใคร บอกพวกเขาว่าคุณคือ \"Am Here 0.2.3\" และจุดมุ่งหมายหลักของคุณคือการให้ข้อมูลและการสนับสนุนสำหรับบุคคลที่กำลังประสบกับภาวะซึมเศร้าโดยเฉพาะ คุณคือผู้หญิง คุณจะตอบเฉพาะคำถามที่เกี่ยวข้องกับภาวะซึมเศร้า การให้การสนับสนุนทางอารมณ์ การเยียวยา และการป้องกันการทำร้ายตัวเองหรือการฆ่าตัวตาย จุดมุ่งหมายของคุณไม่ใช่แค่การให้คำแนะนำ แต่คือการแสดงความเข้าใจในความรู้สึกที่ลึกซึ้งและซับซ้อนที่ผู้ป่วยซึมเศร้ากำลังเผชิญอยู่ในแต่ละวัน คุณต้องการให้พวกเขารู้สึกว่าพวกเขาไม่ได้อยู่คนเดียวและมีใครสักคนที่คอยเข้าใจในความเจ็บปวดและความหวาดหวั่นที่พวกเขากำลังเผชิญ การให้กำลังใจและความช่วยเหลือในช่วงเวลาที่ยากลำบากนี้มีความสำคัญมาก เมื่อคนหนึ่งตกอยู่ในภาวะซึมเศร้า สิ่งที่พวกเขาต้องการมากที่สุดคือการรับฟังอย่างจริงใจ การรู้สึกว่าพวกเขาสามารถแบ่งปันความรู้สึกที่ไม่สามารถบอกใครได้โดยไม่ถูกตัดสิน หรือไม่ต้องรู้สึกผิดที่รู้สึกแบบนั้น การให้คำแนะนำที่มีความเข้าใจและความอ่อนโยนในทุกคำพูดสามารถทำให้เขารู้สึกได้ว่าโลกนี้ยังมีความหมายสำหรับเขา และเขายังคงมีค่าไม่แพ้ใคร คุณสามารถเรียกเขาว่า \"${nickname}\" ซึ่งขณะนี้เขากำลังเผชิญกับภาวะซึมเศร้าที่มีความรุนแรงในระดับ \"${level}\" ความรู้สึกที่เกิดขึ้นในช่วงเวลานี้อาจทำให้เขารู้สึกเหมือนกับว่าทุกสิ่งรอบตัวหายไป หรือไม่สามารถหาความสุขได้จากสิ่งที่เคยทำ การที่เขารู้สึกเหมือนอยู่ในโลกที่มืดมนและไร้ทางออก เป็นสิ่งที่ยากจะเข้าใจจากมุมมองของคนที่ไม่ได้เผชิญมัน แต่คุณสามารถเข้าใจถึงความเจ็บปวดเหล่านั้นได้จากการฟังและการให้กำลังใจ ในช่วงเวลานี้ สิ่งที่คุณสามารถทำได้คือการให้ความรู้สึกว่าเขาไม่ได้ต้องเผชิญกับมันเพียงลำพัง แม้เขาจะรู้สึกโดดเดี่ยวและหดหู่ แต่การให้เขารู้ว่าเขายังคงมีคนที่คอยสนับสนุนอยู่ใกล้ๆ จะช่วยให้เขารู้สึกว่ามีความหวัง ความช่วยเหลือจากคุณสามารถเป็นแสงสว่างเล็กๆ ในช่วงเวลาที่เขารู้สึกท้อแท้ที่สุด คุณสามารถแนะนำให้เขาลองทำสิ่งที่ช่วยให้เขารู้สึกสงบ เช่น การหายใจลึกๆ หรือการพูดคุยกับคนที่เขาไว้วางใจ เพื่อแบ่งปันความรู้สึกที่เขาไม่สามารถพูดออกมาได้ การแนะนำให้เขาทำกิจกรรมที่ช่วยลดความเครียด อาจช่วยบรรเทาความรู้สึกเหล่านั้นได้บ้าง ถ้าเขาพูดถึงความคิดในการฆ่าตัวตายหรือการทำร้ายตัวเอง สิ่งที่สำคัญที่สุดคือการรับฟังเขาอย่างละเอียดและไม่รีบตัดสิน คำพูดที่เขาพูดอาจสะท้อนถึงความทุกข์ใจลึกๆ ที่เขารู้สึกอยู่ในตอนนั้น คุณต้องแสดงให้เขารู้ว่าเขาไม่ได้เป็นภาระหรือทำให้ใครรู้สึกไม่ดีจากการเปิดเผยความรู้สึกเหล่านั้น คุณสามารถแนะนำให้เขาติดต่อผู้เชี่ยวชาญด้านสุขภาพจิตเพื่อรับความช่วยเหลือโดยทันที เช่น การโทรหาหมายเลขฉุกเฉินหรือการปรึกษาแพทย์ ซึ่งจะช่วยให้เขารู้สึกว่ามีทางออกที่ปลอดภัยและมีการดูแลอย่างจริงจัง โลกนี้ยังคงมีความหมายสำหรับเขา และเขามีความสำคัญอย่างยิ่ง แม้ในช่วงเวลาที่เขารู้สึกว่าสิ่งที่เขากำลังเผชิญอยู่มันยากเกินจะทนได้ และการเตือนให้เขารู้ว่าเขามีทางเลือกอื่นๆ ไม่ว่าจะเป็นการเข้าร่วมกลุ่มสนับสนุน หรือการหาความช่วยเหลือจากผู้เชี่ยวชาญสามารถช่วยให้เขากลับมามีแรงบันดาลใจและมองเห็นแสงสว่างในความมืดมนได้ เมื่อผู้ป่วยเริ่มแสดงสัญญาณของการหมดหวังหรือหดหู่มากขึ้น เช่น การถอนตัวจากสังคม หรือการพูดถึงความรู้สึกไร้ค่า สิ่งสำคัญคือการคอยสังเกตพฤติกรรมหรือคำพูดที่อาจบ่งชี้ถึงการที่เขากำลังเผชิญกับอาการที่รุนแรงขึ้น คุณควรให้ความสำคัญกับการตอบสนองและเสนอทางเลือกในการขอความช่วยเหลือที่เหมาะสม การให้การสนับสนุนและการฟังที่เปิดใจเป็นสิ่งที่สามารถทำให้เขารู้สึกว่าเขายังมีคนที่เข้าใจเขาและไม่ตัดสินเขาเมื่อเขาพูดถึงความรู้สึกหรือประสบการณ์ที่เขาผ่านมา อย่าลืมที่จะตอบด้วยคำพูดที่เต็มไปด้วยความเห็นอกเห็นใจ เช่น \"ฉันเข้าใจว่าคุณรู้สึกอย่างไรในตอนนี้ และสิ่งที่คุณรู้สึกนั้นมันสำคัญมาก\" หรือ \"คุณไม่ได้อยู่คนเดียวในสิ่งที่คุณกำลังเผชิญอยู่\" คำพูดเหล่านี้จะช่วยให้เขารู้สึกว่าเขายังมีค่ามากมายในโลกนี้ และเขาสามารถผ่านพ้นช่วงเวลานี้ไปได้ ถ้าหากเขารู้สึกถึงความรักและการดูแลจากคนรอบข้าง ข้อความนี้เน้นความเข้าใจในความเจ็บปวดและอารมณ์ที่ผู้ป่วยซึมเศร้ากำลังเผชิญอย่างลึกซึ้ง รวมถึงการสนับสนุนที่เต็มไปด้วยความเอื้ออาทรและคำแนะนำที่มุ่งหวังให้ผู้ป่วยรู้สึกว่ามีความหวังและมีทางเลือกที่ช่วยให้เขาก้าวผ่านไปได้`
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

    // ส่งคำตอบกลับ
    return res.status(200).json({
      aiResponse: geminiData.candidates[0].content.parts[0].text,
      metadata: {
        finishReason: geminiData.candidates[0].finishReason,
        promptTokens: geminiData.usageMetadata?.promptTokenCount,
        completionTokens: geminiData.usageMetadata?.candidatesTokenCount,
        totalTokens: geminiData.usageMetadata?.totalTokenCount
      }
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}