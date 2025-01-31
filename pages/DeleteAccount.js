import React, { useState } from 'react';
import { Trash2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';

const DeleteAccountPage = () => {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        router.push('/');
      } else {
        console.error('Failed to delete account');
      }
    } catch (error) {
      console.error('An error occurred while deleting the account:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
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
              <Trash2 className="h-6 w-6 text-pink-500" />
              <span className="text-xl font-semibold text-gray-900">DeleteAccount</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Trash2 className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-semibold text-gray-900">ลบบัญชี</h2>
          </div>
          
          <div className="space-y-6 text-gray-600">
            <div>
              <h3 className="font-medium text-gray-800 mb-4">ข้อมูลเกี่ยวกับการลบบัญชี</h3>
              <ul className="space-y-2 pl-4 mb-6">
                <li>บัญชีของคุณจะถูกลบออกจากระบบทันที</li>
                <li>ข้อมูลการสนทนาทั้งหมดจะถูกลบถาวร</li>
                <li>คุณสามารถสมัครใหม่ได้ทุกเมื่อด้วยบัญชี Line หรือ Discord</li>
                <li>การกระทำนี้ไม่สามารถเรียกคืนได้</li>
              </ul>
            </div>

            {!isConfirming ? (
              <button
                onClick={() => setIsConfirming(true)}
                className="w-full py-3 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                ต้องการลบบัญชี
              </button>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg text-red-600">
                  คุณแน่ใจหรือไม่ที่จะลบบัญชี? การกระทำนี้ไม่สามารถเรียกคืนได้
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setIsConfirming(false)}
                    className="flex-1 py-3 px-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    ยืนยันการลบบัญชี
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountPage;