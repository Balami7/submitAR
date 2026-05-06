import React from 'react';
import Header from "@/components/Header";
import { HiOutlineSearch } from 'react-icons/hi';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <Header />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {/* Hero Section - Simplified without illustration */}
        <div className="max-w-2xl space-y-8">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 md:text-6xl">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            Our code of conduct and your pledge to be an upstanding member of the Product.
          </p>
          
          <div className="relative max-w-sm">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
            <input 
              type="text" 
              placeholder="Search keyboard" 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-20 max-w-4xl space-y-16">
          
          {/* Section: Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-blue-600 mb-8">Introduction</h2>
            <div className="space-y-6 text-slate-700 leading-relaxed text-lg">
              <p>
                Product Holdings Limited (the "Bloom Group") is comprised of several companies, which together provide tools to help the world's designers to create, develop and promote their talents (each a "Service" and collectively, the "Services"). The companies within the Dribbble Group each act as the data controller for personal data processed in respect of their Services (each a "Group Company" and together).
              </p>
              <p>
                Please ensure that your posts are relevant to the theme of the platform. Single-word posts and short sentences provide limited context and are hard to comprehend. Please make sure your posts are well thought out and understandable. It will help the build community understand your mind and support you.
              </p>
              <p>
                We put no restrictions on what you share. However, we have some community guidelines that must be taken into consideration. If you don't, you may find your thoughts removed and/or your account disabled. Help us to keep Product awesome!
              </p>
            </div>
          </section>

          {/* Section: Sensitive Personal Data */}
          <section>
            <h2 className="text-2xl font-bold text-blue-600 mb-6">Sensitive Personal Data</h2>
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              While posting the personal data without consent of the company
            </h3>
            <p className="text-slate-700 leading-relaxed text-lg">
              Under the GDPR, you have the following rights which may be subject to restrictions under local law: (i) the right to withdraw consent to processing where consent is the basis of processing; (ii) the right to access your personal information and certain other supplementary information...
            </p>
          </section>

        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
