"use client";

import Image from "next/image";
import Link from "next/link";   
import Header from "@/components/Header";

export default function AdminSignIn() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempted");
  };

  const handleForgotPassword = () => {
    console.log("Redirecting to forgot password...");
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-white">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[320px]">
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            
            {/* Logo */}
            <div className="flex justify-center mb-3">
              <Image
                src="/22.jpeg"
                alt="submitAR"
                width={130}
                height={40}
                className="object-contain"
                priority
              />
            </div>

            {/* Title */}
            <h1 className="text-center text-[18px] font-bold text-gray-900 mb-4">
              Admin Sign In
            </h1>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-3">
                <label className="block text-[11px] text-black font-semibold mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  className="w-full h-9 px-3 text-[12px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Password */}
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] text-black font-semibold">
                    Password
                  </label>
                  <Link 
                    href="/forgot-password" 
                    className="text-[10px] text-pink-500 hover:underline"
                    >
                    Forgot Password?
                    </Link>
                </div>

                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  className="w-full h-9 px-3 text-[12px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Remember */}
              <div className="flex items-center gap-2 mb-4">
                <input type="checkbox" id="remember" className="w-3.5 h-3.5 cursor-pointer" />
                <label htmlFor="remember" className="text-[11px] text-gray-600 cursor-pointer select-none">
                  Remember Me
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-semibold rounded-md transition-colors"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-2 my-4">
              <div className="flex-1 h-px bg-gray-200" />
              <svg width="14" height="14" viewBox="0 0 24 24" className="text-gray-400">
                <path fill="currentColor" d="M12 2l8 3v7c0 5-3.5 9-8 10-4.5-1-8-5-8-10V5l8-3z"/>
              </svg>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Footer text */}
            <div className="space-y-1">
              <p className="text-center text-[10px] text-gray-500 font-medium">
                Secure Admin Access
              </p>
              <p className="text-center text-[9px] text-gray-400">
                Only authorised personnel can access this area
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
