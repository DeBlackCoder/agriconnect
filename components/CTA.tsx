import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1595855759920-86582396756a?q=80&w=2070')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/95 via-emerald-900/90 to-teal-900/95"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Ready to Transform Your
          <br />
          <span className="bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
            Agricultural Business?
          </span>
        </h2>
        <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join thousands of farmers and buyers already benefiting from direct trade, 
          fair prices, and secure transactions.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link
            href="/auth/register?role=farmer"
            className="group px-10 py-5 text-lg font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
          >
            <span className="flex items-center justify-center gap-2">
              Start Selling Today
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link
            href="/auth/register?role=buyer"
            className="group px-10 py-5 text-lg font-bold text-green-600 bg-white border-2 border-white rounded-xl hover:bg-green-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
          >
            <span className="flex items-center justify-center gap-2">
              Start Buying Today
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 text-white/60 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
            <span>Free to get started</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
            <span>24/7 support included</span>
          </div>
        </div>
      </div>
    </section>
  );
}
