import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Heart } from 'lucide-react';
const DepressionScreening = ({ isOpen, onClose }) => {
    const [nickname, setNickname] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);

    const handleLogout = async () => {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
        });
        // Clear cookies
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;amToken=" + new Date().toUTCString() + ";path=/");
        });
        // Redirect to home page or login page
        window.location.href = '/';
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };
  
    const questions = [
        "คุณรู้สึกว่าตัวเองล้มเหลวหรือไม่มีความสำเร็จในชีวิตบ่อยแค่ไหน",
        "คุณมีความยากลำบากในการตัดสินใจหรือคิดทบทวนเรื่องต่าง ๆ บ่อยแค่ไหน",
        "คุณรู้สึกเบื่อหน่ายหรือไม่มีความสุขกับสิ่งที่เคยทำแล้วรู้สึกดีบ่อยแค่ไหน",
        "คุณรู้สึกว่าคนรอบตัวไม่เข้าใจหรือสนับสนุนคุณบ่อยแค่ไหน",
        "คุณพบว่าคุณมีความอยากอาหารลดลงหรือเพิ่มขึ้นผิดปกติบ่อยแค่ไหน",
        "คุณรู้สึกว่าชีวิตไม่มีเป้าหมายหรือไม่มีความหมายบ่อยแค่ไหน",
        "คุณรู้สึกว่าความเครียดหรือปัญหาต่าง ๆ ทำให้คุณไม่สามารถจัดการกับชีวิตประจำวันได้บ่อยแค่ไหน",
        "คุณรู้สึกว่าคุณทำสิ่งต่าง ๆ ช้าลงหรือมีประสิทธิภาพลดลงบ่อยแค่ไหน"
      ];      
  
    const options = [
      { value: 0, label: "ไม่เลย" },
      { value: 1, label: "เป็นบางวัน" },
      { value: 2, label: "เป็นบ่อย" },
      { value: 3, label: "เป็นทุกวัน" }
    ];
  
    const calculateResult = () => {
      const total = Object.values(answers).reduce((sum, val) => sum + val, 0);
      if (total >= 12) return "ระดับรุนแรง";
      if (total >= 9) return "ระดับปานกลาง";
      if (total >= 5) return "ระดับเล็กน้อย";
      return "ระดับปกติ";
    };
  
    const handleNext = () => {
      if (currentQuestion < questions.length) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setShowResult(true);
      }
    };
  
    const handleComplete = () => {
      onClose({ nickname, result: calculateResult(), answers });
    };
  
    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>
  
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
                  <Dialog.Title className="text-center mb-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Heart className="w-6 h-6 text-pink-500" />
                      <span className="text-lg font-medium text-gray-900">
                        ยินดีต้อนรับ {nickname}
                      </span>
                    </div>
                  </Dialog.Title>
  
                  <div className="mt-4">
                    {currentQuestion === 0 ? (
                    <div className="space-y-4">
                      <p className="text-center text-gray-600">
                        กรุณาบอกชื่อที่คุณอยากให้เราเรียก
                      </p>
                      <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="ชื่อเล่นของคุณ"
                      />
                      <button
                        onClick={handleNext}
                        disabled={!nickname}
                        className="w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        ถัดไป
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                      >
                        ออกจากระบบ
                      </button>
                    </div>                    
                    ) : showResult ? (
                      <div className="space-y-4">
                        <h3 className="text-center font-medium text-gray-900">
                          ผลการประเมิน
                        </h3>
                        <p className="text-center text-lg font-bold text-pink-600">
                          {calculateResult()}
                        </p>
                        <p className="text-center text-sm text-gray-600">
                          ขอบคุณที่ไว้วางใจเรา เราพร้อมรับฟังและให้คำปรึกษาคุณ
                        </p>
                        <button
                          onClick={handleComplete}
                          className="w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                        >
                          เริ่มการสนทนา
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm text-gray-500">
                            คำถามที่ {currentQuestion} จาก {questions.length}
                          </span>
                          <div className="w-32 h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-pink-500 rounded-full transition-all"
                              style={{
                                width: `${(currentQuestion / questions.length) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                        <p className="text-center text-gray-900 font-medium mb-4">
                          {questions[currentQuestion - 1]}
                        </p>
                        <div className="space-y-2">
                          {options.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setAnswers(prev => ({
                                  ...prev,
                                  [currentQuestion]: option.value
                                }));
                                handleNext();
                              }}
                              className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-pink-50 hover:border-pink-200 transition-colors flex items-center justify-between"
                            >
                              <span>{option.label}</span>
                              <div className="w-4 h-4 rounded-full border border-gray-300" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
};
export default DepressionScreening;