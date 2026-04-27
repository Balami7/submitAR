{/*import React from 'react';
import { HiOutlinePencilAlt, HiOutlineCloudUpload, HiOutlineUserCircle, HiOutlineClipboardCheck  } from 'react-icons/hi';
import { HiOutlineDocumentCheck } from 'react-icons/hi2';

export default function HowItWorks() {
  const steps = [
    {
      title: "Submit Request",
      description: "Tell us what you need done and provide details.",
      icon: <HiOutlinePencilAlt size={24} />,
    },
    {
      title: "Send soft / Hard copy",
      description: "We print bind and submit.",
      icon: <HiOutlineCloudUpload size={24} />,
    },
    {
      title: "We Handle It",
      description: "We assign a verified representative to handle the task.",
      icon: <HiOutlineUserCircle size={24} />,
    },
    {
      title: "Receive Proof",
      description: "Get receipt, photo and full report of completion.",
      icon: <HiOutlineDocumentCheck size={24} />,
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
       
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-16">
          How SubmitAR works
        </h2>

    
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              
         
              <div className="w-16 h-16 bg-[#0052cc] text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-100">
                {step.icon}
              </div>

             
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} */}

import React from 'react';
import { 
  HiOutlineCloudUpload, 
  HiOutlineUserAdd, 
  HiOutlineDocumentText, 
  HiOutlineStatusOnline 
} from 'react-icons/hi';

export default function HowItWorks() {
  const steps = [
    {
      id: "1",
      title: "Upload & Processing",
      description: "You submit your document through the platform, fill in destination details, and the system automatically classifies the request, confirms requirements, and generates pricing.",
      icon: <HiOutlineCloudUpload size={28} />,
    },
    {
      id: "2",
      title: "Assignment & Preparation",
      description: "Once confirmed, the system assigns a field agent based on location. Documents are professionally prepared (printing, binding) and a checklist is generated for execution.",
      icon: <HiOutlineUserAdd size={28} />,
    },
    {
      id: "3",
      title: "Submission & Follow-Up",
      description: "Agents physically submit documents to the correct desk. Proof (stamps/receipts) is captured, and automated follow-ups are initiated until progress is confirmed.",
      icon: <HiOutlineDocumentText size={28} />,
    },
    {
      id: "4",
      title: "Tracking, Updates & Retrieval",
      description: "Receive real-time dashboard updates. We track status from pending to completed, retrieve any response documents, and archive the case for your future reference.",
      icon: <HiOutlineStatusOnline size={28} />,
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h2 className="text-3xl font-bold text-gray-900 mb-16 text-center">
          How SubmitAR Works
        </h2>

        {/* Vertical/Grid hybrid layout for detailed text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {steps.map((step) => (
            <div key={step.id} className="relative flex gap-6">
              {/* Icon & Number Bubble */}
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-[#0052cc] text-white rounded-2xl flex items-center justify-center shadow-lg">
                  {step.icon}
                </div>
                <div className="text-center mt-2 font-bold text-gray-300 text-xl">
                  0{step.id}
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-grow pt-2">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm lg:text-base">
                  {step.description}
                </p>
                
                {/* Visual Separator for mobile/desktop flow */}
                <div className="mt-8 border-b border-gray-100 w-24 md:hidden"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

