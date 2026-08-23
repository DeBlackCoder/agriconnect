'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Clock, CheckCircle2, XCircle, Truck, DollarSign } from 'lucide-react';

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  deliveryAddress: string;
  items: any[];
  buyerId?: {
    fullName: string;
  };
  farmerId?: {
    fullName: string;
  };
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('');

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

      setUserRole(data.user.role);
      fetchOrders();
    } catch (error) {
      router.push('/auth/login');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      
      if (response.ok) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'CONFIRMED':
      case 'PROCESSING':
        return <Package className="w-5 h-5 text-blue-400" />;
      case 'SHIPPED':
        return <Truck className="w-5 h-5 text-purple-400" />;
      case 'DELIVERED':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Package className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-900/50 text-yellow-400';
      case 'CONFIRMED':
      case 'PROCESSING':
        return 'bg-blue-900/50 text-blue-400';
      case 'SHIPPED':
        return 'bg-purple-900/50 text-purple-400';
      case 'DELIVERED':
        return 'bg-green-900/50 text-green-400';
      case 'CANCELLED':
        return 'bg-red-900/50 text-red-400';
      default:
        return 'bg-gray-900/50 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">My Orders</h1>
              <p className="text-gray-400 text-sm">
                {userRole === 'FARMER' ? 'Orders from buyers' : 'Your purchase orders'}
              </p>
            </div>
            <Link
              href={userRole === 'FARMER' ? '/dashboard/farmer' : '/dashboard/buyer'}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-white text-xl">Loading orders...</div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
            <p className="text-gray-400 mb-6">
              {userRole === 'FARMER' 
                ? 'Orders from buyers will appear here'
                : 'Start shopping to place your first order'}
            </p>
            {userRole === 'BUYER' && (
              <Link
                href="/products"
                className="inline-block px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition"
              >
                Browse Products
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order._id}
                href={`/orders/${order._id}`}
                className="block bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    {getStatusIcon(order.status)}
                    <div className="ml-3">
                      <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Amount</p>
                    <p className="text-white font-bold text-lg">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Items</p>
                    <p className="text-white font-medium">{order.items?.length || 0} items</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">
                      {userRole === 'FARMER' ? 'Buyer' : 'Seller'}
                    </p>
                    <p className="text-white font-medium">
                      {userRole === 'FARMER' 
                        ? order.buyerId?.fullName || 'Unknown'
                        : order.farmerId?.fullName || 'Unknown'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <p className="text-gray-400 text-sm mb-1">Delivery Address</p>
                  <p className="text-gray-300">{order.deliveryAddress}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
