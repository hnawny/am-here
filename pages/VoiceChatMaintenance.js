import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Loader2, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/router';

export default function VoiceChatMaintenance() {
  const router = useRouter();
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const createParticles = () => {
      const particleCount = 50;
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
      }));
      setParticles(newParticles);
    };

    createParticles();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-gray-900 flex items-center justify-center overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0 opacity-50">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: particle.x, 
              y: particle.y,
              opacity: 0 
            }}
            animate={{ 
              x: particle.x, 
              y: particle.y,
              opacity: [0.2, 0.5, 0.2],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              repeatType: "mirror"
            }}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center space-y-8 p-10 bg-black/40 backdrop-blur-xl rounded-3xl border border-purple-600/30 shadow-2xl mx-2"
      >
        <button 
          onClick={() => router.push("/chat")}
          className="absolute top-4 left-4 flex items-center gap-2 text-white/70 hover:text-white transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
          <span>กลับสู่แชท</span>
        </button>

        <div className="relative">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 0.9, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "mirror"
            }}
            className="absolute -inset-4 bg-purple-500/20 rounded-full blur-2xl"
          />
          <Mic className="mx-auto w-32 h-32 text-purple-400 relative z-10" />
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            ระบบสนทนาด้วยเสียง
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-md mx-auto">
            กำลังปรับปรุงระบบให้ดียิ่งขึ้น เพื่อประสบการณ์การสนทนาที่ราบรื่น
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}