import React, { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { Mic, ChevronLeft, Sparkles, Volume2, Zap } from 'lucide-react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const FeatureAnnouncement = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!localStorage.getItem('hasSeenFeatureAnnouncementV3')) {
        setIsVisible(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleHide = () => {
    setIsHidden(!isHidden);
  };

  const handleShowAgain = () => {
    setIsHidden(false);
  };

  const features = [
    { icon: Volume2, text: 'พูดคุยด้วยเสียงได้แล้ววันนี้' },
    { icon: Zap, text: 'รองรับภาษาไทย-อังกฤษ' },
    { icon: Sparkles, text: 'ฟังก์ชันแปลงเสียงเป็นข้อความ' }
  ];

  return (
    <>
      {isHidden && (
        <motion.button 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShowAgain}
          className="fixed bottom-48 right-0 bg-gradient-to-r from-pink-600 to-purple-600 
                     text-white p-3 rounded-l-full shadow-xl z-50 flex items-center space-x-2"
        >
          <Mic className="h-5 w-5" />
          <span className="text-sm hidden sm:block">ฟีเจอร์ใหม่</span>
        </motion.button>
      )}

      <Transition
        show={isVisible && !isHidden}
        enter="transform transition duration-500 ease-out"
        enterFrom="translate-x-full opacity-0"
        enterTo="translate-x-0 opacity-100"
        leave="transform transition duration-300 ease-in"
        leaveFrom="translate-x-0 opacity-100"
        leaveTo="translate-x-full opacity-0"
      >
        {/* Original component remains the same as in the previous implementation */}
        <div className="fixed bottom-24 right-0 max-w-sm z-50">
          <button 
            onClick={handleHide} 
            className="absolute -left-6 top-1/2 -translate-y-1/2 
                        bg-white/10 backdrop-blur-sm p-2 pl-4 pr-2 rounded-full shadow-lg 
                        flex items-center z-50 hover:bg-white/20 transition-all"
          > 
            <ChevronLeft className="h-5 w-5 text-white/70" />
            <span className="text-xs text-white/70 hidden sm:block">Hide</span>
          </button>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-gradient-to-br from-gray-900 via-purple-900 to-black rounded-3xl shadow-2xl border border-purple-800/50 relative overflow-hidden"
          >
            {/* Rest of the original component content remains the same */}
            <div className="relative px-6 pt-6 pb-8">
              <div className="flex items-center space-x-3 mb-4">
                <motion.div 
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 0.9, 1]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2,
                    ease: "easeInOut"
                  }}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 p-3 rounded-2xl"
                >
                  <Mic className="h-6 w-6 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  ฟีเจอร์ใหม่! ✨
                </h3>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                // onClick={() => router.push('/talk')}
                onClick={() => router.push('/VoiceChatMaintenance')}
                className="w-full p-4 mb-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-3 shadow-xl"
              >
                <Mic className="h-6 w-6" />
                <span>ทดลองคุยด้วยเสียง</span>
              </motion.button>

              <div className="space-y-3">
                {features.map((feature, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 text-white/80 bg-white/10 backdrop-blur-sm p-3 rounded-xl"
                  >
                    <feature.icon className="h-5 w-5 text-purple-400" />
                    <p className="text-sm">{feature.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600">
              <p className="text-xs text-white/80 text-center">
                ลองใช้งานฟีเจอร์ใหม่วันนี้ ❤️
              </p>
            </div>
          </motion.div>
        </div>
      </Transition>
    </>
  );
};

export default FeatureAnnouncement;