import { Star } from "lucide-react";

function TestimonialCard({ 
  name, 
  role, 
  image, 
  content, 
  rating 
}: { 
  name: string; 
  role: string; 
  image: string; 
  content: string; 
  rating: number;
}) {
  return (
    <div className="bg-gray-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-300">
      <div className="flex items-center gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="text-gray-700 leading-relaxed mb-6 italic">
        &quot;{content}&quot;
      </p>
      <div className="flex items-center gap-4">
        <div 
          className="w-14 h-14 rounded-full bg-cover bg-center border-2 border-green-200"
          style={{ backgroundImage: `url('${image}')` }}
        />
        <div>
          <div className="font-bold text-gray-900">{name}</div>
          <div className="text-sm text-gray-600">{role}</div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070')",
        }}
      />
      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real stories from farmers and buyers who transformed their business
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <TestimonialCard
            name="Abubakar Mohammed"
            role="Farmer, Kano State"
            image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400"
            content="Smart Agriconnect has revolutionized how I sell my crops. No more middlemen taking my profits. I now connect directly with buyers and get fair prices!"
            rating={5}
          />
          <TestimonialCard
            name="Chioma Okafor"
            role="Restaurant Owner, Lagos"
            image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400"
            content="As a buyer, I love the transparency and quality. I can see exactly where my produce comes from and track deliveries in real-time. Fantastic platform!"
            rating={5}
          />
          <TestimonialCard
            name="Ibrahim Yusuf"
            role="Agricultural Cooperative, Kaduna"
            image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400"
            content="This platform has increased our sales by 60% in just three months. The payment system is secure and the support team is always helpful."
            rating={5}
          />
        </div>
      </div>
    </section>
  );
}
