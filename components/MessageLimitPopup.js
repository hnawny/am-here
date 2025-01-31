import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Unlock } from 'lucide-react';
import { useRouter } from 'next/router';

export default function MessageLimitPopup({ isOpen, onClose }) {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push('/chat');
    onClose();
  };

  return (
    <Dialog 
      as="div" 
      className="relative z-50" 
      open={isOpen} 
      onClose={onClose}
    >
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </Transition.Child>

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel 
            className="w-full max-w-md transform overflow-hidden rounded-2xl 
            bg-gradient-to-br from-red-500/80 to-pink-600/80 
            p-6 text-center shadow-xl transition-all 
            border border-white/20"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="space-y-4">
              <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2" 
                  className="w-12 h-12"
                >
                  <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
                </svg>
              </div>
              
              <Dialog.Title 
                as="h3" 
                className="text-2xl font-bold text-white"
              >
                หมดสิทธิ์พูดคุย
              </Dialog.Title>
              
              <p className="text-white/90 text-md">
                คุณได้ใช้สิทธิ์พูดคุยครบ 3 ครั้งแล้ววันนี้ 
                กรุณากลับมาใหม่ในวันถัดไป
              </p>
              
              <div className="space-y-2">
                <button 
                  onClick={handleUpgrade}
                  className="mt-4 w-full bg-white text-red-600 font-semibold py-3 rounded-xl 
                  hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                >
                  <Unlock className="w-5 h-5" />
                  ใช้แชทแบบไม่จำกัด
                </button>

                <button 
                  onClick={onClose}
                  className="w-full text-white hover:bg-white/10 py-3 rounded-xl 
                  transition-all"
                >
                  เข้าใจแล้ว
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </Dialog>
  );
}