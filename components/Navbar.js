import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Heart, HelpCircle, LogOut, X, FolderX } from 'lucide-react';
import ReactionScreening from './ReactionScreening';
import toast from 'react-hot-toast';
import HelpDialog from './HelpDialog';
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showScreening, setShowScreening] = useState(false);
  const [user, setUser] = useState(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const getLevelDescription = (level) => {
    switch(level) {
      case "ระดับรุนแรง":
        return {
          description: "คุณกำลังเผชิญกับภาวะซึมเศร้ารุนแรง ขอให้คุณอย่าท้อแท้ เราพร้อมที่จะช่วยคุณผ่านมันไป",
          encouragement: "ไม่ต้องเผชิญมันคนเดียว เราพร้อมเคียงข้างคุณทุกเวลา",
        };
      case "ระดับปานกลาง":
        return {
          description: "ภาวะซึมเศร้าปานกลางอาจทำให้คุณรู้สึกหมดแรง แต่ยังมีความหวังอยู่เสมอ",
          encouragement: "คุณมีพลังในตัวเองที่จะก้าวข้ามมันไปได้",
        };
      case "ระดับเล็กน้อย":
        return {
          description: "คุณอาจรู้สึกเครียดหรือเบื่อหน่ายบ้างในบางช่วง แต่ยังสามารถรับมือได้",
          encouragement: "คุณเก่งมากที่สามารถรับมือได้ เราจะช่วยคุณทำให้ดีขึ้น",
        };
      case "ระดับปกติ":
        return {
          description: "คุณไม่ได้มีภาวะซึมเศร้าในขณะนี้ แต่การดูแลสุขภาพจิตเป็นสิ่งสำคัญเสมอ",
          encouragement: "คุณกำลังอยู่ในช่วงที่ดี แต่ยังต้องดูแลตัวเองอยู่เสมอ",
        };
      default:
        return {
          description: "ระดับซึมเศร้ายังไม่ได้ระบุ",
          encouragement: "เราพร้อมที่จะช่วยคุณค้นหาเส้นทางที่ดีที่สุด",
        };
    }
  };

  const levelData = getLevelDescription(user?.acc_level);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;amToken=" + new Date().toUTCString() + ";path=/");
      });
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch('/api/auth/@me');
      const data = await response.json();
      if(data.status === "error") {
        toast.error("กรุณาเข้าสู่ระบบ")
      } else {
        localStorage.setItem("nickname", data.account.nickname);
        setUser(data.account);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (userProfile) {
      const sendReaction = async () => {
        try {
          const response = await fetch('/api/auth/reaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              re_before: user.acc_level,
              re_after: userProfile.result
            }),
          });
          const data = await response.json();
          if (data.status === 'success') {
            toast.success('ยิ้มเยอะๆๆนะคะ!')
          } else {
            toast.error('ไม่สามารถส่งความรู้สึกได้:', data.message);
          }
        } catch (error) {
          toast.error('เกิดข้อผิดพลาดในการส่งความรู้สึก:', error);
        }
      };
      sendReaction();
      fetchData();
    }
  }, [userProfile]);

  return (
    <nav className="sticky top-0 z-50 h-16 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-bold md:text-xl">
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Am Here Chat
              </span>
              <span className="ml-2 text-sm text-gray-400">V 0.2.3</span>
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsHelpOpen(true)}
              className="rounded-full p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900"
            >
              <HelpCircle className="h-5 w-5" />
            </button>

            <HelpDialog isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">
                  {user?.acc_nickname ? `Hi ${user.acc_nickname}` : 'ฉันยังไม่รู้จักคุณเลย'}
                </p>
                <p className="text-xs text-gray-500">{user?.acc_level || "0x0"}</p>
              </div>
              
              <button
                onClick={() => setIsDialogOpen(true)}
                className="group relative h-8 w-8 overflow-hidden rounded-full bg-gray-200 ring-2 ring-transparent transition-all hover:ring-pink-500"
              >
                {user?.acc_social_pictureUrl ? (
                  <img 
                    src={user.acc_social_pictureUrl} 
                    alt="Profile" 
                    className="h-full w-full object-cover transition-transform group-hover:scale-110" 
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-600">
                    !
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Dialog */}
      <Transition appear show={isDialogOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setIsDialogOpen(false)}
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
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
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
                <Dialog.Panel className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
                  {/* Dialog Header */}
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6">
                    <Dialog.Title className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Heart className="h-6 w-6 text-white" />
                        <span className="text-lg font-medium text-white">
                          ยินดีต้อนรับ {user?.acc_nickname || "User"}
                        </span>
                      </div>
                    </Dialog.Title>

                    <button
                      onClick={() => setIsDialogOpen(false)}
                      className="absolute right-4 top-4 rounded-full bg-white/20 p-1.5 text-white 
                               transition-all hover:bg-white/30 hover:scale-105"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Dialog Content */}
                  <div className="space-y-6 p-6">
                    {/* Level Info */}
                    <div className="rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 p-4">
                      <p className="text-center font-medium text-gray-700">
                        ระดับซึมเศร้า: {user?.acc_level || 'ไม่ระบุ'}
                      </p>
                      <p className="mt-2 text-center text-gray-600">
                        {levelData.description}
                      </p>
                      <p className="mt-2 text-center font-medium text-gray-700">
                        {levelData.encouragement}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <p className="text-center text-gray-600">คุณรู้สึกดีแล้วใช่ไหม</p>
                      
                      <button
                        onClick={() => setShowScreening(true)}
                        className="flex w-full items-center justify-center space-x-2 rounded-lg 
                                 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 
                                 text-white transition-all hover:from-blue-600 hover:to-blue-700"
                      >
                        <Heart className="h-5 w-5" />
                        <span>มาทำแบบทดสอบใหม่กันเถอะ</span>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center space-x-2 rounded-lg 
                                 border border-red-200 px-4 py-2.5 text-red-500 
                                 transition-all hover:bg-red-50"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>ออกจากระบบ</span>
                      </button>

                      <button
                        onClick={() => router.push("/DeleteAccount")}
                        className="flex w-full items-center justify-center space-x-2 rounded-lg 
                                 border border-red-200 px-4 py-2.5 text-red-500 
                                 transition-all hover:bg-red-50"
                      >
                        <FolderX className="h-5 w-5" />
                        <span>ลบบัญชี</span>
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <ReactionScreening
        isOpen={showScreening}
        onClose={(results) => {
          setShowScreening(false);
          setUserProfile(results);
        }}
      />
    </nav>
  );
};

export default Navbar;