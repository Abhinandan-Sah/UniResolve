import React from 'react'
import Image from 'next/image'

export default function Hero() {
  return (
    <section id="home" className="w-full bg-[#071026] text-white min-h-screen flex items-center">
      <div className="w-full px-22 ">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 lg:col-span-7 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4">UniResolve — Automated Assessment for Universities</h1>
            <p className="text-lg text-muted max-w-3xl md:max-w-none md:pr-8 mb-6">Trusted AI-powered evaluation that speeds up grading, improves fairness, and provides actionable feedback for educators. Fast, explainable, and easy to integrate.</p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3 justify-center md:justify-start">
              <a href="#proposal" className="inline-block bg-[#2563eb] hover:bg-[#1e50c8] text-white px-6 py-3 rounded-full font-semibold">Get Started</a>
              <a href="/contact" className="inline-block border border-white/10 hover:border-white/20 text-white px-6 py-3 rounded-full">Request Demo</a>
            </div>
          </div>

          <div className="md:col-span-5 lg:col-span-5 flex items-center justify-center relative">
            <div className="relative w-full max-w-[900px]">
              {/* decorative blurred shape behind the screenshot */}
              <div className="hidden md:block absolute -right-12 -top-12 w-56 h-56 rounded-full bg-green-400/20 blur-3xl transform rotate-12" />

              <div className="rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                <Image
                  src="https://www.testportal.net/img/2438x1808/787b387f05/hero-app-screen-v2-en-5.png/m/1200x0/filters:quality(75):format(webp)"
                  alt="UniResolve app preview"
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover block"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
