"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle, Sprout, Users } from "lucide-react";
import { useState, useEffect } from "react";

export default function PremiumAgriHero() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 pt-0">
      {/* Agricultural Background Image with Parallax */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070')",
            transform: `translateY(${scrollY * 0.5}px) scale(1.1)`,
          }}
        />
        {/* Multi-layer Overlay */}
          
      
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 pt-48 md:pt-56 lg:pt-64 pb-20 md:pb-28">
        <div className="max-w-4xl">
          
          {/* Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            

            {/* Heading with Background Image Mask */}
            <div className="mb-8">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-4">
                <span 
                  className="block bg-clip-text text-transparent bg-cover bg-center"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070')",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                >
                  Fair Prices,
                </span>
                <span 
                  className="block bg-clip-text text-transparent bg-cover bg-center mt-2"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070')",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    backgroundPosition: "center bottom",
                    backgroundSize: "cover",
                  }}
                >
                  Direct Connection
                </span>
              </h1>
            </div>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-gray-200 leading-relaxed mb-10 max-w-xl font-light">
              Connect directly with buyers and secure transparent deals. No intermediaries, no uncertainty—just <span className="font-semibold text-emerald-300">fair prices</span> for quality produce.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/auth/register?role=farmer"
                className="group relative inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-600 text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-1 hover:scale-105"
              >
                Start Selling
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                href="/auth/register?role=buyer"
                className="inline-flex items-center justify-center px-10 py-5 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold text-lg rounded-xl border-2 border-white/30 hover:border-white/50 transition-all duration-300 shadow-2xl hover:-translate-y-1"
              >
                Browse Listings
              </Link>
            </div>

            {/* Trust Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
              <div className="group">
                <div className="text-4xl md:text-5xl font-black text-white group-hover:scale-110 transition-transform">10K+</div>
                <p className="text-sm text-gray-300 mt-1 font-medium">Farmers</p>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-black text-white group-hover:scale-110 transition-transform">500+</div>
                <p className="text-sm text-gray-300 mt-1 font-medium">Buyers</p>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-black text-white group-hover:scale-110 transition-transform">99.9%</div>
                <p className="text-sm text-gray-300 mt-1 font-medium">Uptime</p>
              </div>
            </div>
          </div>

        </div>

        {/* Feature Pills - Bottom Section */}
        <div className={`mt-24 pt-16 border-t border-white/10 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="flex gap-5 items-start group hover:translate-y-[-4px] transition-transform duration-300">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Sprout className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black text-white mb-2">Transparent Pricing</h3>
                <p className="text-sm text-gray-300 leading-relaxed">See real market rates and negotiate directly without hidden fees</p>
              </div>
            </div>

            <div className="flex gap-5 items-start group hover:translate-y-[-4px] transition-transform duration-300">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black text-white mb-2">Direct Connection</h3>
                <p className="text-sm text-gray-300 leading-relaxed">Bypass middlemen and build lasting relationships with buyers</p>
              </div>
            </div>

            <div className="flex gap-5 items-start group hover:translate-y-[-4px] transition-transform duration-300">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black text-white mb-2">Secure Trading</h3>
                <p className="text-sm text-gray-300 leading-relaxed">Protected payments, verified profiles, and dispute resolution built-in</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
