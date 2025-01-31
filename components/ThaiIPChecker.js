import React from 'react';
import { Dialog } from '@headlessui/react';
import { AlertTriangle } from 'lucide-react';
import { useIPCheck } from '../hooks/useIPCheck';

const ThaiIPChecker = ({ children }) => {
  const { result, loading } = useIPCheck();

  const IPErrorModal = ({ isOpen = true }) => {
    return (
      <Dialog
        open={isOpen}
        onClose={() => {}}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white">
            <div className="bg-red-500 rounded-t-2xl p-6">
              <div className="flex justify-center">
                <AlertTriangle className="h-16 w-16 text-white" />
              </div>
            </div>
  
            <div className="p-6 text-center">
              <Dialog.Title className="text-2xl font-bold text-gray-900 mb-4">
                ไม่สามารถเข้าถึงได้
              </Dialog.Title>
              
              <Dialog.Description className="text-lg text-gray-600 mb-6">
                ขออภัย ระบบอนุญาตให้เข้าใช้งานภายในประเทศไทยเท่านั้น
                ไม่สามารถใช้งานผ่าน VPN หรือ Proxy ได้
              </Dialog.Description>
  
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    );
  };

  if (loading) return null;
  if (!result?.isThailand || result?.isCloudflare) return <IPErrorModal />;
  
  return children;
};

export default ThaiIPChecker;