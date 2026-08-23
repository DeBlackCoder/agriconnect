import { Activity, TrendingUp, Users, Package, Check } from "lucide-react";

function ProcessStep({ 
  number, 
  title, 
  description, 
  image 
}: { 
  number: string; 
  title: string; 
  description: string; 
  image: string;
}) {
  return (
    <div className="group relative">
      <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl mb-6">
        <div 
          className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
          style={{ backgroundImage: `url('${image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute top-6 left-6 w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl font-bold text-green-600 shadow-lg">
          {number}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-32 bg-gray-200 relative overflow-hidden">
      {/* Background Pattern */}
     

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-20">
          <ProcessStep
            number="1"
            title="Create Your Account"
            description="Sign up as a farmer or buyer in minutes. Complete your profile with relevant details to start trading immediately."
            image="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800"
          />
          <ProcessStep
            number="2"
            title="List or Browse Products"
            description="Farmers list their produce with photos and prices. Buyers browse the marketplace and place orders with confidence."
            image="https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=800"
          />
          <ProcessStep
            number="3"
            title="Secure Transaction"
            description="Complete the trade with our secure payment system. Track delivery in real-time and confirm receipt when satisfied."
            image="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800"
          />
        </div>

        {/* Additional Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-300">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Live Activity Feed</h4>
            <p className="text-gray-600 text-sm">Monitor all platform activities in real-time</p>
          </div>
          
          <div className="bg-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-300">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Market Trends</h4>
            <p className="text-gray-600 text-sm">Stay updated with price movements</p>
          </div>
          
          <div className="bg-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-300">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Community Network</h4>
            <p className="text-gray-600 text-sm">Connect with trusted partners</p>
          </div>
          
          <div className="bg-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-300">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Inventory Management</h4>
            <p className="text-gray-600 text-sm">Track stock levels effortlessly</p>
          </div>
        </div>
      </div>
    </section>
  );
}
