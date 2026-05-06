"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineCloudUpload, HiOutlineUserAdd, HiOutlineDocumentText, HiOutlineStatusOnline } from 'react-icons/hi';

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
    <section id="Howitworks" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-900 mb-16 text-center"
        >
          How SubmitAR Works
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {steps.map((step, index) => (
            <motion.div 
              key={step.id} 
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative flex gap-6"
            >
              <div className="flex-shrink-0">
                <motion.div 
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  className="w-14 h-14 bg-[#0052cc] text-white rounded-2xl flex items-center justify-center shadow-lg"
                >
                  {step.icon}
                </motion.div>
                <div className="text-center mt-2 font-bold text-gray-300 text-xl">0{step.id}</div>
              </div>

              <div className="flex-grow pt-2">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm lg:text-base">{step.description}</p>
                <div className="mt-8 border-b border-gray-100 w-24 md:hidden"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
