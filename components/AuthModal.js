import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/router';
import crypto from 'crypto';

function generateState() {
  return crypto.randomBytes(16).toString('hex');
}

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const router = useRouter();
  const LINE_CLIENT_ID = process.env.NEXT_PUBLIC_LINE_CLIENT_ID;
  const LINE_REDIRECT_URI = process.env.NEXT_PUBLIC_LINE_REDIRECT_URI;
  const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const DISCORD_REDIRECT_URI = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI;
  const state = generateState();

  const handleTikTokLogin = () => {
    if (!process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY || !process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI) {
      console.error('Missing environment variables');
      return;
    }
  
    const params = new URLSearchParams({
      client_key: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY,
      scope: 'user.info.basic,user.info.profile,user.info.stats',
      response_type: 'code',
      redirect_uri: process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI,
      state: 'state'
    });
  
    const authUrl = `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
    console.log('Auth URL:', authUrl);
    
    window.location.href = authUrl;
  };
  

  const authorizeUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${LINE_CLIENT_ID}&redirect_uri=${LINE_REDIRECT_URI}&state=${state}&scope=profile%20openid%20email`;
  const authorizeDisUrl = `https://discord.com/api/oauth2/authorize?response_type=code&client_id=${DISCORD_CLIENT_ID}&redirect_uri=${DISCORD_REDIRECT_URI}&state=${state}&scope=identify%20email`;


  const handleDiscordLogin = () => window.location.href = authorizeDisUrl;
  const handleLineLogin = () => window.location.href = authorizeUrl;
  // const handleTikTokLogin = () => window.location.href = getTikTokLoginUrl();

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
              <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* Decorative top gradient */}
                <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" />
                
                <div className="px-6 py-8">
                  <Dialog.Title className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="rounded-full bg-pink-100 p-2">
                        <Heart className="h-6 w-6 text-pink-500" />
                      </div>
                      <span className="text-xl font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        ยินดีต้อนรับ
                      </span>
                    </div>
                  </Dialog.Title>

                  <div className="mt-8 space-y-6">
                    <p className="text-center text-gray-600">
                      เลือกวิธีการเข้าสู่ระบบที่คุณต้องการ
                    </p>

                    <div className="space-y-4">
                      {/* Discord Button */}
                      <button
                        onClick={handleDiscordLogin}
                        className="group relative w-full overflow-hidden rounded-xl bg-indigo-600 p-px transition-all hover:bg-gradient-to-r hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500"
                      >
                        <div className="relative flex h-12 items-center justify-center space-x-2 bg-indigo-600 text-white transition-all group-hover:bg-opacity-90">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-discord" viewBox="0 0 16 16">
                            <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/>
                          </svg>
                          <span className="font-medium">เข้าสู่ระบบด้วย Discord</span>
                        </div>
                      </button>

                      {/* LINE Button */}
                      <button
                        onClick={handleLineLogin}
                        className="group relative w-full overflow-hidden rounded-xl bg-green-500 p-px transition-all hover:bg-gradient-to-r hover:from-green-500 hover:via-emerald-500 hover:to-teal-500"
                      >
                        <div className="relative flex h-12 items-center justify-center space-x-2 bg-green-500 text-white transition-all group-hover:bg-opacity-90">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-line" viewBox="0 0 16 16">
                            <path d="M8 0c4.411 0 8 2.912 8 6.492 0 1.433-.555 2.723-1.715 3.994-1.678 1.932-5.431 4.285-6.285 4.645-.83.35-.734-.197-.696-.413l.003-.018.114-.685c.027-.204.055-.521-.026-.723-.09-.223-.444-.339-.704-.395C2.846 12.39 0 9.701 0 6.492 0 2.912 3.59 0 8 0M5.022 7.686H3.497V4.918a.156.156 0 0 0-.155-.156H2.78a.156.156 0 0 0-.156.156v3.486c0 .041.017.08.044.107v.001l.002.002.002.002a.15.15 0 0 0 .108.043h2.242c.086 0 .155-.07.155-.156v-.56a.156.156 0 0 0-.155-.157m.791-2.924a.156.156 0 0 0-.156.156v3.486c0 .086.07.155.156.155h.562c.086 0 .155-.07.155-.155V4.918a.156.156 0 0 0-.155-.156zm3.863 0a.156.156 0 0 0-.156.156v2.07L7.923 4.832l-.013-.015v-.001l-.01-.01-.003-.003-.011-.009h-.001L7.88 4.79l-.003-.002-.005-.003-.008-.005h-.002l-.003-.002-.01-.004-.004-.002-.01-.003h-.002l-.003-.001-.009-.002h-.006l-.003-.001h-.004l-.002-.001h-.574a.156.156 0 0 0-.156.155v3.486c0 .086.07.155.156.155h.56c.087 0 .157-.07.157-.155v-2.07l1.6 2.16a.2.2 0 0 0 .039.038l.001.001.01.006.004.002.008.004.007.003.005.002.01.003h.003a.2.2 0 0 0 .04.006h.56c.087 0 .157-.07.157-.155V4.918a.156.156 0 0 0-.156-.156zm3.815.717v-.56a.156.156 0 0 0-.155-.157h-2.242a.16.16 0 0 0-.108.044h-.001l-.001.002-.002.003a.16.16 0 0 0-.044.107v3.486c0 .041.017.08.044.107l.002.003.002.002a.16.16 0 0 0 .108.043h2.242c.086 0 .155-.07.155-.156v-.56a.156.156 0 0 0-.155-.157H11.81v-.589h1.525c.086 0 .155-.07.155-.156v-.56a.156.156 0 0 0-.155-.157H11.81v-.589h1.525c.086 0 .155-.07.155-.156Z"/>
                          </svg>
                          <span className="font-medium">เข้าสู่ระบบด้วย LINE</span>
                        </div>
                      </button>

                      {/* TiKTok Button */}
                      {/* <button
                        disabled
                        onClick={handleTikTokLogin}
                        className="group relative w-full overflow-hidden rounded-xl bg-slate-900 p-px transition-all hover:bg-gradient-to-r hover:from-slate-500 hover:via-emerald-500 hover:to-slate-500"
                      >
                        <div className="relative flex h-12 items-center justify-center space-x-2 bg-slate-900 text-white transition-all group-hover:bg-opacity-90">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-tiktok" viewBox="0 0 16 16">
                            <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
                          </svg>
                          <span className="font-medium">เข้าสู่ระบบด้วย TikTok</span>
                        </div>
                      </button> */}
                    </div>

                    <div className="relative mt-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-4 text-gray-500">หรือ</span>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        การเข้าสู่ระบบถือว่าคุณยอมรับ{' '}
                        <button
                          onClick={() => router.push('/Legal')}
                          className="font-medium text-pink-600 transition-colors hover:text-pink-500"
                        >
                          ข้อกำหนดการใช้งาน
                        </button>
                        {' '}และ{' '}
                        <button
                          onClick={() => router.push('/Legal')}
                          className="font-medium text-pink-600 transition-colors hover:text-pink-500"
                        >
                          นโยบายความเป็นส่วนตัว
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AuthModal;