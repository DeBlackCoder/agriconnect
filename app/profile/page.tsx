'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MarketplaceNav from '@/components/MarketplaceNav';
import { User, Mail, Phone, MapPin, Calendar, Package, ShoppingBag, Edit } from 'lucide-react';

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  createdAt: string;
}

interface Stats {
  productsListed: number;
  ordersPlaced: number;
  ordersReceived: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<Stats>({ productsListed: 0, ordersPlaced: 0, ordersReceived: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (!response.ok || !data.user) {
        router.push('/auth/login');
        return;
      }

      setUser(data.user);
      
      // Fetch user stats
      // TODO: Implement stats API
      setStats({
        productsListed: 0,
        ordersPlaced: 0,
        ordersReceived: 0,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-32">
        <MarketplaceNav />
        <div className="flex items-center justify-center py-20">
          <div className="text-white text-xl">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-32">
      <MarketplaceNav />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700 mb-8">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-4xl font-bold shadow-2xl border-4 border-gray-900">
                {getInitials(user.fullName)}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{user.fullName}</h1>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-600 text-white text-sm font-semibold rounded-full">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/settings"
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2 font-semibold"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Link>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail className="w-5 h-5 text-emerald-400" />
                    <span>{user.email}</span>
                  </div>
                  {user.phoneNumber && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <Phone className="w-5 h-5 text-emerald-400" />
                      <span>{user.phoneNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Products Listed */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-emerald-600 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-3xl font-bold text-white">{stats.productsListed}</span>
            </div>
            <h3 className="text-gray-400 font-medium">Products Listed</h3>
            <Link
              href="/inventory"
              className="text-emerald-400 text-sm hover:text-emerald-300 mt-2 inline-block"
            >
              View all →
            </Link>
          </div>

          {/* Orders Placed */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-600 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-3xl font-bold text-white">{stats.ordersPlaced}</span>
            </div>
            <h3 className="text-gray-400 font-medium">Orders Placed</h3>
            <Link
              href="/orders"
              className="text-blue-400 text-sm hover:text-blue-300 mt-2 inline-block"
            >
              View orders →
            </Link>
          </div>

          {/* Orders Received */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-600 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-3xl font-bold text-white">{stats.ordersReceived}</span>
            </div>
            <h3 className="text-gray-400 font-medium">Orders Received</h3>
            <Link
              href="/orders?type=received"
              className="text-purple-400 text-sm hover:text-purple-300 mt-2 inline-block"
            >
              View sales →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/products/create"
              className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg transition-all text-center font-semibold shadow-lg"
            >
              + Add Product
            </Link>
            <Link
              href="/inventory"
              className="p-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-center font-semibold"
            >
              My Products
            </Link>
            <Link
              href="/orders"
              className="p-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-center font-semibold"
            >
              My Orders
            </Link>
            <Link
              href="/settings"
              className="p-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-center font-semibold"
            >
              Settings
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
