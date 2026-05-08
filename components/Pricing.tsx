

"use client";
 
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCheckCircle, HiX, HiOutlineCheck } from 'react-icons/hi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { MdOutlineLocalPrintshop, MdOutlineDocumentScanner, MdOutlineDeliveryDining } from 'react-icons/md';
 
// ─── Types ────────────────────────────────────────────────────────────────────
type Plan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  featured?: boolean;
  badge?: string;
};
 
// ─── Pricing data ─────────────────────────────────────────────────────────────
const categories: Record<string, Plan[]> = {
  Submission: [
    {
      name: 'Submission Only',
      price: '₦35,000',
      description: 'Document handling and submission to the required office or desk.',
      features: ['Document handling', 'Official desk delivery', 'Basic confirmation'],
    },
    {
      name: 'Submission + Follow Up',
      price: '₦65,000',
      description: 'Submit your document and track its progress with follow-up updates.',
      features: ['Document submission', 'Progress tracking', 'Status updates'],
    },
    {
      name: 'Submission + Representation',
      price: '₦85,000',
      description: 'Submit and have someone physically present at the office on your behalf.',
      features: ['Document submission', 'Physical attendance', 'Agency presence'],
    },
    {
      name: 'Submission + Retrieval',
      price: '₦120,000',
      description: 'Full end-to-end: submit, follow up, represent, and retrieve your document.',
      features: ['All services included', 'End-to-end handling', 'Priority processing'],
      featured: true,
      badge: 'Bundle',
    },
  ],
  'Follow Up': [
    {
      name: 'Follow Up Only',
      price: '₦35,000',
      description: 'One-time status check or inquiry on an existing submission.',
      features: ['One-time check', 'Progress report', 'Inquiry handling'],
    },
    {
      name: 'Follow Up + Representation',
      price: '₦75,000',
      description: 'Track your document and have someone present at the office if needed.',
      features: ['Status tracking', 'Physical attendance', 'Agency presence'],
    },
    {
      name: 'Follow Up + Retrieval',
      price: '₦60,000',
      description: 'Monitor progress and collect the document once it is ready.',
      features: ['Progress monitoring', 'Secure pickup', 'Document delivery'],
    },
    {
      name: 'Follow Up + Submission',
      price: '₦120,000',
      description: 'Full end-to-end: submit, follow up, represent, and retrieve your document.',
      features: ['All services included', 'End-to-end handling', 'Priority processing'],
      featured: true,
      badge: 'Bundle',
    },
  ],
  Representation: [
    {
      name: 'Representation Only',
      price: '₦50,000',
      description: 'Physical attendance at an office or meeting on your behalf (per 2 hours).',
      features: ['Physical attendance', 'Agency presence', 'Client proxy'],
    },
    {
      name: 'Representation + Follow Up',
      price: '₦75,000',
      description: 'Attend on your behalf and provide continued tracking after the visit.',
      features: ['Physical attendance', 'Post-visit tracking', 'Status updates'],
    },
    {
      name: 'Representation + Retrieval',
      price: '₦75,000',
      description: 'Attend on your behalf and collect documents at the same visit.',
      features: ['Physical attendance', 'Document pickup', 'Secure delivery'],
    },
    {
      name: 'Representation + Submission',
      price: '₦120,000',
      description: 'Full end-to-end: submit, follow up, represent, and retrieve your document.',
      features: ['All services included', 'End-to-end handling', 'Priority processing'],
      featured: true,
      badge: 'Bundle',
    },
  ],
  Retrieval: [
    {
      name: 'Retrieval Only',
      price: '₦35,000',
      description: 'Official document retrieval and secure handling.',
      features: ['Secure pickup', 'Physical/digital delivery', 'Proof of receipt'],
    },
    {
      name: 'Retrieval + Submission',
      price: '₦120,000',
      description: 'Full end-to-end: submit, follow up, represent, and retrieve your document.',
      features: ['All services included', 'End-to-end handling', 'Priority processing'],
      featured: true,
      badge: 'Bundle',
    },
    {
      name: 'Retrieval + Follow Up',
      price: '₦60,000',
      description: 'Track your document and collect it once processing is complete.',
      features: ['Progress monitoring', 'Secure pickup', 'Delivery confirmation'],
    },
    {
      name: 'Retrieval + Representation',
      price: '₦75,000',
      description: 'Have someone attend on your behalf and collect the document.',
      features: ['Physical attendance', 'Document pickup', 'Secure delivery'],
    },
  ],
};
 
// ─── Custom service options ───────────────────────────────────────────────────
const CUSTOM_OPTIONS: Record<string, { price: number; icon: React.ReactNode }> = {
  'Submission':                      { price: 35_000, icon: <HiCheckCircle size={15} /> },
  'Follow Up':                       { price: 35_000, icon: <HiCheckCircle size={15} /> },
  'Representation':                  { price: 50_000, icon: <HiCheckCircle size={15} /> },
  'Retrieval':                       { price: 35_000, icon: <HiCheckCircle size={15} /> },
  'Printing':                        { price: 1_000,  icon: <MdOutlineLocalPrintshop size={15} /> },
  'Scanning':                        { price: 500,    icon: <MdOutlineDocumentScanner size={15} /> },
  'Proposal Delivery':               { price: 15_000, icon: <MdOutlineDeliveryDining size={15} /> },
  'Meeting Attendance':              { price: 40_000, icon: <HiCheckCircle size={15} /> },
  'Interview Representation':        { price: 60_000, icon: <HiCheckCircle size={15} /> },
  'Document Pickup':                 { price: 10_000, icon: <HiCheckCircle size={15} /> },
  'Document Delivery':               { price: 10_000, icon: <HiCheckCircle size={15} /> },
  'Queue Standing':                  { price: 35_000, icon: <HiCheckCircle size={15} /> },
  'Government Processing Assistance':{ price: 50_000, icon: <HiCheckCircle size={15} /> },
  'Office Visit':                    { price: 50_000, icon: <HiCheckCircle size={15} /> },
  'Custom Request':                  { price: 0,      icon: <HiOutlineSparkles size={15} /> },
};
 
function fmt(n: number) {
  return '₦' + n.toLocaleString('en-NG');
}
 
const TABS = [...Object.keys(categories), 'Customize'];
 
// ─── Customize tab ────────────────────────────────────────────────────────────
function CustomizeTab() {
  const [selected, setSelected] = useState<string[]>([]);
 
  const toggle = (item: string) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };
 
  const total = selected.reduce((sum, s) => sum + (CUSTOM_OPTIONS[s]?.price || 0), 0);
  const hasCustom = selected.includes('Custom Request');
 
  return (
    <motion.div
      key="customize"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
    >
      <p className="text-center text-sm text-gray-500 mb-8 max-w-lg mx-auto">
        Build your own service combination based on exactly what you need SubmitAR to handle.
      </p>
 
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
        {Object.entries(CUSTOM_OPTIONS).map(([item, { price, icon }]) => {
          const isSelected = selected.includes(item);
          return (
            <button
              key={item}
              onClick={() => toggle(item)}
              className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-center transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                  <HiOutlineCheck size={10} className="text-white" />
                </div>
              )}
              <span className={isSelected ? 'text-blue-600' : 'text-gray-400'}>{icon}</span>
              <span className="text-xs font-semibold leading-tight">{item}</span>
              <span className={`text-[10px] font-bold ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
                {price > 0 ? fmt(price) : 'Quote'}
              </span>
            </button>
          );
        })}
      </div>
 
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {selected.map(s => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full"
                  >
                    {s}
                    <button onClick={() => toggle(s)} className="ml-0.5 text-blue-400 hover:text-blue-700">
                      <HiX size={11} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-blue-200">
                <div>
                  <p className="text-xs text-blue-500 font-medium uppercase tracking-wide">Estimated Total</p>
                  {hasCustom && (
                    <p className="text-[10px] text-amber-600 mt-0.5">Custom Request requires a quote</p>
                  )}
                </div>
                <p className="text-2xl font-extrabold text-[#0052cc]">
                  {total > 0 ? fmt(total) : 'Get a Quote'}
                  {hasCustom && total > 0 && <span className="text-xs font-normal text-gray-400 ml-1">+</span>}
                </p>
              </div>
            </div>
            <Link
              href="/submitar"
              className="w-full block text-center bg-[#0052cc] hover:bg-blue-800 text-white text-sm font-semibold py-3 rounded-lg transition-colors mb-20"
            >
              Proceed with Custom Bundle
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
 
      {selected.length === 0 && (
        <p className="text-center text-xs text-gray-400 mt-2 mb-20">
          Select any combination above to see your estimated total
        </p>
      )}
    </motion.div>
  );
}
 
// ─── Main Export ──────────────────────────────────────────────────────────────
export default function Pricing() {
  const [activeTab, setActiveTab] = useState('Submission');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
 
  const handleCustomClick = (serviceName: string) => {
    setSelectedService(serviceName);
    setIsModalOpen(true);
  };
 
  const plans = categories[activeTab] ?? [];
 
  return (
    <section id="Pricing" className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-center text-gray-900 mb-8"
        >
          Service Packages
        </motion.h2>
 
        {/* ── Tab bar ────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === tab
                  ? 'bg-[#0052cc] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab === 'Customize' && <HiOutlineSparkles size={14} />}
              {tab}
            </button>
          ))}
        </div>
 
        {/* ── Customize tab ──────────────────────────────────────────────── */}
        {activeTab === 'Customize' && <CustomizeTab />}
 
        {/* ── Service plan cards ──────────────────────────────────────────── */}
        {activeTab !== 'Customize' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            <AnimatePresence mode="wait">
              {plans.map((plan, index) => (
                <motion.div
                  key={`${activeTab}-${index}`}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.25, delay: index * 0.06 }}
                  whileHover={{ y: -6 }}
                  className={`relative rounded-xl p-6 flex flex-col border-2 transition-colors ${
                    plan.featured
                      ? 'border-blue-500 bg-white shadow-xl'
                      : 'border-transparent bg-gray-100'
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      {plan.badge}
                    </span>
                  )}
 
                  <h3 className="text-base font-bold text-gray-900 mb-1 pr-10">{plan.name}</h3>
                  <p className="text-xl font-extrabold text-black mb-3">{plan.price}</p>
                  <p className="text-xs text-gray-500 mb-5 leading-relaxed">{plan.description}</p>
 
                  <ul className="space-y-2 flex-grow mb-6">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center text-xs text-gray-600">
                        <HiCheckCircle className="text-blue-500 mr-2 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
 
                  <Link
                    href="/submitar"
                    className={`w-full block text-center py-2.5 rounded-lg text-sm font-bold transition-colors ${
                      plan.featured
                        ? 'bg-[#0052cc] text-white hover:bg-blue-800'
                        : 'bg-white text-[#0052cc] border border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    Get Started
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
 
        {/* ── CTA banner ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.5 }}
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
          <Link
            href="/get-started"
            className="bg-white text-[#0052cc] px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Get Started
          </Link>
        </motion.div>
      </div>
 
      {/* ── Quote modal ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full relative z-10 shadow-2xl"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                <HiX size={24} />
              </button>
              <h3 className="text-xl font-bold mb-1">Quote Request</h3>
              <p className="text-blue-600 text-sm font-bold mb-6 italic">{selectedService}</p>
              <textarea
                className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                rows={4}
                placeholder="Tell us what you need..."
              />
              <button className="w-full mt-4 bg-[#0052cc] text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                Submit Request
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
 
