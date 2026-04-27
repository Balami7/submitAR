import React from 'react';
import Link from 'next/link';

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
      featured: true, // Adds the blue border from your image
    },
    {
      name: "Custom",
      price: "Contact Us",
      description: "Meeting representation and complex submissions.",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
          Simple Pricing
        </h2>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-gray-100 rounded-xl p-8 flex flex-col items-center text-center border-2 ${
                plan.featured ? 'border-blue-500' : 'border-transparent'
              }`}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-xl font-bold text-black mb-4">{plan.price}</p>
              <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">
                {plan.description}
              </p>
            </div>
          ))}
        </div>

        {/* Final CTA Banner */}
            <div className="bg-[#0052cc] rounded-2xl p-8 md:p-12 lg:mx-25 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* lg:mx-25 applies the large margin only on desktop, mobile stays normal */}
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
                className="w-full md:w-auto bg-white text-[#0052cc] px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors text-center whitespace-nowrap"
            >
                Get Started
            </Link>
            </div>


      </div>
    </section>
  );
}
