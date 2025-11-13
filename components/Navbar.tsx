"use client";

import React from 'react';
import Link from 'next/link';
// ThemeToggle removed per request (hidden)

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#071026]/95 backdrop-blur-md border-b border-[#0f1724]/50">
        <div className="w-full px-22 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#6d5df6] to-[#3b82f6] flex items-center justify-center text-white font-bold">UR</div>
              <div className="text-white font-semibold text-lg">UniResolve</div>
            </Link>

            <div className="hidden md:flex gap-6 items-center text-white/80">
              <a href="#home" className="text-sm hover:text-white">Home</a>
              <a href="#universities" className="text-sm hover:text-white">Universities</a>
              <a href="#partners" className="text-sm hover:text-white">Partners</a>
            <a href="#features" className="text-sm hover:text-white">Features</a>
              <a href="#contact" className="text-sm hover:text-white">Contact</a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/auth/login" className="px-3 py-1.5 border border-white/20 text-white rounded">Login</Link>
              <Link href="/auth/signup" className="px-3 py-1.5 bg-[#2563eb] hover:bg-[#1e50c8] text-white rounded">Sign Up</Link>
            </div>
            <button className="sm:hidden p-2 rounded-md border border-white/10 text-white" onClick={() => setMobileOpen((s) => !s)} aria-label="Toggle menu">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden fixed top-16 left-0 right-0 z-40 bg-[#071026]/98 backdrop-blur p-4">
          <div className="flex flex-col gap-3 text-white">
            <a href="#home" className="py-2">Home</a>
            <a href="#features" className="py-2">Features</a>
            <a href="#universities" className="py-2">Universities</a>
            <a href="#partners" className="py-2">Partners</a>
            <a href="#contact" className="py-2">Contact</a>
            <div className="flex gap-2 mt-2">
              <Link href="/auth/login" className="flex-1 px-3 py-2 border border-white/20 rounded text-center">Login</Link>
              <Link href="/auth/signup" className="flex-1 px-3 py-2 bg-[#2563eb] text-white rounded text-center">Sign Up</Link>
            </div>
          </div>
        </div>
      )}

      <div style={{ height: 72, background: '#071026' }} />

    </>
  );
}
