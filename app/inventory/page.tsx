'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MarketplaceNav from '@/components/MarketplaceNav';
import CustomAlert from '@/components/CustomAlert';
import ConfirmModal from '@/components/ConfirmModal';
import { Package, Edit, Trash2, Plus, Eye, TrendingUp, DollarSign } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  pricePerUnit: number;
  unit: string;
  availableStock: number;
  minimumOrder: number;
  isActive: boolean;
  views: number;
  images: string[];
}

interface AlertState {
  show: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

export default function InventoryPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertState>({ show: false, type: 'info', title: '' });
  const [deleteModal, setDeleteModal] = useState({ show: false, productId: '', productName: '' });
  const [deleting, setDeleting] = useState(false);

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
      // Fetch all products, then filter by current user
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (response.ok) {
        // TODO: Filter by current user's products
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setAlert({
        show: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to load products',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setDeleteModal({
      show: true,
      productId: product._id,
      productName: product.name,
    });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/products/${deleteModal.productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p._id !== deleteModal.productId));
        setAlert({
          show: true,
          type: 'success',
          title: 'Product Deleted!',
          message: `${deleteModal.productName} has been removed from your inventory.`,
        });
        setDeleteModal({ show: false, productId: '', productName: '' });
      } else {
        setAlert({
          show: true,
          type: 'error',
          title: 'Delete Failed',
          message: 'Failed to delete product. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setAlert({
        show: true,
        type: 'error',
        title: 'Error',
        message: 'An error occurred while deleting the product.',
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-32">
      {alert.show && (
        <CustomAlert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert({ ...alert, show: false })}
        />
      )}

      <ConfirmModal
        isOpen={deleteModal.show}
        type="danger"
        title="Delete Product?"
        message={`Are you sure you want to delete "${deleteModal.productName}"? This action cannot be undone and will remove the product from the marketplace.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ show: false, productId: '', productName: '' })}
        loading={deleting}
      />

      <MarketplaceNav />

      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Products</h1>
              <p className="text-gray-400">Manage your product inventory and pricing</p>
            </div>
            <Link
              href="/products/create"
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2 font-semibold shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add New Product
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-white text-xl">Loading inventory...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No products yet</h3>
            <p className="text-gray-400 mb-6">Start adding products to your inventory</p>
            <Link
              href="/products/create"
              className="inline-block px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition"
            >
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Min Order</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Views</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-750">
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{product.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-green-400 font-medium">
                          ${product.pricePerUnit}
                          <span className="text-gray-400 text-sm">/{product.unit}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className={`text-white ${product.availableStock < 10 ? 'font-bold' : ''}`}>
                            {product.availableStock} {product.unit}
                          </span>
                          {product.availableStock < 10 && (
                            <AlertCircle className="w-4 h-4 text-yellow-400 ml-2" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {product.minimumOrder} {product.unit}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {product.views}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          product.isActive
                            ? 'bg-green-900/50 text-green-400'
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/products/${product._id}`}
                            className="p-2 text-blue-400 hover:bg-gray-700 rounded-lg transition"
                            title="View"
                          >
                            <Package className="w-5 h-5" />
                          </Link>
                          <Link
                            href={`/products/${product._id}/edit`}
                            className="p-2 text-yellow-400 hover:bg-gray-700 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(product)}
                            className="p-2 text-red-400 hover:bg-gray-700 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Low Stock Warning */}
        {products.filter(p => p.availableStock < 10).length > 0 && (
          <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg flex items-start">
            <AlertCircle className="w-6 h-6 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-yellow-400 font-medium mb-1">Low Stock Alert</h3>
              <p className="text-gray-300 text-sm">
                {products.filter(p => p.availableStock < 10).length} product(s) running low on stock. Consider restocking soon.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
