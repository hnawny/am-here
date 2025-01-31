import React from 'react';

const AmHereUI = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center">
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
            Am Here - ผู้ช่วย AI สำหรับสุขภาพจิต
          </h1>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* บทนำ */}
          <section className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-300 pb-2">
              บทนำ
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Am Here คือผู้ช่วยสนทนาที่ใช้ AI เพื่อสนับสนุนผู้ที่ประสบปัญหาสุขภาพจิต
              โดยเฉพาะภาวะซึมเศร้า เป้าหมายคือการสร้างพื้นที่ที่เข้าถึงง่ายและเต็มไปด้วยความเข้าใจ
              สำหรับผู้ที่ต้องการคำแนะนำและการสนับสนุน
            </p>
          </section>

          {/* เป้าหมายหลัก */}
          <section className="bg-purple-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-300 pb-2">
              เป้าหมายหลัก
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <svg className="w-6 h-6 text-purple-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                สร้างความรู้สึกปลอดภัยและความไว้วางใจในการสนทนา
              </li>
              <li className="flex items-center">
                <svg className="w-6 h-6 text-purple-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                เสนอวิธีรับมือเบื้องต้นและการสนับสนุนด้านอารมณ์
              </li>
              <li className="flex items-center">
                <svg className="w-6 h-6 text-purple-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                เชื่อมต่อผู้ใช้งานกับผู้เชี่ยวชาญเมื่อจำเป็น
              </li>
            </ul>
          </section>

          {/* สถาปัตยกรรมระบบ */}
          <section className="bg-green-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-green-300 pb-2">
              สถาปัตยกรรมระบบ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white shadow-md rounded-lg p-5">
                <h3 className="text-xl font-semibold text-green-700 mb-3">Frontend</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• ส่วนติดต่อผู้ใช้ที่ใช้งานง่าย</li>
                  <li>• รองรับการใช้งานข้ามอุปกรณ์</li>
                </ul>
              </div>
              <div className="bg-white shadow-md rounded-lg p-5">
                <h3 className="text-xl font-semibold text-green-700 mb-3">Backend</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• โมเดล NLP สำหรับการวิเคราะห์</li>
                  <li>• การวิเคราะห์อารมณ์</li>
                  <li>• การจัดเก็บข้อมูลชั่วคราว</li>
                </ul>
              </div>
              <div className="bg-white shadow-md rounded-lg p-5">
                <h3 className="text-xl font-semibold text-green-700 mb-3">Integration</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• เชื่อมต่อฐานข้อมูลผู้เชี่ยวชาญ</li>
                  <li>• API แจ้งเตือนฉุกเฉิน</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ผู้จัดทำ */}
          <section className="bg-gray-100 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ข้อมูลผู้จัดทำ
            </h2>
            <div className="text-gray-700 space-y-2">
              <p>จัดทำโดย: <span className="font-semibold">ธีรภัทร์ ถาวัง</span></p>
              <p>สถาบัน: วิทยาลัยเทคโนโลยีโปลิเทคนิคลานนา เชียงใหม่</p>
              <p>สาขา: เทคโนโลยีสารสนเทศ IT.4501</p>
              <p className="mt-4">
                <a 
                  href="mailto:support.am.here@hnawny.dev" 
                  className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                >
                  support.am.here@hnawny.dev
                </a>
              </p>
            </div>
          </section>

          {/* ปุ่มทดลองใช้งาน */}
          <div className="flex justify-center py-6">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white 
              px-8 py-3 rounded-full text-lg font-bold 
              hover:from-blue-600 hover:to-purple-700 
              transform hover:scale-105 transition-all 
              shadow-lg hover:shadow-xl">
              ทดลองใช้งาน Am Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmHereUI;