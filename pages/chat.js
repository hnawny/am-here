// /pages/index.js
import React, { useState, useRef, useEffect, Fragment } from "react";
import {
  SendHorizontal,
  Loader2,
  User,
  AlertCircle,
  RefreshCw,
  HeartHandshake,
  Heart,
  Sun,
  Stars,
  Trash2,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { useRouter } from "next/router";
import FormattedMessage from "../components/FormattedMessage";
import { Transition } from "@headlessui/react";
import toast, { Toaster } from "react-hot-toast";
import AuthModal from "@/components/AuthModal";
import DepressionScreening from "@/components/DepressionScreening";
import Navbar from "@/components/Navbar";
import ThaiIPChecker from "@/components/ThaiIPChecker";
import MobileInstallPopup from "@/components/MobileInstallPopup";
import FeatureAnnouncement from "@/components/FeatureAnnouncement";
import GradualRevealLanding from "@/components/GradualRevealLanding";
import PageLoadLoading from "@/components/PageLoadLoading";
const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-2">
      <span
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
};

const ThinkingIndicator = () => {
  return (
    <div className="flex items-center space-x-2 text-gray-500">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>กำลังคิด...</span>
    </div>
  );
};

const PrivacyBanner = () => {
  return (
    <Transition
      as={Fragment}
      show={true}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-1"
    >
      <div className="w-full max-w-4xl mx-auto p-2">
        <div className="rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 p-6 shadow-sm border border-pink-500">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center space-x-3">
              <HeartHandshake className="h-6 w-6 text-pink-600" />
              <h3 className="text-lg font-medium text-pink-800">
                ยินดีต้อนรับสู่พื้นที่ปลอดภัยของคุณ
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <ShieldCheck className="h-5 w-5 text-pink-600 mt-1 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  เราให้ความสำคัญกับความเป็นส่วนตัวของคุณ
                  ข้อมูลการสนทนาจะไม่ถูกบันทึกหรือเก็บไว้
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-pink-600 mt-1 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  ข้อมูลทั้งหมดจะถูกลบโดยอัตโนมัติ หลังจากสิ้นสุดการสนทนา 10-15
                  นาที หรือหลังจากที่คุณรีเฟสหรือ ออกหน้าจอนี้ไป
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <HeartHandshake className="h-5 w-5 text-pink-600 mt-1 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  บริการนี้จัดทำขึ้นเพื่อช่วยเหลือสังคม โดยไม่แสวงหาผลกำไรใดๆ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

// const AnimatedMessage = ({ message, user, onAnimationComplete }) => {
//   return (
//     <Transition
//       show={true}
//       appear={true}
//       enter="transition ease-out duration-300"
//       enterFrom="opacity-0 translate-y-4"
//       enterTo="opacity-100 translate-y-0"
//       leave="transition ease-in duration-300"
//       leaveFrom="opacity-100 scale-100"
//       leaveTo="opacity-0 scale-95"
//       afterLeave={onAnimationComplete}
//     >
//       <div className="py-6 border-t first:border-t-0 border-gray-100">
//         <div className="flex space-x-4">
//           <div className="flex-shrink-0 mt-1">
//             {message.role === "user" ? (
//               <>
//                 {user?.acc_social_pictureUrl ? (
//                   <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
//                     <img
//                       src={user.acc_social_pictureUrl}
//                       alt="User Profile"
//                       className="h-full w-full rounded-full object-cover"
//                     />
//                   </div>
//                 ) : (
//                   <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center">
//                     <User className="h-6 w-6 text-white" />
//                   </div>
//                 )}
//               </>
//             ) : (
//               <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
//                 <HeartHandshake className="h-6 w-6 text-white" />
//               </div>
//             )}
//           </div>
//           <div className="flex-1">
//             <p className="font-medium text-pink-500">
//               {message.role === "user"
//                 ? user.acc_nickname
//                 : "Assistant Am Here"}
//             </p>
//             <div className="prose prose-xl max-w-none text-gray-100">
//               {renderMessageContent(message)}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Transition>
//   );
// };

export default function Chat() {
  const router = useRouter(); // สร้าง router object
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const [showScreening, setShowScreening] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [showAuth, setShowAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [messagesToShow, setMessagesToShow] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isDeleting) {
      setMessagesToShow(messages);
    }
  }, [messages, isDeleting]);

  const handleDeleteMessages = () => {
    setIsDeleting(true);
    // The actual messages will be cleared after the animation completes
    setTimeout(() => {
      setMessages([]);
      setIsDeleting(false);
    }, 300); // Match this with animation duration
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const simulateTyping = async (content) => {
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate thinking
    setIsTyping(false);
    if (typeof content === "string" && content.trim() !== "") {
      const words = content.split(" ");
      let currentText = "";

      for (let i = 0; i < words.length; i++) {
        currentText += (i === 0 ? "" : " ") + words[i];
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { ...prev[prev.length - 1], content: currentText },
        ]);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } else {
      console.error("Content is undefined or not a valid string");
    }
  };

  async function sendMessage(e, retryMessage = null) {
    e?.preventDefault();
    if ((!input.trim() && !retryMessage) || isLoading) return;

    const messageContent = retryMessage || input;
    const newMessages = [
      ...messages,
      { role: "user", content: messageContent },
    ];

    if (!retryMessage) {
      setMessages(newMessages);
      setInput("");
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/here/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: user.acc_nickname,
          level: user.acc_level,
          messages: newMessages, // กำหนด messages ให้ตรงกับข้อมูลที่ต้องการส่ง
        }),
      });

      const data = await response.json();

      if (data.error) {
        return setError(data.error);
      }

      setMessages([...newMessages, { role: "assistant", content: "" }]);
      await simulateTyping(data.aiResponse);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleRetry = (e) => {
    const lastUserMessage = messages[messages.length - 1].content;
    sendMessage(e, lastUserMessage);
  };

  const renderMessageContent = (message, isError) => {
    if (isError) {
      return (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <span>เกิดข้อผิดพลาด: {error}</span>
          </div>
          <button
            onClick={handleRetry}
            className="flex items-center space-x-2 text-sm text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md w-fit"
          >
            <RefreshCw className="h-4 w-4" />
            <span>ลองใหม่อีกครั้ง</span>
          </button>
        </div>
      );
    }

    if (message.role === "assistant" && message.content === "") {
      return isTyping ? <ThinkingIndicator /> : <TypingIndicator />;
    }

    return (
      <p className="text-indigo-500 leading-relaxed">
        <FormattedMessage content={message.content} />
        {/* {message.image && <img src={message.image} alt="Generated content" className="mt-2 w-full max-w-xs" />} */}
      </p>
    );
  };

  const fetchData = async () => {
    try {
      const response = await fetch("/api/auth/@me", {});
      const data = await response.json();
      console.log(data.status);
      if (data.status === "error") {
        setIsAuthenticated(false);
        setShowAuth(true);
      } else {
        if (data.account.acc_submit_information === "YES") {
          setShowScreening(false);
        }
        setIsAuthenticated(true);
        setUser(data.account);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (userProfile) {
      const updateProfile = async () => {
        try {
          const response = await fetch("/api/auth/update", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nickname: userProfile.nickname,
              level: userProfile.result,
            }),
          });

          const data = await response.json();
          if (data.status === "success") {
            fetchData();
            toast.success("ยินดีที่ได้รู้จักนะคะ");
          } else {
            toast.error("ไม่สามารถอัปเดตโปรไฟล์ได้:", data.message);
          }
        } catch (error) {
          toast.error("เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์:", error);
        }
      };

      const sendReaction = async () => {
        try {
          const response = await fetch("/api/auth/reaction", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nickname: userProfile.nickname,
              re_before: userProfile.result,
              re_after: userProfile.result,
            }),
          });

          const data = await response.json();
          if (data.status === "success") {
            toast.success("ยิ้มเยอะๆๆนะคะ!");
          } else {
            toast.error("ไม่สามารถส่งความรู้สึกได้:", data.message);
          }
        } catch (error) {
          toast.error("เกิดข้อผิดพลาดในการส่งความรู้สึก:", error);
        }
      };

      updateProfile();
      sendReaction();
    }
  }, [userProfile]);

  return (
    <ThaiIPChecker>
      <PageLoadLoading />
      <FeatureAnnouncement />
      <Toaster position="top-right" reverseOrder={false} />
      {showAuth && !isAuthenticated && (
        <AuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
          onLoginSuccess={(user) => {
            setIsAuthenticated(true);
            setShowAuth(false);
            // Now show the depression screening
            setShowScreening(true);
          }}
        />
      )}

      {showScreening && isAuthenticated && (
        <DepressionScreening
          isOpen={showScreening}
          onClose={(results) => {
            setShowScreening(false);
            setUserProfile(results);
          }}
        />
      )}
      <div className="h-screen flex flex-col">
        <Navbar
          user={user}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/*</div> Chat Messages - Only this section scrolls */}
          <MobileInstallPopup className="z-99" />

          <div className="flex-1 overflow-y-auto bg-gradient-to-t from-pink-50 to-indigo-50">
            <div className="max-w-3xl mx-auto py-12 px-6">
              {messages.length === 0 ? (
                <>
                  <GradualRevealLanding PrivacyBanner={typeof PrivacyBanner !== "undefined" && <PrivacyBanner />} />
                </>
              ) : (
                  <div className="space-y-4">
                    {messagesToShow.map((message, index) => (
                      <Transition
                        key={index}
                        appear={true}
                        show={true}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-2"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-2"
                        beforeLeave={() => {
                          const element = document.getElementById(
                            `message-${index}`
                          );
                          if (element) {
                            element.classList.add("disperse-effect");
                            // Wait for animation to complete before actual removal
                            return new Promise((resolve) =>
                              setTimeout(resolve, 1000)
                            );
                          }
                        }}
                      >
                        <div
                          id={`message-${index}`}
                          className={`py-6 ${
                            index !== 0 ? "border-t border-gray-100" : ""
                          }`}
                        >
                          <div className="flex space-x-4">
                            <div className="flex-shrink-0 mt-1">
                              {message.role === "user" ? (
                                <>
                                  {user?.acc_social_pictureUrl ? (
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
                                      <img
                                        src={user.acc_social_pictureUrl}
                                        alt="User Profile"
                                        className="h-full w-full rounded-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center">
                                      <User className="h-6 w-6 text-white" />
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                                  <HeartHandshake className="h-6 w-6 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-pink-500">
                                {message.role === "user"
                                  ? user?.acc_nickname
                                  : "Assistant Am Here"}
                              </p>
                              <div className="prose prose-xl max-w-none text-gray-100">
                                {renderMessageContent(message)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Transition>
                    ))}
                  </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Section - Fixed at bottom */}
          <div className="border-t border-gray-100 bg-white">
            <div className="max-w-2xl mx-auto w-full p-4">
              <form
                onSubmit={sendMessage}
                className="flex items-center justify-between"
              >
                <div className="relative flex items-center flex-1">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="ฉันอยู่ตรงนี้เพื่อคุณ มีอะไรให้ฉันช่วยไหม?"
                    className="w-full rounded-2xl border border-gray-300 pl-4 pr-14 py-3 focus:outline-none focus:border-pink-500 transition-all ease-in-out duration-200 text-lg shadow-md"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 text-gray-500 hover:text-pink-600 disabled:opacity-40 transition-all duration-200"
                  >
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <SendHorizontal className="h-6 w-6" />
                    )}
                  </button>
                </div>

                {/* ปุ่มลบ - อยู่ภายนอก Input Section แต่ใกล้เคียง */}
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleDeleteMessages}
                    className="ml-2 p-3 text-gray-500 hover:text-red-600 transition-all duration-200"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-6 w-6" />
                  </button>
                )}
              </form>
              <div className="mt-6">
                <p className="text-xs text-center text-gray-500">
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
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeDown {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.5) translateY(50%);
          }
        }
      `}</style>
    </ThaiIPChecker>
  );
}
