import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Volume2, CheckCircle2 } from 'lucide-react';

const OnboardingCarousel = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Mic className="w-16 h-16 text-pink-500" />,
      title: "ยินดีต้อนรับสู่การแชทด้วยเสียง",
      description: "กดปุ่มไมโครโฟนค้างเอาไว้เพื่อเริ่มพูด",
      color: "from-pink-50 to-purple-50"
    },
    {
      icon: <Volume2 className="w-16 h-16 text-blue-500" />,
      title: "ฟังการตอบกลับ",
      description: "ระบบจะสร้างเสียงตอบกลับให้คุณอัตโนมัติ",
      color: "from-blue-50 to-indigo-50"
    },
    {
      icon: <CheckCircle2 className="w-16 h-16 text-green-500" />,
      title: "เริ่มใช้งานได้เลย!",
      description: "คุณพร้อมสนทนากับ AI แล้ว",
      color: "from-green-50 to-teal-50"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`
        w-80 h-96 rounded-2xl p-6 flex flex-col items-center justify-between
        bg-gradient-to-br ${steps[currentStep].color} shadow-xl
      `}>
        <div className="flex flex-col items-center space-y-4 text-center">
          {steps[currentStep].icon}
          <h2 className="text-xl font-bold text-gray-800">
            {steps[currentStep].title}
          </h2>
          <p className="text-gray-600">
            {steps[currentStep].description}
          </p>
        </div>

        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <div 
              key={index} 
              className={`
                w-3 h-3 rounded-full transition-all 
                ${currentStep === index ? 'bg-gray-800 w-6' : 'bg-gray-400'}
              `}
            />
          ))}
        </div>

        <button 
          onClick={handleNext}
          className="w-full py-3 bg-white/80 rounded-full font-semibold text-gray-800 hover:bg-white/90 transition-all"
        >
          {currentStep < steps.length - 1 ? 'ถัดไป' : 'เริ่มใช้งาน'}
        </button>
      </div>
    </div>
  );
};

const VoiceOnboardingExperience = () => {
  const [stage, setStage] = useState('animation');

  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setStage('mic-permission');
    }, 1000);

    return () => clearTimeout(animationTimer);
  }, []);

  const handleMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setStage('onboarding-carousel');
    } catch (error) {
      console.error('Mic permission denied', error);
    }
  };

  const AnimationStage = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center z-50"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          repeatType: "loop" 
        }}
      >
        <Mic className="w-32 h-32 text-white" />
      </motion.div>
    </motion.div>
  );

  const MicPermissionStage = () => (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center space-y-6 p-6  z-50">
      <Mic className="w-24 h-24 text-blue-500" />
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        ขออนุญาตใช้ไมโครโฟน
      </h2>
      <p className="text-gray-600 text-center">
        เราต้องการสิทธิ์ในการใช้ไมโครโฟนเพื่อการสนทนาด้วยเสียง
      </p>
      <button 
        onClick={handleMicPermission}
        className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600"
      >
        อนุญาต
      </button>
    </div>
  );

  return (
    <>
      {stage === 'animation' && <AnimationStage />}
      {stage === 'mic-permission' && <MicPermissionStage />}
      {stage === 'onboarding-carousel' && (
        <OnboardingCarousel onClose={() => setStage('completed')} />
      )}
    </>
  );
};

export default VoiceOnboardingExperience;
