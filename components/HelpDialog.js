import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Phone, Link, Calendar, X, Heart, MessageCircle } from 'lucide-react';

const HelpDialog = ({ isOpen, onClose }) => {
  const emergencyContacts = [
    {
      name: "สายด่วนสุขภาพจิต",
      number: "1323",
      available: "24 ชั่วโมง",
      icon: Phone
    },
    {
      name: "สายด่วนปรึกษาเอดส์และท้องไม่พร้อม",
      number: "1663",
      available: "24 ชั่วโมง",
      icon: Phone
    }
  ];

  const resources = [
    {
      title: "คลินิกสุขภาพจิต โรงพยาบาลรามาธิบดี",
      description: "บริการให้คำปรึกษาด้านสุขภาพจิตโดยจิตแพทย์ผู้เชี่ยวชาญ",
      link: "https://www.rama.mahidol.ac.th/mental_health/",
      icon: Link
    },
    {
      title: "สมาคมสะมาริตันส์แห่งประเทศไทย",
      description: "องค์กรที่ให้ความช่วยเหลือผู้ที่คิดฆ่าตัวตายและมีภาวะซึมเศร้า",
      link: "https://www.samaritansthai.com/",
      icon: Heart
    }
  ];

  const selfHelp = [
    "ทำกิจวัตรประจำวันอย่างสม่ำเสมอ",
    "ออกกำลังกายอย่างน้อยวันละ 30 นาที",
    "พูดคุยกับเพื่อนหรือคนที่ไว้ใจ",
    "ฝึกการหายใจและทำสมาธิ",
    "นอนหลับพักผ่อนให้เพียงพอ"
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-2xl font-semibold text-gray-900">
                    การช่วยเหลือและแหล่งข้อมูล
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                {/* Emergency Contacts Section */}
                <section className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">สายด่วนฉุกเฉิน</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {emergencyContacts.map((contact) => (
                      <div key={contact.number} className="flex items-start space-x-4 p-4 bg-pink-50 rounded-lg">
                        <contact.icon className="h-6 w-6 text-pink-600 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">{contact.name}</p>
                          <p className="text-2xl font-bold text-pink-600">{contact.number}</p>
                          <p className="text-sm text-gray-600">เปิดให้บริการ {contact.available}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Resources Section */}
                <section className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">แหล่งข้อมูลที่เป็นประโยชน์</h3>
                  <div className="space-y-4">
                    {resources.map((resource) => (
                      <a
                        key={resource.title}
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <div className="flex items-start space-x-4">
                          <resource.icon className="h-6 w-6 text-blue-600 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-900">{resource.title}</h4>
                            <p className="text-sm text-gray-600">{resource.description}</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>

                {/* Self-help Section */}
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">วิธีดูแลตัวเองเบื้องต้น</h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {selfHelp.map((tip, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <Heart className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <div className="mt-8 text-center px-4 py-6 bg-pink-50 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    เราเข้าใจว่าบางครั้งความรู้สึกอาจหนักหนา แต่คุณไม่จำเป็นต้องเผชิญมันเพียงลำพัง 
                    <br />หากรู้สึกต้องการคนรับฟังหรือปรึกษา สายด่วนสุขภาพจิต 1323 พร้อมอยู่เคียงข้างคุณตลอด 24 ชั่วโมง 
                    <br />พวกเราห่วงใยคุณและพร้อมจะช่วยเหลือเสมอ
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default HelpDialog;