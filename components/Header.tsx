"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import RecallModal from "./RecallModal";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [recallModalOpen, setRecallModalOpen] = useState(false);

  const navLinks = [
    { name: "Services", href: "#Services" },
    { name: "How It Works", href: "#Howitworks" },
    { name: "Pricing", href: "#Pricing" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy-policy" },
  ];

  return (
    <>
      <header className="bg-white border-b border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-34 h-14 bg-black rounded flex items-center justify-center">
              <Image
                src="/22.jpeg"
                alt="SubmitAR Logo"
                width={140}
                height={140}
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-500">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-black transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA — now a button that opens the modal */}
          <div className="hidden lg:block">
            <button
              type="button"
              onClick={() => setRecallModalOpen(true)}
              className="bg-[#0052cc] hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all"
            >
              Track Your Order
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 z-50 p-4 shadow-xl">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-base font-medium text-gray-600 hover:text-black py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Track button — opens modal instead of navigating */}
              <button
                type="button"
                onClick={() => { setIsOpen(false); setRecallModalOpen(true); }}
                className="bg-[#0052cc] text-white text-center py-3 rounded-lg font-semibold mt-2 text-sm"
              >
                Track Your Order
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Modal rendered outside header so it overlays the full page */}
      <RecallModal
        isOpen={recallModalOpen}
        onClose={() => setRecallModalOpen(false)}
        onVerified={(identifier) => {
          // TODO: use identifier to fetch order — for now just log it
          console.log("Verified:", identifier);
        }}
      />
    </>
  );
}