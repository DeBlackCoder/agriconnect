import { 
  Lock, 
  Package, 
  DollarSign, 
  CreditCard, 
  BarChart3, 
  Star,
  Sprout,
  BadgeDollarSign,
  Smartphone
} from "lucide-react";

function FeatureCard({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
}) {
  return (
    <div className="group relative bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-700">
      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
            Powerful Features for Modern Agriculture
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Everything you need to transform agricultural trade
          </p>
        </div>

        {/* Featured Image Section */}
        <div className="mb-16 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl group">
            <div 
              className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-700"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2000')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <h3 className="text-3xl font-bold mb-2">Direct Farm-to-Market</h3>
              <p className="text-lg opacity-90">Connect with buyers without intermediaries</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sprout className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Fresh Produce</h4>
                <p className="text-gray-700">Access to the freshest agricultural products directly from farms</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <BadgeDollarSign className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Fair Pricing</h4>
                <p className="text-gray-700">Transparent pricing with market data and price history</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Smartphone className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Easy to Use</h4>
                <p className="text-gray-700">User-friendly interface designed for farmers and buyers</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Lock}
            title="Multi-Role Authentication"
            description="Secure registration and login for Farmers, Buyers, and Administrators with role-based access control."
          />
          <FeatureCard
            icon={Package}
            title="Product Catalog Management"
            description="Farmers can list products, upload images, set prices, and manage inventory in real-time."
          />
          <FeatureCard
            icon={DollarSign}
            title="Real-Time Pricing Engine"
            description="Transparent market pricing with historical data and price benchmarks for fair negotiations."
          />
          <FeatureCard
            icon={CreditCard}
            title="Secure Payment Processing"
            description="Multiple payment methods with encrypted transactions and verifiable payment records."
          />
          <FeatureCard
            icon={BarChart3}
            title="Order Management & Tracking"
            description="Track orders from placement to delivery with real-time status updates and notifications."
          />
          <FeatureCard
            icon={Star}
            title="Ratings & Feedback System"
            description="Build trust through verified reviews and ratings on completed transactions."
          />
        </div>
      </div>
    </section>
  );
}
