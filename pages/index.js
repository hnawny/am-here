import React, { useState, useEffect } from 'react';
import { HeartHandshake, MessageCircle, Sparkles, RefreshCw, Stars, Heart, Smile, Sun } from 'lucide-react';
import { useRouter } from 'next/router';

const AmHereLanding = () => {
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const messages = [
    "ฉันเชื่อว่าคุณเข้มแข็งพอที่จะผ่านช่วงเวลานี้ไปได้",
    "ถ้าวันนี้ไม่ไหว พรุ่งนี้เริ่มใหม่ได้เสมอ",
    "การขอความช่วยเหลือไม่ได้แปลว่าคุณอ่อนแอ แต่มันคือความกล้าหาญ",
    "คุณเก่งมากที่ผ่านมาได้ถึงตรงนี้"
  ];

  const icons = [Stars, Heart, Smile, Sun];
  const [activeIcon, setActiveIcon] = useState(0);

  useEffect(() => {
    const iconInterval = setInterval(() => {
      setActiveIcon((prev) => (prev + 1) % icons.length);
    }, 3000);
    return () => clearInterval(iconInterval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const resetAnimation = () => {
    setIsAnimating(true);
    setShowContent(false);
    setShowButton(false);
    setShowLogo(false);
    setCurrentTextIndex(0);
    setFadeOut(false);
    setAnimationComplete(false);
  };

  useEffect(() => {
    if (!isAnimating) return;

    const messageInterval = setInterval(() => {
      if (currentTextIndex < messages.length - 1) {
        setFadeOut(true);
        setTimeout(() => {
          setCurrentTextIndex(prev => prev + 1);
          setFadeOut(false);
        }, 500);
      } else {
        clearInterval(messageInterval);
        setTimeout(() => {
          setShowLogo(true);
          setTimeout(() => setShowContent(true), 2000);
          setTimeout(() => {
            setShowButton(true);
            setAnimationComplete(true);
            setIsAnimating(false);
          }, 3000);
        }, 1000);
      }
    }, 2500);

    return () => clearInterval(messageInterval);
  }, [currentTextIndex, isAnimating]);

  const CurrentIcon = icons[activeIcon];

  const handleChatTransition = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      const heart = document.getElementById('transition-heart');
      if (heart) {
        heart.classList.add('scale-150', 'opacity-0');
      }
      setTimeout(() => {
        router.push("/chat");
      }, 1000);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Enhanced animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-300/20 via-purple-300/20 to-blue-300/20 animate-gradient opacity-75" />
      
      {/* Improved grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-slide" />
      
      {/* Enhanced mouse follower effect */}
      <div 
        className="pointer-events-none fixed w-96 h-96 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-3xl transition-all duration-300"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transform: 'translate(-50%, -50%)'
        }}
      />
      
      {/* Enhanced floating elements */}
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`,
            transform: `rotate(${Math.random() * 360}deg) scale(${0.3 + Math.random() * 0.7})`
          }}
        >
          {i % 3 === 0 ? (
            <Heart className="w-3 h-3 text-pink-400 opacity-20" />
          ) : i % 3 === 1 ? (
            <Stars className="w-3 h-3 text-purple-400 opacity-20" />
          ) : (
            <Sparkles className="w-3 h-3 text-indigo-400 opacity-20" />
          )}
        </div>
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
      {!showLogo && isAnimating && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div 
            className={`
              w-full max-w-xl mx-auto px-10 py-8 
              rounded-[40px] 
              bg-gradient-to-br from-white/60 to-white/30 
              backdrop-blur-xl 
              border border-white/20 
              shadow-2xl shadow-pink-100/30 
              transform transition-all duration-700 ease-in-out 
              ${fadeOut 
                ? 'opacity-0 scale-90 rotate-3 translate-y-10' 
                : 'opacity-100 scale-100 rotate-0 translate-y-0'
              }
            `}
          >
            <div className="text-2xl font-semibold text-gray-800 text-center relative">
              <CurrentIcon 
                className={`w-10 h-10 text-pink-500 absolute -top-6 -left-6 
                animate-bounce opacity-70`}
              />
              <div className="px-4 py-2">
                {messages[currentTextIndex]}
              </div>
              <CurrentIcon 
                className={`w-10 h-10 text-purple-500 absolute -bottom-6 -right-6 
                animate-bounce opacity-70`}
              />
            </div>
          </div>
        </div>
      )}

        {showLogo && (
          <div className={`transition-all duration-1000 ease-in-out transform ${showContent ? 'scale-50' : 'scale-100'}`}>
            <div className="relative group">
              <HeartHandshake className="w-64 h-64 text-pink-600 animate-pulse relative z-10 group-hover:scale-110 transition-transform duration-2000" />
            </div>
          </div>
        )}

        {isTransitioning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
            <HeartHandshake 
              id="transition-heart"
              className="w-64 h-64 text-pink-600 animate-pulse transition-all duration-1000"
            />
          </div>
        )}

        <h1 className={`text-7xl font-bold mt-8 transition-all duration-1000 transform ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="bg-gradient-to-r from-pink-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent animate-gradient-text">
            Am Here
          </span>
          <span className="text-sm text-gray-400 ml-2 animate-pulse">Chat</span>
        </h1>

        <div className={`max-w-2xl mt-8 text-center space-y-6 transition-all duration-1000 transform ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 font-medium animate-gradient-text">
            เราพร้อมรับฟังและอยู่เคียงข้างคุณ
          </p>
          <p className="text-xl text-gray-600">
            ไม่ว่าคุณจะกำลังเผชิญกับอะไร คุณไม่ได้อยู่คนเดียว
            เรายินดีที่จะรับฟังและให้กำลังใจคุณเสมอ
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={handleChatTransition}
            className={`group mt-8 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 active:translate-y-0.5 relative overflow-hidden ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-center space-x-2 relative z-10">
              <MessageCircle className="w-5 h-5" />
              <span>เริ่มการสนทนา</span>
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse-slow" />
            </div>
          </button>

          {animationComplete && (
            <button
              onClick={resetAnimation}
              className="group mt-3 px-6 py-3 bg-white/90 hover:bg-white text-pink-600 rounded-full text-md font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <RefreshCw className="w-4 h-4 animate-spin-slow relative z-10" />
              <span className="relative z-10">เล่นอนิเมชั่นอีกครั้ง</span>
            </button>
          )}
        </div>


        <div className="mt-8">
          <p className="text-sm text-center text-gray-500">
            Icon By Lucide React AI By Google Ai Studio สามารถอ่านเพิ่มเติมได้ที่ {' '}
            <a href="#" onClick={() => router.push("/Legal")} className="text-pink-600 hover:text-purple-600 hover:underline transition-colors duration-300">ข้อกำหนดการใช้งาน</a>
            {' '}และ{' '}
            <a href="#" onClick={() => router.push("/Legal")} className="text-pink-600 hover:text-purple-600 hover:underline transition-colors duration-300">นโยบายความเป็นส่วนตัว</a>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide {
          0% { background-position: 0 0; }
          100% { background-position: 100% 100%; }
        }
        
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg) scale(1); }
          33% { transform: translateY(-15px) rotate(120deg) scale(1.1); }
          66% { transform: translateY(10px) rotate(240deg) scale(0.9); }
          100% { transform: translateY(0) rotate(360deg) scale(1); }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          animation: gradient 15s ease infinite;
          background-size: 400% 400%;
        }

        .animate-gradient-text {
          animation: gradient 3s ease infinite;
          background-size: 200% auto;
        }

        .animate-slide {
          animation: slide 20s linear infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }

        .bg-grid-pattern {
          background-image: 
            radial-gradient(circle, rgba(255,182,193,0.1) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,182,193,0.1) 1px, transparent 1px);
          background-size: 30px 30px;
          background-position: 0 0, 15px 15px;
        }
      `}</style>

      {/* Decorative elements */}
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
      
      {/* Corner decorations */}
      <div className="fixed top-0 left-0 w-64 h-64">
        <div className="absolute w-full h-full bg-gradient-to-br from-pink-300/20 to-transparent transform -rotate-45" />
      </div>
      <div className="fixed top-0 right-0 w-64 h-64">
        <div className="absolute w-full h-full bg-gradient-to-bl from-purple-300/20 to-transparent transform rotate-45" />
      </div>
      <div className="fixed bottom-0 left-0 w-64 h-64">
        <div className="absolute w-full h-full bg-gradient-to-tr from-indigo-300/20 to-transparent transform rotate-45" />
      </div>
      <div className="fixed bottom-0 right-0 w-64 h-64">
        <div className="absolute w-full h-full bg-gradient-to-tl from-pink-300/20 to-transparent transform -rotate-45" />
      </div>

      {/* Animated orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute w-32 h-32 rounded-full mix-blend-multiply filter blur-xl opacity-30"
            style={{
              background: `radial-gradient(circle, ${
                i % 3 === 0 ? 'rgba(244,114,182,0.4)' : 
                i % 3 === 1 ? 'rgba(168,85,247,0.4)' : 
                'rgba(99,102,241,0.4)'
              } 0%, transparent 70%)`,
              animation: `float ${8 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * -2}s`,
              left: `${10 + (i * 80) % 80}%`,
              top: `${20 + (i * 60) % 60}%`
            }}
          />
        ))}
      </div>

      {/* Interactive elements */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Additional animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { transform: scale(0.3); opacity: 0.3; }
          50% { transform: scale(1); opacity: 0.7; }
        }

        @keyframes wave {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(5deg); }
          75% { transform: translateY(15px) rotate(-5deg); }
        }

        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .animate-wave {
          animation: wave 6s ease-in-out infinite;
        }

        .animate-pulse-ring {
          animation: pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.2) 50%,
            rgba(255,255,255,0) 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }

        .hover-lift {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .hover-lift:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
};

export default AmHereLanding;