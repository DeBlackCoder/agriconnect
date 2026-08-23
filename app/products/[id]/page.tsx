'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Package, 
  ShoppingCart, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Shield,
  Leaf,
  Star,
  User,
  ChevronDown,
  Check,
  Truck,
  CreditCard,
  BarChart3
} from 'lucide-react';
import MarketplaceNav from '@/components/MarketplaceNav';

interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
  pricePerUnit: number;
  unit: string;
  availableStock: number;
  minimumOrder: number;
  location: string;
  isOrganic: boolean;
  harvestDate?: string;
  views: number;
  farmerId: {
    _id: string;
    fullName: string;
    phoneNumber?: string;
  };
  categoryId?: {
    _id: string;
    name: string;
    icon?: string;
  };
}

interface Specification {
  label: string;
  value: string;
}

// Fetch function for React Query
const fetchProduct = async (productId: string) => {
  console.log(`🔄 Fetching product ${productId}...`);
  const start = Date.now();
  const response = await fetch(`/api/products/${productId}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  console.log(`✅ Product fetched in ${Date.now() - start}ms`);
  return data;
};

export default function ProductPage() {
  const params = useParams();
  const productId = params?.id as string;
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'faq'>('details');

  // Use React Query for caching and automatic refetch management
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Cache for 10 minutes
    retry: 2,
  });

  // Update quantity when product loads
  useEffect(() => {
    if (product) {
      setQuantity(product.minimumOrder || 1);
    }
  }, [product]);

  // Mock data for enhanced features
  const specifications: Specification[] = [
    { label: 'Type', value: 'Fresh Produce' },
    { label: 'Shelf Life', value: '7-10 days' },
    { label: 'Storage', value: 'Refrigerate (2-4°C)' },
    { label: 'Certification', value: 'Organic Certified' },
  ];

  const reviews = [
    { rating: 5, count: 342, percentage: 68 },
    { rating: 4, count: 98, percentage: 20 },
    { rating: 3, count: 35, percentage: 7 },
    { rating: 2, count: 12, percentage: 3 },
    { rating: 1, count: 13, percentage: 2 },
  ];

  const faqs = [
    { q: 'What is your return policy?', a: 'We offer 48-hour returns for damaged or unsatisfactory products. Contact seller for replacement.' },
    { q: 'How is delivery arranged?', a: 'Delivery is coordinated directly with the seller. Payment secured until delivery confirmation.' },
    { q: 'Are products pesticide-free?', a: 'Yes, all organic products are certified pesticide and fertilizer-free.' },
    { q: 'What is the minimum order?', a: `Minimum order is ${product?.minimumOrder || 'N/A'} ${product?.unit || ''}. Larger orders may qualify for discounts.` },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <MarketplaceNav />
        <div className="pt-24 pb-12 sm:pt-28 md:pt-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Skeleton Breadcrumb */}
            <div className="mb-6 h-6 w-40 bg-gray-700 rounded animate-pulse"></div>

            {/* Skeleton Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Left Column Skeleton */}
              <div className="lg:col-span-2 space-y-6">
                {/* Image Skeleton */}
                <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                  <div className="aspect-square sm:aspect-video lg:aspect-square bg-gray-700 animate-pulse"></div>
                  <div className="p-3 sm:p-4 bg-gray-900 flex gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-16 sm:h-20 w-16 sm:w-20 bg-gray-700 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                </div>

                {/* Overview Skeleton */}
                <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 space-y-4">
                  <div className="h-8 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-20 bg-gray-900 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column Skeleton */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 space-y-4">
                  <div className="h-12 bg-gray-700 rounded w-1/2 animate-pulse"></div>
                  <div className="h-16 bg-gray-900 rounded-lg animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-1/3 animate-pulse"></div>
                    <div className="h-12 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="h-12 bg-green-600 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-900">
        <MarketplaceNav />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center px-4">
            <Package className="w-24 h-24 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
            <p className="text-gray-400 mb-6">{error instanceof Error ? error.message : 'This product does not exist'}</p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Now we know product exists
  const totalPrice = product.pricePerUnit * quantity;
  const phoneNumber = product.farmerId.phoneNumber?.replace(/[^0-9]/g, '') || '';
  const avgRating = 4.8;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <MarketplaceNav />
      
      <div className="pt-24 pb-12 sm:pt-28 md:pt-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link 
              href="/products" 
              className="inline-flex items-center text-green-400 hover:text-green-300 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Link>
          </div>

          {/* Main Grid - Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg">
                {/* Main Image */}
                <div className="relative bg-gray-900 aspect-square sm:aspect-video lg:aspect-square">
                  {product.images?.[selectedImage] ? (
                    <Image
                      src={product.images[selectedImage]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority={selectedImage === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-700">
                      <Package className="w-20 h-20 text-gray-600" />
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-col gap-2">
                    {product.isOrganic && (
                      <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-full text-xs sm:text-sm font-bold shadow-lg">
                        <Leaf className="w-3 h-3 sm:w-4 sm:h-4" />
                        Organic
                      </div>
                    )}
                    {product.categoryId && (
                      <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                        {product.categoryId.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnail Gallery - Horizontal Scroll on Mobile */}
                {product.images && product.images.length > 1 && (
                  <div className="p-3 sm:p-4 bg-gray-900 border-t border-gray-700">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {product.images.map((image: string, index: number) => {
                        const isSelected = selectedImage === index;
                        const buttonClasses = `relative flex-shrink-0 h-16 sm:h-20 w-16 sm:w-20 rounded-lg overflow-hidden border-2 transition-all ${
                          isSelected
                            ? 'border-green-500 ring-2 ring-green-500' 
                            : 'border-gray-600 hover:border-green-400'
                        }`;
                        
                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={buttonClasses}
                          >
                            <Image 
                              src={image} 
                              alt={`${product.name} ${index + 1}`} 
                              fill 
                              className="object-cover"
                              loading={index < 4 ? "eager" : "lazy"}
                              sizes="80px"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Overview Card */}
              <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{product.name}</h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-4 pb-4 border-b border-gray-700">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">{avgRating} • 487 reviews</span>
                  <span className="text-gray-400 text-sm">•</span>
                  <span className="text-gray-400 text-sm">{product.views} views</span>
                </div>

                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{product.description}</p>

                {/* Quick Stats - Responsive Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                  <div className="bg-gray-900 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">Stock Available</p>
                    <p className="text-lg sm:text-xl font-bold text-green-400">{product.availableStock}</p>
                    <p className="text-xs text-gray-500">{product.unit}</p>
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">Min. Order</p>
                    <p className="text-lg sm:text-xl font-bold text-white">{product.minimumOrder}</p>
                    <p className="text-xs text-gray-500">{product.unit}</p>
                  </div>
                  
                  {product.harvestDate && (
                    <div className="bg-gray-900 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-400 mb-1">Harvested</p>
                      <p className="text-lg sm:text-xl font-bold text-white">
                        {new Date(product.harvestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-gray-900 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">Status</p>
                    <p className="text-lg sm:text-xl font-bold text-green-400">Fresh</p>
                  </div>
                </div>
              </div>

              {/* Specifications Section */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'specs' ? null : 'specs')}
                  className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-gray-750 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    Specifications
                  </h3>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedSection === 'specs' ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedSection === 'specs' && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-700">
                    {specifications.map((spec, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">{spec.label}</span>
                        <span className="text-white font-medium text-sm">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Information Sections */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Delivery Info */}
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Truck className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-sm mb-1">Delivery</h4>
                      <p className="text-gray-400 text-xs">Arranged with seller. Payment secured.</p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-sm mb-1">Payment</h4>
                      <p className="text-gray-400 text-xs">Secure & verified transactions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sticky Purchase Section */}
            <div className="lg:col-span-1 space-y-4">
              {/* Purchase Card */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 sm:p-6 border-2 border-green-600/30 shadow-lg lg:sticky lg:top-24">
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-bold text-green-400">${product.pricePerUnit}</span>
                    <span className="text-lg sm:text-xl text-gray-400">/{product.unit}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-gray-900 rounded-lg p-3 mb-6 border border-gray-700 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-gray-400 text-xs mb-0.5">Location</p>
                    <p className="text-white text-sm font-semibold">{product.location}</p>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-white font-semibold mb-3 text-sm">Quantity ({product.unit})</label>
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      onClick={() => setQuantity(Math.max(product.minimumOrder, quantity - 1))}
                      className="w-10 h-10 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-bold border border-gray-600 text-lg"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || product.minimumOrder;
                        setQuantity(Math.max(product.minimumOrder, Math.min(product.availableStock, val)));
                      }}
                      className="flex-1 px-3 py-2 bg-gray-700 text-white text-center font-bold rounded-lg border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.availableStock, quantity + 1))}
                      className="w-10 h-10 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-bold border border-gray-600 text-lg"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-sm bg-gray-900 rounded-lg p-3">
                    <span className="text-gray-400">Total</span>
                    <span className="text-green-400 text-lg font-bold">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 mb-3">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="text-sm sm:text-base">Place Order</span>
                </button>

                {/* Trust Badges */}
                <div className="space-y-2 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Verified seller</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span>Secure transaction</span>
                  </div>
                </div>
              </div>

              {/* Seller Card */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-emerald-600/30 shadow-lg">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-emerald-100 text-xs font-medium">Seller</p>
                      <h3 className="text-white font-bold text-sm sm:text-base truncate">{product.farmerId.fullName}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-300 text-yellow-300" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Options */}
                {phoneNumber ? (
                  <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/${phoneNumber}?text=Hi ${product.farmerId.fullName}, I'm interested in your ${product.name} listing on AgriNet.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-lg transition-all text-sm font-medium"
                    >
                      <MessageCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1">WhatsApp</span>
                    </a>
                    
                    {/* Phone */}
                    <a
                      href={`tel:${phoneNumber}`}
                      className="flex items-center gap-3 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-sm font-medium"
                    >
                      <Phone className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1">Call</span>
                    </a>

                    {/* Seller Stats */}
                    <div className="border-t border-gray-700 pt-4 mt-4 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold text-white">24</p>
                        <p className="text-xs text-gray-400">Products</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white">156</p>
                        <p className="text-xs text-gray-400">Sales</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white">98%</p>
                        <p className="text-xs text-gray-400">Rating</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 sm:p-6 text-center text-gray-400 text-sm">
                    Contact information not available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reviews & FAQ Section */}
          <div className="mt-12 space-y-8">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-700">
              {(['details', 'reviews', 'faq'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors capitalize ${
                    activeTab === tab
                      ? 'text-green-400 border-green-400'
                      : 'text-gray-400 border-transparent hover:text-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'details' && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Product Details</h3>
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Description</h4>
                    <p className="text-gray-300 leading-relaxed">{product.description}</p>
                  </div>

                  {/* Product Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-900 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-400 mb-3">Product Info</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Category</span>
                          <span className="text-white font-medium text-sm">
                            {product.categoryId?.name || 'Uncategorized'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Unit</span>
                          <span className="text-white font-medium text-sm">{product.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Stock</span>
                          <span className="text-white font-medium text-sm">
                            {product.availableStock} {product.unit}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Min. Order</span>
                          <span className="text-white font-medium text-sm">
                            {product.minimumOrder} {product.unit}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-900 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-400 mb-3">Seller Info</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Seller</span>
                          <span className="text-white font-medium text-sm">
                            {product.farmerId.fullName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Location</span>
                          <span className="text-white font-medium text-sm">{product.location}</span>
                        </div>
                        {product.harvestDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Harvest Date</span>
                            <span className="text-white font-medium text-sm">
                              {new Date(product.harvestDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Organic</span>
                          <span className="text-white font-medium text-sm">
                            {product.isOrganic ? 'Yes ✓' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Features */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Why Choose This Product?</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {product.isOrganic && (
                        <div className="flex items-start gap-3 p-3 bg-gray-900 rounded-lg">
                          <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Leaf className="w-4 h-4 text-green-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">Organic Certified</p>
                            <p className="text-gray-400 text-xs">100% organic, no pesticides</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-3 p-3 bg-gray-900 rounded-lg">
                        <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Shield className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">Quality Guaranteed</p>
                          <p className="text-gray-400 text-xs">Fresh from the farm</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-900 rounded-lg">
                        <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Truck className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">Direct from Farmer</p>
                          <p className="text-gray-400 text-xs">No middlemen</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-900 rounded-lg">
                        <div className="w-8 h-8 bg-yellow-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">Verified Seller</p>
                          <p className="text-gray-400 text-xs">Trusted & reliable</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Rating Summary */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div>
                      <div className="text-5xl font-bold text-white">{avgRating}</div>
                      <div className="flex gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-400 text-sm mt-2">Based on 487 reviews</p>
                    </div>
                  </div>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-3">
                  {reviews.map((review) => (
                    <div key={review.rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400" 
                          style={{ width: `${review.percentage}%` }}
                        />
                      </div>
                      <span className="text-gray-400 text-xs w-12 text-right">{review.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(expandedSection === `faq-${idx}` ? null : `faq-${idx}`)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-750 transition-colors"
                    >
                      <span className="text-white font-medium text-sm text-left">{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${expandedSection === `faq-${idx}` ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedSection === `faq-${idx}` && (
                      <div className="px-4 pb-4 pt-2 border-t border-gray-700 text-gray-300 text-sm">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}