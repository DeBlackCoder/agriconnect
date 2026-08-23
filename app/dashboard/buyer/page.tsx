'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MarketplaceNav from '@/components/MarketplaceNav';
import { Package, ShoppingCart, Star, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export default function BuyerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
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

      if (data.user.role !== 'BUYER') {
        router.push('/');
        return;
      }

      setUser(data.user);
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.fullName}! 👋
          </h1>
          <p className="text-gray-400">Here's what's happening with your orders today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <ShoppingCart className="w-10 h-10 text-blue-400" />
              <span className="text-2xl font-bold text-white">0</span>
            </div>
            <h3 className="text-gray-400 text-sm">Total Orders</h3>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-10 h-10 text-yellow-400" />
              <span className="text-2xl font-bold text-white">0</span>
            </div>
            <h3 className="text-gray-400 text-sm">Pending Orders</h3>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
              <span className="text-2xl font-bold text-white">0</span>
            </div>
            <h3 className="text-gray-400 text-sm">Completed</h3>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-purple-400" />
              <span className="text-2xl font-bold text-white">$0</span>
            </div>
            <h3 className="text-gray-400 text-sm">Total Spent</h3>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/products"
            className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-6 hover:from-green-700 hover:to-emerald-700 transition group"
          >
            <Package className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Browse Products</h3>
            <p className="text-green-100">Discover fresh produce from local farmers</p>
          </Link>

          <Link
            href="/orders"
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition group"
          >
            <ShoppingCart className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">My Orders</h3>
            <p className="text-gray-400">Track and manage your purchases</p>
          </Link>

          <Link
            href="/profile"
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition group"
          >
            <Star className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">My Profile</h3>
            <p className="text-gray-400">Update your account information</p>
          </Link>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Recent Orders</h2>
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No orders yet</p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
