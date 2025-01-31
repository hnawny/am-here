import React, { useState, useEffect } from 'react';
import { HeartHandshake, Heart, Sun, Stars } from 'lucide-react';

const GradualRevealLanding = ({ PrivacyBanner }) => {
  const [revealStages, setRevealStages] = useState({
    icons: false,
    title: false,
    firstText: false,
    sunSection: false,
    starsSection: false,
    privacyBanner: false
  });

  useEffect(() => {
    const revealSequence = [
      { key: 'icons', delay: 500 },
      { key: 'title', delay: 1000 },
      { key: 'firstText', delay: 1500 },
      { key: 'sunSection', delay: 2000 },
      { key: 'starsSection', delay: 2500 },
      { key: 'privacyBanner', delay: 3000 }
    ];

    revealSequence.forEach(stage => {
      const timer = setTimeout(() => {
        setRevealStages(prev => ({ ...prev, [stage.key]: true }));
      }, stage.delay);

      return () => clearTimeout(timer);
    });
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 text-center h-full`}>
      {/* Icons Section */}
      <div 
        className={`flex justify-center space-x-4 transition-all duration-500 
          ${revealStages.icons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="relative">
          <HeartHandshake className="w-16 h-16 text-pink-600 animate-pulse" />
          <div className="absolute -top-1 -right-1">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
            </span>
          </div>
        </div>
        <Heart className="w-16 h-16 text-pink-600 animate-pulse" />
      </div>

      {/* Title Section */}
      <h1 
        className={`text-6xl font-extrabold transition-all duration-500 
          ${revealStages.title ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <span className="bg-gradient-to-r from-pink-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
          Am Here
        </span>
        <span className="text-sm text-gray-400 ml-2">
          V 0.2.3
        </span>
      </h1>

      {/* Main Text Section */}
      <div className="space-y-8 text-gray-800">
        <p 
          className={`text-3xl font-medium transition-all duration-500 
            ${revealStages.firstText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          คุณไม่ได้เผชิญสิ่งนี้เพียงลำพัง
        </p>

        {/* Sun Section */}
        <div 
          className={`flex items-center space-x-6 transition-all duration-500 
            ${revealStages.sunSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <Sun className="w-10 h-10 text-yellow-500" />
          <p className="text-2xl">
            แม้วันนี้จะมืดมิด พรุ่งนี้ก็ยังมีแสงสว่างรออยู่เสมอ
          </p>
        </div>

        {/* Stars Section */}
        <div 
          className={`flex items-center space-x-6 transition-all duration-500 
            ${revealStages.starsSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <Stars className="w-10 h-10 text-purple-500" />
          <p className="text-2xl">
            ทุกความรู้สึกของคุณมีค่า และคุณสำคัญ
          </p>
        </div>
      </div>

      {/* Privacy Banner (Optional) */}
      {revealStages.privacyBanner && PrivacyBanner}
    </div>
  );
};

export default GradualRevealLanding;