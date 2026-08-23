import { TrendingUp, Users, Package, DollarSign } from "lucide-react";

export default function Stats() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/95 via-emerald-900/90 to-teal-900/95"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Growing Together
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Join thousands of farmers and buyers transforming agriculture
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">₦50M+</div>
            <div className="text-white/80">Total Transactions</div>
          </div>

          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">10,000+</div>
            <div className="text-white/80">Active Users</div>
          </div>

          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">5,000+</div>
            <div className="text-white/80">Products Listed</div>
          </div>

          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">95%</div>
            <div className="text-white/80">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}
