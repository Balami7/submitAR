import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { FaXTwitter, FaInstagram, FaFacebook, FaLinkedinIn } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import { HiOutlinePhone, HiOutlineMail, HiOutlineLocationMarker } from "react-icons/hi";
import { IoPaperPlaneSharp } from "react-icons/io5";

export default function Footer() {
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-black p-1.5 rounded">
                <Image src="/logo.jpeg" alt="Logo" width={60} height={24} />
              </div>
              <span className="text-xl text-black font-bold">SubmitAR</span>
            </div>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">
              A trusted partner for document submission and representation.
            </p>
            <div className="flex gap-4 text-gray-600">
              <FaXTwitter className="hover:text-black cursor-pointer" />
              <FaInstagram className="hover:text-pink-600 cursor-pointer" />
              <FaFacebook className="hover:text-blue-600 cursor-pointer" />
              <FaTiktok className="hover:text-black cursor-pointer" />
              <FaLinkedinIn className="hover:text-blue-700 cursor-pointer" />
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className="font-bold text-black mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/about" className="hover:text-black">About Us</Link></li>
              <li><Link href="/services" className="hover:text-black">Services</Link></li>
              <li><Link href="/how-it-works" className="hover:text-black">How it works</Link></li>
              <li><Link href="/pricing" className="hover:text-black">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-black mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/privacy" className="hover:text-black">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-black">Terms and Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-black mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2"><HiOutlinePhone className="text-lg" /> +234 816 602 7757</li>
              <li className="flex items-center gap-2"><HiOutlineMail className="text-lg" /> support@submitar.ng</li>
              <li className="flex items-center gap-2"><HiOutlineLocationMarker className="text-lg" /> Abuja, Nigeria</li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-black mb-2">Subscribe to our newsletter</h4>
            <p className="text-xs text-gray-500 mb-4">Get the latest updates and offers delivered to your email.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full border border-gray-200 rounded-md py-2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button className="absolute right-1 top-1 bottom-1 bg-blue-600 text-white px-2 rounded flex items-center justify-center hover:bg-blue-700">
                <IoPaperPlaneSharp size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* Copyright */}
            <div className="text-center text-xs text-gray-400 border-t border-gray-50 pt-8">
            ©{new Date().getFullYear()} Submitar.com. All rights reserved.
            </div>
      </div>
    </footer>
  );
}
