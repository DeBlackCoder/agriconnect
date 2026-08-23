'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MarketplaceNav from '@/components/MarketplaceNav';
import { 
  Package, 
  ShoppingCart, 
  PlusCircle, 
  List, 
  TrendingUp, 
  DollarSign,
  Eye,
  Store,
  ShoppingBag
} from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface Stats {
  myProducts: number;
  myOrders: number;
  totalViews: number;
  totalSales: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats>({
    myProducts: 0,
    myOrders: 0,
    totalViews: 0,
    totalSales: 0,
  });
  const [loading, setLoading] = useState(true);

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

      setUser(data.user);
      // Fetch user stats here if needed
      setLoading(false);
    } catch (error) {
      router.push('/auth/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <MarketplaceNav />
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-32">
      <MarketplaceNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-gray-400">
            Manage your products and orders all in one place
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-xl p-6 border border-green-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-600 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-gray-400 text-sm mb-1">My Products</h3>
            <p className="text-3xl font-bold text-white">{stats.myProducts}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 rounded-xl p-6 border border-blue-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-600 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-gray-400 text-sm mb-1">My Orders</h3>
            <p className="text-3xl font-bold text-white">{stats.myOrders}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-600 rounded-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Total Views</h3>
            <p className="text-3xl font-bold text-white">{stats.totalViews}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 rounded-xl p-6 border border-yellow-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-600 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Total Sales</h3>
            <p className="text-3xl font-bold text-white">${stats.totalSales.toFixed(2)}</p>
          </div>
        </div>

        {/* Action Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Selling Section */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-green-600 rounded-lg mr-4">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Selling</h2>
                <p className="text-gray-400 text-sm">Manage your products and inventory</p>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/products/create"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition group"
              >
                <div className="flex items-center">
                  <PlusCircle className="w-5 h-5 mr-3" />
                  <span className="font-medium">Add New Product</span>
                </div>
                <span className="text-green-200 group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                href="/inventory"
                className="flex items-center justify-between p-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition group"
              >
                <div className="flex items-center">
                  <List className="w-5 h-5 mr-3" />
                  <span className="font-medium">My Inventory</span>
                </div>
                <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                href="/orders?view=seller"
                className="flex items-center justify-between p-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition group"
              >
                <div className="flex items-center">
                  <Package className="w-5 h-5 mr-3" />
                  <span className="font-medium">Sales Orders</span>
                </div>
                <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* Buying Section */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-600 rounded-lg mr-4">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Buying</h2>
                <p className="text-gray-400 text-sm">Browse and purchase fresh produce</p>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/products"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition group"
              >
                <div className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-3" />
                  <span className="font-medium">Browse Marketplace</span>
                </div>
                <span className="text-blue-200 group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                href="/orders?view=buyer"
                className="flex items-center justify-between p-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition group"
              >
                <div className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-3" />
                  <span className="font-medium">My Purchases</span>
                </div>
                <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                href="/products"
                className="flex items-center justify-between p-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition group"
              >
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-3" />
                  <span className="font-medium">Featured Products</span>
                </div>
                <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-700/50">
          <h3 className="text-lg font-bold text-white mb-3">Quick Tips</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Add high-quality images to your products to attract more buyers</li>
            <li>• Keep your inventory updated to avoid overselling</li>
            <li>• Respond quickly to buyer inquiries to build trust</li>
            <li>• Browse the marketplace regularly to find fresh deals</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
