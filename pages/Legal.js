import React, { useState } from 'react';
import { Shield, Lock, ArrowLeft, Heart, Phone } from 'lucide-react';
import { useRouter } from 'next/router'
 
const LegalPages = () => {
  const [activePage, setActivePage] = useState('terms');
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => router.push('/chat')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>กลับ</span>
            </button>
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-pink-500" />
              <span className="text-xl font-semibold text-gray-900">Am Here Chat</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActivePage('terms')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              activePage === 'terms' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Shield className="h-5 w-5" />
            <span>ข้อกำหนดการใช้งาน</span>
          </button>
          <button
            onClick={() => setActivePage('privacy')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              activePage === 'privacy' 
                ? 'bg-green-100 text-green-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Lock className="h-5 w-5" />
            <span>นโยบายความเป็นส่วนตัว</span>
          </button>
          <button
            onClick={() => setActivePage('contact')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              activePage === 'contact' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Phone className="h-5 w-5" />
            <span>ข้อมูลการติดต่อ</span>
          </button>
        </div>

        {activePage === 'terms' ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Shield className="h-6 w-6 text-indigo-500" />
              <h2 className="text-2xl font-semibold text-gray-900">ข้อกำหนดการใช้งาน</h2>
            </div>
            <div className="space-y-6 text-gray-600">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">1. เกี่ยวกับระบบ</h3>
                <ul className="space-y-2 pl-4">
                  <li>Am Here Chat เป็นระบบช่วยเหลือผู้ที่มีภาวะซึมเศร้าโดยใช้ AI จาก Google Studio และ Botnoi Voice ในการตอบแบบเสียง</li>
                  <li>พัฒนาโดย Hnawny Cloud Group เพื่อสนับสนุนการดูแลสุขภาพจิตและความเป็นอยู่ที่ดี</li>
                  <li>ให้บริการผ่านแชทบอท AI ที่ออกแบบมาเพื่อรับฟัง ให้กำลังใจ และคำแนะนำเบื้องต้น</li>
                  <li>เป็นบริการฟรีที่เข้าถึงได้ตลอด 24 ชั่วโมง ไม่มีค่าใช้จ่ายใดๆ</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">2. วัตถุประสงค์การใช้งาน</h3>
                <ul className="space-y-2 pl-4">
                  <li>ให้การสนับสนุนทางจิตใจเบื้องต้นแก่ผู้ที่มีภาวะซึมเศร้าหรือความเครียด</li>
                  <li>สร้างพื้นที่ปลอดภัยสำหรับการแบ่งปันความรู้สึกและความกังวล</li>
                  <li>ไม่ใช่บริการทางการแพทย์และไม่สามารถทดแทนการพบแพทย์หรือผู้เชี่ยวชาญ</li>
                  <li>ช่วยแนะนำแหล่งความช่วยเหลือที่เหมาะสมเมื่อจำเป็น</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">3. การใช้งานที่เหมาะสม</h3>
                <ul className="space-y-2 pl-4">
                  <li>ใช้ภาษาที่สุภาพและเหมาะสมในการสนทนา</li>
                  <li>หลีกเลี่ยงการแชร์ข้อมูลส่วนตัวที่ละเอียดอ่อน เช่น เลขบัตรประชาชน ที่อยู่ เบอร์โทร</li>
                  <li>ใช้บริการด้วยความเคารพและไม่ละเมิดสิทธิผู้อื่น</li>
                  <li>แจ้งเจ้าหน้าที่ทันทีหากพบการใช้งานที่ไม่เหมาะสม</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">4. ข้อจำกัดการใช้งาน</h3>
                <ul className="space-y-2 pl-4">
                  <li>ระบบไม่สามารถวินิจฉัยโรค สั่งจ่ายยา หรือให้การรักษาทางการแพทย์</li>
                  <li>คำแนะนำที่ได้รับเป็นเพียงข้อมูลทั่วไป ไม่ใช่คำแนะนำทางการแพทย์</li>
                  <li>ห้ามใช้ระบบในทางที่ผิดกฎหมายหรือก่อให้เกิดความเสียหาย</li>
                  <li>Hnawny Cloud Group ขอสงวนสิทธิ์ในการระงับการให้บริการหากพบการใช้งานที่ไม่เหมาะสม</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">5. กรณีฉุกเฉิน</h3>
                <ul className="space-y-2 pl-4">
                  <li>หากมีความคิดทำร้ายตัวเองหรือผู้อื่น กรุณาติดต่อสายด่วนสุขภาพจิต 1323 ทันที</li>
                  <li>ในกรณีฉุกเฉินทางการแพทย์ โทร 1669 หรือไปพบแพทย์ที่โรงพยาบาลใกล้บ้าน</li>
                  <li>ระบบจะแนะนำให้ติดต่อผู้เชี่ยวชาญหากพบสัญญาณของภาวะวิกฤติ</li>
                </ul>
              </div>
            </div>
          </div>
        ) : activePage === 'privacy' ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Lock className="h-6 w-6 text-green-500" />
              <h2 className="text-2xl font-semibold text-gray-900">นโยบายความเป็นส่วนตัว</h2>
            </div>
            <div className="space-y-6 text-gray-600">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">1. ข้อมูลที่ไม่จัดเก็บ</h3>
                <ul className="space-y-2 pl-4">
                  <li>เลขบัตรประชาชนหรือเอกสารระบุตัวตนใดๆ</li>
                  <li>ที่อยู่ เบอร์โทรศัพท์ หรือข้อมูลการติดต่อส่วนตัว</li>
                  <li>ชื่อจริง นามสกุล หรือข้อมูลส่วนบุคคลอื่นๆ</li>
                  <li>ข้อมูลทางการเงินหรือข้อมูลบัตรเครดิต</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">2. การจัดการข้อมูลสนทนา</h3>
                <ul className="space-y-2 pl-4">
                  <li>ข้อความสนทนาทั้งหมดจะถูกลบโดยอัตโนมัติภายใน 10-15 นาทีหลังจบการสนทนา</li>
                  <li>ไม่มีการบันทึกหรือจัดเก็บประวัติการสนทนาไว้บนเซิร์ฟเวอร์</li>
                  <li>ข้อมูลจะถูกเข้ารหัสระหว่างการส่งเพื่อความปลอดภัย</li>
                  <li>ไม่มีการแชร์ข้อมูลให้บุคคลที่สามหรือนำไปใช้เพื่อการพาณิชย์</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">3. ความปลอดภัยของข้อมูล</h3>
                <ul className="space-y-2 pl-4">
                  <li>ใช้การเข้ารหัสข้อมูลแบบ End-to-end encryption</li>
                  <li>เซิร์ฟเวอร์ตั้งอยู่ในประเทศไทยและได้มาตรฐานความปลอดภัย</li>
                  <li>มีระบบป้องกันการโจมตีและการเข้าถึงข้อมูลโดยไม่ได้รับอนุญาต</li>
                  <li>ตรวจสอบและอัปเดตระบบความปลอดภัยอย่างสม่ำเสมอ</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">4. สิทธิ์ของผู้ใช้งาน</h3>
                <ul className="space-y-2 pl-4">
                  <li>สามารถเข้าใช้งานผ่านบัญชี Line หรือ Discord เพื่อความสะดวก โดยระบบจะไม่เก็บข้อมูลส่วนตัวใดๆ นอกจาก ID ที่ใช้ในการยืนยันตัวตนเท่านั้น</li>
                  <li>การเชื่อมต่อผ่าน Line และ Discord ใช้ระบบความปลอดภัยมาตรฐานและไม่สามารถเข้าถึงข้อมูลส่วนตัวของผู้ใช้</li>
                  <li>ผู้ใช้มีสิทธิ์ถอนการเชื่อมต่อบัญชี Line หรือ Discord ได้ตลอดเวลา</li>
                  <li>มีสิทธิ์ที่จะไม่เปิดเผยข้อมูลส่วนตัวเพิ่มเติมใดๆ ในระหว่างการใช้งาน</li>
                  <li>สามารถแจ้งความกังวลเกี่ยวกับความเป็นส่วนตัวได้ตลอดเวลา</li>
                  <li>มีสิทธิ์ในการร้องเรียนหากพบการละเมิดความเป็นส่วนตัว</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Phone className="h-6 w-6 text-blue-500" />
              <h2 className="text-2xl font-semibold text-gray-900">ข้อมูลการติดต่อ</h2>
            </div>
            <div className="space-y-6 text-gray-600">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Hnawny Cloud Group</h3>
                <ul className="space-y-2 pl-4">
                  <li>ที่อยู่: บ้านเลขที่ 30 หมู่ 1 บ้านหลวง ต.แม่ตื่น อ.อมก๋๋อย จ.เชียงใหม่ 50310</li>
                  <li>โทรศัพท์: 052-072-602 (09:00 - 16:30 น)</li>
                  <li>อีเมล: support.am.here@hnawny.dev</li>
                  <li>เว็บไซต์: <a href="https://hnawny.in.th" className="text-blue-500 hover:underline">hnawny.in.th</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">สายด่วนสุขภาพจิต</h3>
                <ul className="space-y-2 pl-4">
                  <li>สายด่วนสุขภาพจิต 1323 (ให้บริการตลอด 24 ชั่วโมง)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalPages;