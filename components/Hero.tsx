import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineBadgeCheck, HiOutlineShieldCheck, HiOutlineClock } from 'react-icons/hi';

export default function Hero() {
  return (
    // Changed pt-12 to pt-4 and pb-20 to pb-10 for a tighter fit
    <section className="bg-white pt-4 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Content Column */}
          <div className="order-2 lg:order-1">
            {/* Reduced text size and bottom margin */}
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-3">
              Submit your documents <br /> 
              <span className="text-gray-800">without being there.</span>
            </h1>
            
            {/* Reduced bottom margin */}
            <p className="text-md text-gray-500 mb-6 max-w-md">
              We handle documents submissions, meeting, and follow ups on your behalf with trusted representatives.
            </p>

            {/* Compact Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Link href="/get-started" className="bg-[#0052cc] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-all">
                Get Started
              </Link>
              <Link href="/learn-more" className="border border-blue-600 text-blue-600 px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-all">
                Learn more
              </Link>
            </div>

            {/* Trust Badges - tighter gap */}
            <div className="flex flex-wrap gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <HiOutlineBadgeCheck className="text-blue-600 text-lg" />
                <span>Verified Representative</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HiOutlineShieldCheck className="text-blue-600 text-lg" />
                <span>Secure handling</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HiOutlineClock className="text-blue-600 text-lg" />
                <span>Real time updates</span>
              </div>
            </div>
          </div>

          {/* Right Image Column - Smaller max-width */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm lg:max-w-md aspect-square">
              <Image 
                src="/image2.png" 
                alt="Representative"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
