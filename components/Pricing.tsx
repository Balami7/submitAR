"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Pricing() {
  const plans = [
    {
      name: "Basic",
      price: "₦10,000-₦30,000",
      description: "Standard document submission and official runs.",
    },
    {
      name: "Standard",
      price: "₦35,000-₦70,000",
      description: "Meeting representation and complex submissions.",
      featured: true,
    },
    {
      name: "Custom",
      price: "Contact Us",
      description: "Meeting representation and complex submissions.",
    },
  ];

  return (
    <section id="Pricing" className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
    
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }} // once: false is the key
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-center text-gray-900 mb-12"
        >
          Simple Pricing
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }} // once: false is the key
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`bg-gray-100 rounded-xl p-8 flex flex-col items-center text-center border-2 transition-colors ${
                plan.featured ? 'border-blue-500 bg-white shadow-xl' : 'border-transparent'
              }`}
            >
              {plan.featured && (
                <span className="bg-blue-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full mb-4">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-xl font-bold text-black mb-4">{plan.price}</p>
              <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">
                {plan.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner  */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }} // once: false is the key
          transition={{ duration: 0.6 }}
          className="bg-[#0052cc] rounded-2xl p-8 md:p-12 lg:mx-20 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
              Let someone handle it for you.
            </h2>
            <p className="text-blue-100 text-sm md:text-base max-w-md">
              Save time, reduce travel stress, and get things done from anywhere in the world.
            </p>
          </div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/get-started" 
              className="w-full md:w-auto bg-white text-[#0052cc] px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors text-center block whitespace-nowrap"
            >
              Get Started
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
