"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import RecallModal from "./RecallModal";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [recallModalOpen, setRecallModalOpen] = useState(false);

  // TODO: Replace with real auth (Context or session) later
  const isAdminLoggedIn = false;   // Change this dynamically later

  const navLinks = [
    { name: "Services", href: "/#Services", id: "Services" },
    { name: "How It Works", href: "/#Howitworks", id: "Howitworks" },
    { name: "Pricing", href: "/#Pricing", id: "Pricing" },
    { name: "Dashboard", href: "/dashboard", adminOnly: true },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy-policy" },
  ];

  const handleNavClick = (link: { href: string; id?: string }) => {
    if (link.id && window.location.pathname !== "/") {
      window.location.href = link.href;
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    // TODO: Add your real logout logic here (clear token, etc.)
    window.location.href = "/";
  };

  // Filter nav links - show Dashboard only when admin is logged in
  const visibleNavLinks = navLinks.filter(link => 
    !link.adminOnly || isAdminLoggedIn
  );

  return (
    <>
      <header className="bg-white border-b border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-34 h-14 bg-black rounded flex items-center justify-center">
              <Image
                src="/sub.png"
                alt="SubmitAR Logo"
                width={140}
                height={140}
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-500">
            {visibleNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => handleNavClick(link)}
                className="hover:text-black transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-4">
            {isAdminLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all"
              >
                Log Out
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setRecallModalOpen(true)}
                className="bg-[#0052cc] hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all"
              >
                Track Your Order
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
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
              {visibleNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => handleNavClick(link)}
                  className="text-base font-medium text-gray-600 hover:text-black py-2"
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 border-t">
                {isAdminLoggedIn ? (
                  <button
                    onClick={() => { setIsOpen(false); handleLogout(); }}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold"
                  >
                    Log Out
                  </button>
                ) : (
                  <button
                    onClick={() => { setIsOpen(false); setRecallModalOpen(true); }}
                    className="w-full bg-[#0052cc] text-white py-3 rounded-lg font-semibold"
                  >
                    Track Your Order
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <RecallModal
        isOpen={recallModalOpen}
        onClose={() => setRecallModalOpen(false)}
        onVerified={(identifier) => console.log("Verified:", identifier)}
      />
    </>
  );
}