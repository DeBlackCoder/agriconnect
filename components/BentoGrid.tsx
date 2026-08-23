import { 
  Star, 
  Zap, 
  BarChart3, 
  Shield, 
  Smartphone, 
  Bell, 
  MessageCircle, 
  DollarSign, 
  Truck, 
  Lightbulb,
  CheckCircle2
} from "lucide-react";

export default function BentoGrid() {
  return (
    <section className="py-20 md:py-32 bg-gray-900 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-4">
            <Star className="w-4 h-4 text-green-600 fill-green-600" />
            <span className="text-sm font-semibold text-green-800">Platform Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            Everything You Need<br />
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              in One Platform
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Discover powerful tools designed specifically for modern agriculture
          </p>
        </div>

        {/* Enhanced Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 md:gap-6">
          
          {/* 1. Large Feature - Real-Time Market Intelligence */}
          <div className="md:col-span-6 lg:col-span-8 md:row-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-8 md:p-12 text-white shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-1">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -ml-32 -mb-32 blur-3xl animate-pulse animation-delay-2000"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl mb-6 transform group-hover:rotate-6 transition-transform duration-500">
                <Zap className="w-10 h-10" />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Real-Time Market<br />Intelligence
              </h3>
              <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed max-w-xl">
                Access live pricing data, market trends, and demand forecasts to make informed decisions.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Live Price Tracking</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Historical Analysis</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Demand Predictions</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Market Insights</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full px-5 py-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span>Live Data Updates</span>
              </div>
            </div>
          </div>

          {/* 2. Analytics Dashboard with Image */}
          <div className="md:col-span-3 lg:col-span-4 md:row-span-2 group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-1">
            <div 
              className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-1000"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40"></div>
            
            <div className="relative z-10 p-8 h-full flex flex-col justify-end">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl mb-4 transform group-hover:scale-110 transition-transform duration-500">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Analytics Dashboard
              </h3>
              <p className="text-white/90 text-base md:text-lg leading-relaxed mb-4">
                Comprehensive insights with visual reports and performance tracking.
              </p>
              
              <div className="flex items-center gap-3 text-sm text-white/80">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Sales</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Orders</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Inventory</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Secure Escrow System */}
          <div className="md:col-span-3 lg:col-span-4 group relative overflow-hidden rounded-3xl bg-gray-200 p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border-2 border-gray-300">
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Shield className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Secure Escrow System</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Payments held safely until delivery confirmed, protecting both parties.
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Bank-grade security</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Smart Notifications */}
          <div className="md:col-span-3 lg:col-span-4 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <Bell className="w-8 h-8" />
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold mb-3">Smart Notifications</h3>
              <p className="text-white/90 leading-relaxed mb-5">
                Instant alerts for orders, prices, and deliveries.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-3 text-sm">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <span>New order received</span>
                </div>
                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-3 text-sm">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse animation-delay-200"></div>
                  <span>Price alert triggered</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Mobile-First Design */}
          <div className="md:col-span-3 lg:col-span-4 group relative overflow-hidden rounded-3xl bg-gray-200 p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border-2 border-gray-300">
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                <Smartphone className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Mobile-First Design</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Manage your business on-the-go with our responsive interface.
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-purple-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Works offline</span>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Support - Compact */}
          <div className="md:col-span-2 lg:col-span-3 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-600 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl mb-4 transform group-hover:rotate-12 transition-transform duration-500">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-white/80 text-sm mb-3">Always here to help you succeed</p>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-medium">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Online now</span>
              </div>
            </div>
          </div>

          {/* 7. Low Fees - Compact */}
          <div className="md:col-span-2 lg:col-span-3 group relative overflow-hidden rounded-3xl bg-gray-200 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border-2 border-gray-300">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 text-white shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                <DollarSign className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Low Fees</h3>
              <p className="text-gray-600 text-sm mb-2">Transparent pricing</p>
              <div className="text-3xl font-bold text-green-600">2%</div>
              <p className="text-xs text-gray-500">Per transaction</p>
            </div>
          </div>

          {/* 8. Fast Delivery - Compact */}
          <div className="md:col-span-2 lg:col-span-3 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl mb-4 transform group-hover:-rotate-12 transition-transform duration-500">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-white/80 text-sm">Real-time tracking & updates</p>
            </div>
          </div>

          {/* 9. Wide Announcement - AI Feature */}
          <div className="md:col-span-6 lg:col-span-12 group relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 md:p-10 text-white shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-1">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl rounded-full px-5 py-2 mb-5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                  <span className="text-sm font-semibold">Coming Soon</span>
                </div>
                
                <h3 className="text-2xl md:text-4xl font-bold mb-4">
                  AI-Powered Crop Recommendations
                </h3>
                <p className="text-white/90 text-base md:text-xl leading-relaxed max-w-2xl">
                  Get personalized suggestions based on soil conditions, weather patterns, and market demand predictions powered by machine learning.
                </p>
              </div>
              
              <div className="flex-shrink-0">
                <div className="w-28 h-28 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                  <Lightbulb className="w-14 h-14" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
