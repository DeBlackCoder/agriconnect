'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Plus, X, Apple, Carrot, Wheat, Milk, Leaf, Beef, Sprout, Droplet } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  description: string;
  icon: string;
}

interface ImageFile {
  file: File | null;
  preview: string;
}

// Icon mapping
const iconMap: { [key: string]: any } = {
  Apple,
  Carrot,
  Wheat,
  Milk,
  Leaf,
  Beef,
  Sprout,
  Droplet,
};

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([{ file: null, preview: '' }]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    unit: 'kg',
    pricePerUnit: '',
    availableStock: '',
    minimumOrder: '1',
    harvestDate: '',
    location: '',
    isOrganic: false,
  });

  useEffect(() => {
    checkAuth();
    fetchCategories();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (!response.ok || !data.user) {
        router.push('/auth/login');
      }
    } catch (error) {
      router.push('/auth/login');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      console.log('Categories response:', data);
      
      if (response.ok && data.categories) {
        setCategories(data.categories);
        // Set first category as default if available
        if (data.categories.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: data.categories[0]._id }));
        }
      } else {
        console.error('Failed to fetch categories:', data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newImageFiles = [...imageFiles];
        newImageFiles[index] = {
          file,
          preview: reader.result as string,
        };
        setImageFiles(newImageFiles);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const addImageField = () => {
    if (imageFiles.length < 5) {
      setImageFiles([...imageFiles, { file: null, preview: '' }]);
    }
  };

  const removeImageField = (index: number) => {
    if (imageFiles.length > 1) {
      const newImageFiles = imageFiles.filter((_, i) => i !== index);
      setImageFiles(newImageFiles);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Get base64 images from uploaded files
      const images = imageFiles
        .filter(img => img.preview)
        .map(img => img.preview);
      
      if (images.length === 0) {
        setError('Please add at least one product image');
        setLoading(false);
        return;
      }

      if (!formData.categoryId) {
        setError('Please select a category');
        setLoading(false);
        return;
      }

      const submitData = {
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        images,
        unit: formData.unit,
        pricePerUnit: parseFloat(formData.pricePerUnit),
        availableStock: parseFloat(formData.availableStock),
        minimumOrder: parseFloat(formData.minimumOrder),
        harvestDate: formData.harvestDate || undefined,
        location: formData.location,
        isOrganic: formData.isOrganic,
      };

      console.log('Submitting product:', submitData);

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to create product');
      }

      // Redirect to product detail page
      router.push(`/products/${data.product._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-32">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl rounded-full shadow-2xl">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <Link href="/dashboard" className="inline-flex items-center text-white hover:text-emerald-300 transition font-semibold">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Add New Product</h1>
          <p className="text-gray-400">List your fresh produce for buyers to discover</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          {/* Product Name */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-300 font-medium mb-2">
              Product Name *
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
              placeholder="e.g., Fresh Organic Tomatoes"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-300 font-medium mb-2">
              Description *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
              placeholder="Describe your product in detail..."
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label htmlFor="categoryId" className="block text-gray-300 font-medium mb-2">
              Category *
            </label>
            <select
              id="categoryId"
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((category) => {
                const IconComponent = iconMap[category.icon];
                return (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                );
              })}
            </select>
            {formData.categoryId && categories.length > 0 && (
              <div className="mt-2 flex items-center text-gray-400 text-sm">
                {(() => {
                  const selectedCategory = categories.find(c => c._id === formData.categoryId);
                  if (selectedCategory) {
                    const IconComponent = iconMap[selectedCategory.icon];
                    return (
                      <>
                        {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
                        <span>{selectedCategory.description}</span>
                      </>
                    );
                  }
                  return null;
                })()}
              </div>
            )}
          </div>

          {/* Images */}
          <div className="mb-6">
            <label className="block text-gray-300 font-medium mb-2">
              Product Images * (Max 5 images, 5MB each)
            </label>
            <div className="space-y-3">
              {imageFiles.map((imageFile, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(index, e)}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-600 file:text-white file:cursor-pointer hover:file:bg-green-700"
                      />
                    </div>
                    {imageFile.preview && (
                      <div className="mt-2 relative h-24 w-24 rounded-lg overflow-hidden border-2 border-green-500">
                        <img
                          src={imageFile.preview}
                          alt={`Preview ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  {imageFiles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {imageFiles.length < 5 && (
              <button
                type="button"
                onClick={addImageField}
                className="mt-3 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Image
              </button>
            )}
            <p className="text-gray-500 text-sm mt-2">
              Upload high-quality images of your product from different angles
            </p>
          </div>

          {/* Price and Stock Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Unit */}
            <div>
              <label htmlFor="unit" className="block text-gray-300 font-medium mb-2">
                Unit *
              </label>
              <select
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="g">Gram (g)</option>
                <option value="lb">Pound (lb)</option>
                <option value="piece">Piece</option>
                <option value="dozen">Dozen</option>
                <option value="bunch">Bunch</option>
                <option value="bag">Bag</option>
                <option value="crate">Crate</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label htmlFor="pricePerUnit" className="block text-gray-300 font-medium mb-2">
                Price per Unit ($) *
              </label>
              <input
                id="pricePerUnit"
                type="number"
                step="0.01"
                required
                value={formData.pricePerUnit}
                onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
                placeholder="0.00"
              />
            </div>

            {/* Available Stock */}
            <div>
              <label htmlFor="availableStock" className="block text-gray-300 font-medium mb-2">
                Available Stock *
              </label>
              <input
                id="availableStock"
                type="number"
                step="0.1"
                required
                value={formData.availableStock}
                onChange={(e) => setFormData({ ...formData, availableStock: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
                placeholder="100"
              />
            </div>

            {/* Minimum Order */}
            <div>
              <label htmlFor="minimumOrder" className="block text-gray-300 font-medium mb-2">
                Minimum Order *
              </label>
              <input
                id="minimumOrder"
                type="number"
                step="0.1"
                required
                value={formData.minimumOrder}
                onChange={(e) => setFormData({ ...formData, minimumOrder: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
                placeholder="1"
              />
            </div>
          </div>

          {/* Location and Harvest Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-gray-300 font-medium mb-2">
                Location *
              </label>
              <input
                id="location"
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
                placeholder="City, State"
              />
            </div>

            {/* Harvest Date */}
            <div>
              <label htmlFor="harvestDate" className="block text-gray-300 font-medium mb-2">
                Harvest Date (Optional)
              </label>
              <input
                id="harvestDate"
                type="date"
                value={formData.harvestDate}
                onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Organic Checkbox */}
          <div className="mb-6">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.isOrganic}
                onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
                className="w-5 h-5 rounded border-gray-600 bg-gray-900 text-green-600 focus:ring-green-500"
              />
              <span className="text-gray-300">This product is organically grown</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Product...' : 'Create Product'}
          </button>
        </form>
      </main>
    </div>
  );
}
