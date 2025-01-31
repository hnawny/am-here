import React, { useState, useEffect, Fragment } from 'react';
import { Tab } from '@headlessui/react';
import { Download, Share, Menu, Plus, X, ChevronRight } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';

const MobileInstallPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [ua] = useState(window.navigator.userAgent);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  useEffect(() => {
    const hideUntil = localStorage.getItem('installPopupHideUntil');
    if (!hideUntil || new Date().getTime() > parseInt(hideUntil)) {
      setIsVisible(true);
    }
  }, []);

  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isAndroid = /Android/.test(ua);
  const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
  const isChrome = /Chrome/.test(ua) && !/Edge/.test(ua);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  const hideForOneDay = () => {
    const tomorrow = new Date().getTime() + (24 * 60 * 60 * 1000);
    localStorage.setItem('installPopupHideUntil', tomorrow.toString());
    setIsVisible(false);
  };

  if (isStandalone || !isVisible) return null;

const getSteps = () => {
    if (isIOS || isSafari) {
      return [
        {
          title: 'กดปุ่มแชร์',
          description: 'กดปุ่มแชร์ที่ด้านล่างของเบราว์เซอร์',
          icon: <Share className="w-6 h-6" />
        },
        {
          title: 'เลือก "เพิ่มไปยังหน้าจอโฮม"',
          description: 'เลื่อนหาและกดที่ตัวเลือก "เพิ่มไปยังหน้าจอโฮม"',
          icon: <Plus className="w-6 h-6" />
        },
        {
          title: 'ยืนยันการติดตั้ง',
          description: 'กด "เพิ่ม" เพื่อติดตั้งแอพไปยังหน้าจอโฮม',
          icon: <Download className="w-6 h-6" />
        }
      ];
    } else if (isAndroid && isChrome) {
      return [
        {
          title: 'กดปุ่มเมนู',
          description: 'กดปุ่มเมนูสามจุดที่มุมบนขวา',
          icon: <Menu className="w-6 h-6" />
        },
        {
          title: 'เลือก "ติดตั้งแอพ"',
          description: 'กดที่ตัวเลือก "ติดตั้งแอพ" หรือ "เพิ่มไปยังหน้าจอหลัก"',
          icon: <Plus className="w-6 h-6" />
        },
        {
          title: 'ยืนยันการติดตั้ง',
          description: 'กด "ติดตั้ง" เพื่อเพิ่มแอพไปยังหน้าจอหลัก',
          icon: <Download className="w-6 h-6" />
        }
      ];
    } else {
      return [
        {
          title: 'เปิดเมนู',
          description: 'กดปุ่มเมนูของเบราว์เซอร์',
          icon: <Menu className="w-6 h-6" />
        },
        {
          title: 'เพิ่มไปยังหน้าจอหลัก',
          description: 'เลือกตัวเลือกเพื่อเพิ่มไปยังหน้าจอหลัก',
          icon: <Plus className="w-6 h-6" />
        },
        {
          title: 'เสร็จสิ้น',
          description: 'ยืนยันการติดตั้งเพื่อเริ่มใช้งาน',
          icon: <Download className="w-6 h-6" />
        }
      ];
    }
  };

  const steps = getSteps();

  return (
    <Transition appear show={isVisible} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsVisible(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-x-0 bottom-0 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-full"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-full"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 via-violet-500 to-fuchsia-500" />
                
                <div className="px-6 pt-6 pb-8">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 p-2.5 shadow-lg shadow-blue-500/25">
                        <Download className="w-6 h-6 text-white" />
                      </div>
                      <Dialog.Title className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                        ติดตั้งแอพ
                      </Dialog.Title>
                    </div>
                    <button
                      onClick={() => setIsVisible(false)}
                      className="rounded-full p-2 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                    <Tab.List className="flex space-x-2 rounded-2xl bg-gray-100/80 p-1.5 mb-8">
                      {steps.map((_, index) => (
                        <Tab
                          key={index}
                          className={({ selected }) =>
                            `w-full rounded-xl py-3 text-sm font-medium leading-5 transition-all duration-200
                            ${
                              selected
                                ? 'bg-white text-blue-600 shadow-lg shadow-blue-500/10 ring-1 ring-gray-200'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
                            }`
                          }
                        >
                          ขั้นตอนที่ {index + 1}
                        </Tab>
                      ))}
                    </Tab.List>

                    <Tab.Panels>
                      {steps.map((step, index) => (
                        <Tab.Panel
                          key={index}
                          className={`focus:outline-none transition-all duration-500 ${
                            selectedIndex === index ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                          }`}
                        >
                          <div className="flex items-center gap-5 p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 ring-1 ring-blue-100/50">
                            <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                              {step.icon}
                            </div>
                            <div className="flex-grow">
                              <h3 className="text-lg font-medium text-gray-900">
                                {step.title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </Tab.Panel>
                      ))}
                    </Tab.Panels>
                  </Tab.Group>

                  <div className="mt-8 flex items-center justify-between">
                    <button
                      onClick={hideForOneDay}
                      className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      ไม่แสดงใน 1 วัน
                    </button>
                    <button
                      onClick={() => setIsVisible(false)}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl hover:from-blue-700 hover:to-violet-700 transition-all duration-200 shadow-lg shadow-blue-500/25 font-medium"
                    >
                      เข้าใจแล้ว
                    </button>
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

export default MobileInstallPopup;