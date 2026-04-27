import React from 'react';
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
        
        {/* Section Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-16">
          How SubmitAR works
        </h2>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              
              {/* Circle Icon Container */}
              <div className="w-16 h-16 bg-[#0052cc] text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-100">
                {step.icon}
              </div>

              {/* Text Content */}
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
}
