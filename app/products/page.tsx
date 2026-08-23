'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Star, MapPin, Package, Leaf } from 'lucide-react';
import MarketplaceNav from '@/components/MarketplaceNav';

interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
  pricePerUnit: number;
  unit: string;
  availableStock: number;
  location: string;
  isOrganic: boolean;
  averageRating: number;
  reviewCount: number;
}

// Fetch function
const fetchProducts = async () => {
  console.log('🔄 Fetching products from API...');
  const start = Date.now();
  const response = await fetch('/api/products');
  if (!response.ok) throw new Error('Failed to fetch products');
  const data = await response.json();
  console.log(`✅ Products fetched: ${data.products?.length || 0} in ${Date.now() - start}ms`);
  return data;
};

// Fetch single product for prefetching
const fetchProduct = async (productId: string) => {
  const response = await fetch(`/api/products/${productId}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
};

export default function MarketplacePage() {
  const queryClient = useQueryClient();

  // Use React Query for automatic caching
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // Data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  const products = data?.products || [];

  // Prefetch product on hover
  const handleProductHover = (productId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['product', productId],
      queryFn: () => fetchProduct(productId),
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-32">
      <MarketplaceNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-white mb-4">Fresh Produce Marketplace</h1>
          <p className="text-xl text-gray-300 mb-8">Connect directly with local farmers for the freshest produce</p>
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-12 pr-4 py-4 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-xl font-semibold">Loading fresh products...</p>
            <p className="text-gray-400 text-sm mt-2">Please wait</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-900/20 border border-red-600 rounded-xl p-8 text-center">
            <Package className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-red-400 text-xl font-bold mb-2">Failed to load products</h3>
            <p className="text-gray-400">Please refresh the page to try again.</p>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && !error && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-24 h-24 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
              <p className="text-gray-400">Check back soon for fresh produce!</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">
                  Available Products <span className="text-green-400">({products.length})</span>
                </h2>
                {data?.fromCache && (
                  <span className="px-3 py-1 bg-blue-600/20 border border-blue-500 text-blue-400 text-xs rounded-full">
                    ⚡ Cached
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: Product) => (
                  <Link
                    key={product._id}
                    href={`/products/${product._id}`}
                    onMouseEnter={() => handleProductHover(product._id)}
                    className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-green-500 transition-all group cursor-pointer hover:shadow-2xl hover:shadow-green-500/20 transform hover:-translate-y-1"
                  >
                    {/* Product Image */}
                    <div className="relative h-48 bg-gray-700">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="w-16 h-16 text-gray-600" />
                        </div>
                      )}
                      {product.isOrganic && (
                        <span className="absolute top-2 right-2 px-2 py-1 bg-green-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <Leaf className="w-3 h-3" />
                          Organic
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-2xl font-bold text-green-400">${product.pricePerUnit}</span>
                          <span className="text-gray-400 text-sm">/{product.unit}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-400 text-sm mb-2">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{product.location}</span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                        <span className="text-gray-400 text-xs">
                          Stock: <span className="text-white font-semibold">{product.availableStock} {product.unit}</span>
                        </span>
                        <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full group-hover:bg-green-500 transition-colors">
                          View Details
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}
