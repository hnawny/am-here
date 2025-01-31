import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { HeartHandshake, Heart, Sun, Stars, Loader2 } from 'lucide-react';

export default function DiscordAuth() {
  const router = useRouter();
  const { code, state } = router.query;

    useEffect(() => {
        const fetchData = async () => {
            if (code) {
                try {
                    console.log('Received code:', code);
                    const response = await fetch(`/api/auth/discord/callback?code=${code}&state=${state}`);
                    const data = await response.json();
                    console.log('API response:', data);
                    if (data.token) {
                        document.cookie = `amToken=${data.token}; path=/`;
                        router.push('/chat'); // Redirect to dashboard or any other page
                    } else if (data.authorizeUrl) {
                        window.location.href = data.authorizeUrl;
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };

        fetchData();
    }, [code, state]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-pink-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center space-y-8">
          {/* Logo and brand section */}
          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              <div className="relative">
                <HeartHandshake className="w-16 h-16 text-pink-600 animate-pulse" />
                <div className="absolute -top-1 -right-1">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inDiscord-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inDiscord-flex rounded-full h-3 w-3 bg-pink-500"></span>
                  </span>
                </div>
              </div>
              <Heart className="w-16 h-16 text-pink-600 animate-pulse" />
            </div>
            
            <h1 className="text-6xl font-extrabold">
              <span className="bg-gradient-to-r from-pink-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                Am Here
              </span>
              <span className="text-sm text-gray-400 ml-2">V 0.2.3</span>
            </h1>
          </div>

          {/* Loading animation */}
          <div className="flex justify-center">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Status messages */}
          <div className="space-y-12 max-w-2xl mx-auto">

            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-purple-100">
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-medium text-gray-700">
                    ทุกอย่างจะเรียบร้อยในไม่ช้า
                  </p>
                  <Stars className="w-10 h-10 text-purple-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer message */}
          <p className="text-sm text-gray-500 mt-8">
            กำลังเชื่อมต่อกับระบบ Discord เพื่อยืนยันตัวตนของคุณ
          </p>
        </div>
      </div>
    </div>
  );
}