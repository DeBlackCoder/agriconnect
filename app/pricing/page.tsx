'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MarketplaceNav from '@/components/MarketplaceNav';
import { TrendingUp, TrendingDown, Minus, DollarSign, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  pricePerUnit: number;
  unit: string;
  categoryId: string;
}

interface Benchmark {
  product: {
    id: string;
    name: string;
    currentPrice: number;
    unit: string;
  };
  benchmark: {
    average: number;
    median: number;
    min: number;
    max: number;
    sampleSize: number;
  };
  analysis: {
    percentileRank: number;
    competitive: string;
    priceDifferenceFromAverage: number;
    recommendation: string;
  };
  optimalPriceRange: {
    min: number;
    max: number;
  };
}

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [benchmark, setBenchmark] = useState<Benchmark | null>(null);
  const [loadingBenchmark, setLoadingBenchmark] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (!response.ok || !data.user) {
        router.push('/auth/login');
        return;
      }

      fetchProducts();
    } catch (error) {
      router.push('/auth/login');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (response.ok && data.products) {
        setProducts(data.products);
        if (data.products.length > 0) {
          setSelectedProduct(data.products[0]._id);
          fetchBenchmark(data.products[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBenchmark = async (productId: string) => {
    if (!productId) return;
    
    setLoadingBenchmark(true);
    try {
      const response = await fetch(`/api/pricing/benchmark?productId=${productId}`);
      const data = await response.json();
      
      if (response.ok) {
        setBenchmark(data);
      }
    } catch (error) {
      console.error('Error fetching benchmark:', error);
    } finally {
      setLoadingBenchmark(false);
    }
  };

  const handleProductChange = (productId: string) => {
    setSelectedProduct(productId);
    fetchBenchmark(productId);
  };

  const getCompetitiveColor = (competitive: string) => {
    switch (competitive) {
      case 'competitive':
        return 'text-green-400 bg-green-900/30';
      case 'below_average':
        return 'text-yellow-400 bg-yellow-900/30';
      case 'above_average':
        return 'text-red-400 bg-red-900/30';
      default:
        return 'text-gray-400 bg-gray-900/30';
    }
  };

  const getCompetitiveLabel = (competitive: string) => {
    switch (competitive) {
      case 'competitive':
        return 'Competitive';
      case 'below_average':
        return 'Below Average';
      case 'above_average':
        return 'Above Average';
      default:
        return 'Average';
    }
  };

  const getTrendIcon = (diff: number) => {
    if (diff > 5) return <TrendingUp className="w-5 h-5 text-red-400" />;
    if (diff < -5) return <TrendingDown className="w-5 h-5 text-green-400" />;
    return <Minus className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-32">
      <MarketplaceNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Price Intelligence</h1>
          <p className="text-gray-400">Get market insights and optimize your pricing strategy</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-white text-xl">Loading pricing data...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
            <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Products Yet</h3>
            <p className="text-gray-400 mb-6">Add products to see pricing insights</p>
            <Link
              href="/products/create"
              className="inline-block px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition font-semibold"
            >
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Product Selector */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <label className="block text-gray-300 font-medium mb-3">
                Select Product to Analyze
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} - ${product.pricePerUnit}/{product.unit}
                  </option>
                ))}
              </select>
            </div>

            {loadingBenchmark ? (
              <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
                <div className="text-white">Analyzing market data...</div>
              </div>
            ) : benchmark ? (
              <>
                {/* Price Status Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-gray-700">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{benchmark.product.name}</h2>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-bold text-green-400">
                          ${benchmark.product.currentPrice}
                        </span>
                        <span className="text-xl text-gray-400">/{benchmark.product.unit}</span>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full font-semibold ${getCompetitiveColor(benchmark.analysis.competitive)}`}>
                      {getCompetitiveLabel(benchmark.analysis.competitive)}
                    </div>
                  </div>

                  {/* Price Difference Indicator */}
                  <div className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg">
                    {getTrendIcon(benchmark.analysis.priceDifferenceFromAverage)}
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm">vs Market Average</p>
                      <p className="text-white font-semibold">
                        {benchmark.analysis.priceDifferenceFromAverage > 0 ? '+' : ''}
                        {benchmark.analysis.priceDifferenceFromAverage.toFixed(2)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">Market Avg</p>
                      <p className="text-white font-semibold">${benchmark.benchmark.average}</p>
                    </div>
                  </div>
                </div>

                {/* Market Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-400 text-sm">Market Average</p>
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">${benchmark.benchmark.average}</p>
                    <p className="text-xs text-gray-500 mt-1">{benchmark.benchmark.sampleSize} products</p>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-400 text-sm">Market Median</p>
                      <DollarSign className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">${benchmark.benchmark.median}</p>
                    <p className="text-xs text-gray-500 mt-1">Middle value</p>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-400 text-sm">Price Range</p>
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">
                      ${benchmark.benchmark.min} - ${benchmark.benchmark.max}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Market spread</p>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-400 text-sm">Your Ranking</p>
                      <CheckCircle className="w-5 h-5 text-yellow-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {benchmark.analysis.percentileRank.toFixed(0)}th
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Percentile</p>
                  </div>
                </div>

                {/* Optimal Price Range */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    Optimal Price Range
                  </h3>
                  <div className="relative">
                    {/* Price Scale */}
                    <div className="h-12 bg-gray-900 rounded-lg relative overflow-hidden">
                      {/* Market Min-Max Range */}
                      <div 
                        className="absolute h-full bg-gray-700"
                        style={{
                          left: '0%',
                          width: '100%',
                        }}
                      />
                      {/* Optimal Range */}
                      <div 
                        className="absolute h-full bg-green-600/30 border-l-2 border-r-2 border-green-500"
                        style={{
                          left: `${((benchmark.optimalPriceRange.min - benchmark.benchmark.min) / (benchmark.benchmark.max - benchmark.benchmark.min)) * 100}%`,
                          width: `${((benchmark.optimalPriceRange.max - benchmark.optimalPriceRange.min) / (benchmark.benchmark.max - benchmark.benchmark.min)) * 100}%`,
                        }}
                      />
                      {/* Current Price Marker */}
                      <div 
                        className="absolute top-0 bottom-0 w-1 bg-yellow-400"
                        style={{
                          left: `${((benchmark.product.currentPrice - benchmark.benchmark.min) / (benchmark.benchmark.max - benchmark.benchmark.min)) * 100}%`,
                        }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                          <span className="px-2 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded">
                            You: ${benchmark.product.currentPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Labels */}
                    <div className="flex justify-between mt-3 text-sm">
                      <span className="text-gray-400">${benchmark.benchmark.min}</span>
                      <span className="text-green-400 font-semibold">
                        ${benchmark.optimalPriceRange.min} - ${benchmark.optimalPriceRange.max}
                      </span>
                      <span className="text-gray-400">${benchmark.benchmark.max}</span>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className={`rounded-xl p-6 border-2 ${
                  benchmark.analysis.competitive === 'competitive'
                    ? 'bg-green-900/20 border-green-700'
                    : 'bg-yellow-900/20 border-yellow-700'
                }`}>
                  <div className="flex items-start gap-4">
                    <AlertCircle className={`w-6 h-6 flex-shrink-0 ${
                      benchmark.analysis.competitive === 'competitive'
                        ? 'text-green-400'
                        : 'text-yellow-400'
                    }`} />
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Recommendation</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {benchmark.analysis.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : benchmark === null && !loadingBenchmark ? (
              <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
                <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No benchmark data available for this product</p>
              </div>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}
