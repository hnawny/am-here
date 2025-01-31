import React, { useState, useRef, useEffect, Fragment } from "react";
import {
  Mic,
  Volume2,
  Settings,
  X,
  ChevronLeft,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Transition, Dialog } from "@headlessui/react";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import ThaiIPChecker from "@/components/ThaiIPChecker";
import EnhancedOnboarding from "@/components/EnhancedOnboarding";
import MessageLimitPopup from "@/components/MessageLimitPopup";
export default function Talk() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState("idle");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isMessageLimitOpen, setIsMessageLimitOpen] = useState(false);


  const fetchData = async () => {
    try {
      const response = await fetch("/api/auth/@me", {});
      const data = await response.json();
      if (
        data.status === "error" ||
        data.account.acc_submit_information === "NO"
      ) {
        router.push("/chat");
      } else {
        setUser(data.account);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "th-TH";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setStatus("listening");
      };

      recognition.onend = () => {
        setIsListening(false);
        setStatus("idle");
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        setInput(transcript);
      };

      recognition.onerror = (event) => {
        if (event.error === "not-allowed") {
          toast.error("กรุณาอนุญาตการใช้งานไมโครโฟน");
        }
        setStatus("error");
      };

      recognitionRef.current = recognition;
      return () => recognition.stop();
    } else {
      toast.error("เบราว์เซอร์ของคุณไม่รองรับ Speech-to-Text");
    }
  }, []);

  const startListening = (e) => {
    e.preventDefault();
    if (recognitionRef.current && !isListening) {
      try {
        setInput("");
        recognitionRef.current.start();
      } catch (err) {
        if (err.name === "InvalidStateError") {
          recognitionRef.current.stop();
          setTimeout(() => recognitionRef.current.start(), 100);
        }
      }
    }
  };

  const stopListening = async (e) => {
    e.preventDefault();
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      if (input.trim()) {
        await sendMessage();
      }
    }
  };

  const sendMessage = async () => {
    const dailyData = JSON.parse(localStorage.getItem('messageLimits') || '{}');
    const today = new Date().toDateString();
  
    if (dailyData.date !== today) {
      dailyData.count = 0;
      dailyData.date = today;
    }
  
    if (dailyData.count >= 3) {
      setIsMessageLimitOpen(true);
      return;
    }

    if (!input.trim() || isLoading) return;
    setIsLoading(true);
    setStatus("processing");

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);

    try {
        const response = await fetch("/api/here/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nickname: user?.acc_nickname,
                level: user?.acc_level,
                messages: newMessages,
            }),
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        const assistantMessage = {
            role: "assistant",
            content: data.aiResponse,
        };

        setMessages([...newMessages, assistantMessage]);

        if (audioRef.current) {
            audioRef.current.src = data.audioUrl;
            audioRef.current.play();
            setIsPlaying(true);
            setStatus("success");
        }

        // Update message count in localStorage
        dailyData.count += 1;
        localStorage.setItem('messageLimits', JSON.stringify(dailyData));

    } catch (err) {
        toast.error("เกิดข้อผิดพลาดในการสร้างเสียงตอบกลับ");
        setStatus("error");
    } finally {
        setIsLoading(false);
        setInput("");
    }
};

  const WaveAnimation = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center space-x-1.5 h-16"
    >
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: [10, 50, 10],
            opacity: [0.4, 1, 0.4],
            backgroundColor: [
              isListening ? "#ec4899" : isPlaying ? "#3b82f6" : "#9ca3af",
            ],
            transition: {
              duration: 1.2,
              delay: i * 0.1,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className={`w-1.5 rounded-full transition-all duration-300`}
        />
      ))}
    </motion.div>
  );

  return (
    <>VoiceChatMaintenance Oxo</>
  )

  return (
    <ThaiIPChecker>
      <MessageLimitPopup 
        isOpen={isMessageLimitOpen} 
        onClose={() => setIsMessageLimitOpen(false)} 
      />
      <EnhancedOnboarding onComplete={() => setShowOnboarding(false)} />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white ">
        <Toaster position="top-right" reverseOrder={false} />
        <Navbar
          user={user}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <div className="top-6 right-6 flex gap-4">
            <button
              onClick={() => router.push("/chat")}
              className="flex items-center gap-2 p-3 rounded-full bg-white/80 hover:bg-white/90 transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                ย้อนกลับเวอร์ชั่นแชท
              </span>
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-3 rounded-lg bg-gray-100 rounded-full bg-white/80 hover:bg-white/90 transition-all"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/60 backdrop-blur-xl rounded-3xl border border-gray-700 shadow-2xl p-8 relative overflow-hidden mt-8"
          >
            {/* Glowing background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 opacity-50 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      status === "listening"
                        ? "bg-pink-500 animate-pulse"
                        : status === "processing"
                        ? "bg-yellow-500 animate-pulse"
                        : status === "success"
                        ? "bg-green-500"
                        : status === "error"
                        ? "bg-red-500"
                        : "bg-gray-400"
                    }`}
                  />
                  <span className="text-md font-medium">
                    {status === "idle" && "พร้อมรับฟังคำพูดของคุณ"}
                    {status === "listening" && "กำลังฟัง..."}
                    {status === "processing" && "กำลังประมวลผล..."}
                    {status === "success" && "พูดสำเร็จ!"}
                    {status === "error" && "เกิดข้อผิดพลาด"}
                  </span>
                </div>

                <motion.button
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className="text-white/70 hover:text-white transition-all"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <Sparkles className="w-6 h-6" />
                </motion.button>
              </div>

              <WaveAnimation />

              <motion.button
                disabled={isLoading || isListening}
                onPointerDown={startListening}
                onPointerUp={stopListening}
                onPointerLeave={stopListening}
                whileTap={{ scale: 0.9 }}
                className={`relative w-48 h-48 rounded-full mx-auto flex items-center justify-center
                  bg-gradient-to-br from-pink-600/50 to-purple-700/50
                  border-4 border-white/10 shadow-2xl backdrop-blur-sm
                  transition-all duration-300 transform
                  ${isListening ? "scale-110 animate-pulse" : "hover:scale-105"}
                  ${isLoading || isPlaying ? "bg-gray-300 cursor-not-allowed" : ""}
                `}                
              >
                <div className="relative z-10 flex flex-col items-center">
                  {isListening ? (
                    <>
                      <Loader2 className="w-16 h-16 text-white animate-spin" />
                      <span className="mt-4 text-white text-sm font-medium">
                        กำลังฟัง...
                      </span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-16 h-16 text-white" />
                      <span className="mt-4 text-white text-sm font-medium">
                        กดค้างเพื่อพูด
                      </span>
                    </>
                  )}
                </div>
              </motion.button>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-xl p-6 min-h-[120px] relative overflow-hidden shadow-inner"
              >
                <p className="text-white/70 break-words">
                  {input || "คำพูดของคุณจะแสดงที่นี่..."}
                </p>

                {isPlaying && (
                  <div className="absolute bottom-2 right-2 flex items-center gap-2 text-blue-400">
                    <Volume2 className="animate-pulse" />
                    <span className="text-sm">กำลังเล่นเสียง</span>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
          <div className="mt-6">
          <p className="text-xs text-center text-gray-200">
            Icon By Lucide React AI By Google Ai Studio & Botnoi Voice
            สามารถอ่านเพิ่มเติมได้ที่{" "}
            <a
              href="#"
              onClick={() => router.push("/Legal")}
              className="text-pink-600 hover:underline"
            >
              ข้อกำหนดการใช้งาน
            </a>{" "}
            และ{" "}
            <a
              href="#"
              onClick={() => router.push("/Legal")}
              className="text-pink-600 hover:underline"
            >
              นโยบายความเป็นส่วนตัว
            </a>
          </p>
        </div>
        </div>
      </div>
      <Dialog
        as="div"
        className="relative z-50"
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
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
          <div className="fixed inset-0 bg-gray-800/50 backdrop-blur-md" />
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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-xl bg-gray-200 p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold text-gray-700"
                  >
                    การตั้งค่า
                  </Dialog.Title>
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-300 transition-all"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-6 text-gray-500">
                  <div>
                    <label className="block text-sm font-medium">
                      เลือกเสียงพูด
                    </label>
                    <select
                      className="mt-2 block w-full rounded-md border border-gray-400 bg-gray-300 p-2 text-gray-700 cursor-not-allowed"
                      disabled
                    >
                      <option>เสียงเริ่มต้น</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      ความเร็วเสียง
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      defaultValue="1"
                      className="mt-2 block w-full bg-gray-300 cursor-not-allowed"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      ความดังของเสียง
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      defaultValue="1"
                      className="mt-2 block w-full bg-gray-300 cursor-not-allowed"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      ธีมแอปพลิเคชัน
                    </label>
                    <select
                      className="mt-2 block w-full rounded-md border border-gray-400 bg-gray-300 p-2 text-gray-700 cursor-not-allowed"
                      disabled
                    >
                      <option>โหมดสว่าง</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-red-600 font-semibold">
                    ระบบตั้งค่าจะมาเร็ว ๆ นี้
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
      />
    </ThaiIPChecker>
  );
}

