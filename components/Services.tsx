"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineLibrary, HiOutlineAcademicCap, HiOutlineUserGroup, HiOutlineTruck } from 'react-icons/hi';

export default function Services() {
  const services = [
    {
      title: "Government Submission",
      description: "We handle submission to ministries, departments, and agencies.",
      icon: <HiOutlineLibrary size={24} />,
    },
    {
      title: "School Application",
      description: "From admission to registration we have got you covered.",
      icon: <HiOutlineAcademicCap size={24} />,
    },
    {
      title: "Meeting Representation",
      description: "We attend meeting and provide detailed reports on your behalf.",
      icon: <HiOutlineUserGroup size={24} />,
    },
    {
      title: "Document Retrieval",
      description: "Secure delivery of documents and official material.",
      icon: <HiOutlineTruck size={24} />,
    },
  ];

  return (
    <section id="Services" className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-center text-gray-900 mb-12"
        >
          Our Services
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }} 
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-100 rounded-xl p-8 flex flex-col items-center text-center cursor-default shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-[#0052cc] text-white p-3 rounded-lg mb-6">
                {service.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
