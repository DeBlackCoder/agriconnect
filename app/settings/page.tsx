'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MarketplaceNav from '@/components/MarketplaceNav';
import CustomAlert from '@/components/CustomAlert';
import { User, Lock, Bell, MapPin, Save } from 'lucide-react';

interface UserData {
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
}

interface AlertState {
  show: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [alert, setAlert] = useState<AlertState>({ show: false, type: 'info', title: '' });

  const [formData, setFormData] = useState<UserData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    location: '',
  });

  const [originalFormData, setOriginalFormData] = useState<UserData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    location: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  // Track unsaved changes
  useEffect(() => {
    const hasChanges = 
      formData.fullName !== originalFormData.fullName ||
      formData.phoneNumber !== originalFormData.phoneNumber ||
      formData.location !== originalFormData.location;
    
    setHasUnsavedChanges(hasChanges);
  }, [formData, originalFormData]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (!response.ok || !data.user) {
        router.push('/auth/login');
        return;
      }

      const userData = {
        fullName: data.user.fullName || '',
        email: data.user.email || '',
        phoneNumber: data.user.phoneNumber || '',
        location: data.user.location || '',
      };

      setFormData(userData);
      setOriginalFormData(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async () => {
    // Validate input
    if (!formData.fullName.trim()) {
      setAlert({
        show: true,
        type: 'error',
        title: 'Validation Error',
        message: 'Full name is required.',
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          location: formData.location,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setAlert({
        show: true,
        type: 'success',
        title: 'Profile Updated!',
        message: 'Your profile has been updated successfully.',
      });

      // Update local state with new data
      if (data.user) {
        const updatedData = {
          fullName: data.user.fullName || '',
          email: data.user.email || '',
          phoneNumber: data.user.phoneNumber || '',
          location: data.user.location || '',
        };
        setFormData(updatedData);
        setOriginalFormData(updatedData);
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setAlert({
        show: true,
        type: 'error',
        title: 'Update Failed',
        message: error instanceof Error ? error.message : 'Failed to update profile. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlert({
        show: true,
        type: 'error',
        title: 'Password Mismatch',
        message: 'New password and confirm password do not match.',
      });
      return;
    }

    // Validate password length
    if (passwordData.newPassword.length < 8) {
      setAlert({
        show: true,
        type: 'error',
        title: 'Weak Password',
        message: 'Password must be at least 8 characters long.',
      });
      return;
    }

    // Validate current password is provided
    if (!passwordData.currentPassword) {
      setAlert({
        show: true,
        type: 'error',
        title: 'Missing Information',
        message: 'Please enter your current password.',
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/users/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      // Clear form on success
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      setAlert({
        show: true,
        type: 'success',
        title: 'Password Changed!',
        message: 'Your password has been changed successfully.',
      });
    } catch (error) {
      console.error('Password change error:', error);
      setAlert({
        show: true,
        type: 'error',
        title: 'Change Failed',
        message: error instanceof Error ? error.message : 'Failed to change password. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-32">
        <MarketplaceNav />
        <div className="flex items-center justify-center py-20">
          <div className="text-white text-xl">Loading settings...</div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

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

      <MarketplaceNav />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Enter your full name"
                        required
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-400 rounded-lg cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-gray-400 mt-1">Used for order notifications and WhatsApp contact</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="Enter your city or region"
                          className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleProfileSave}
                      disabled={saving || !hasUnsavedChanges}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          {hasUnsavedChanges ? 'Save Changes' : 'No Changes'}
                        </>
                      )}
                    </button>
                    {hasUnsavedChanges && (
                      <p className="text-xs text-yellow-400 text-center mt-2">
                        ⚠️ You have unsaved changes
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Password *
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        required
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        New Password *
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        placeholder="Enter new password"
                        required
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm New Password *
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        placeholder="Confirm new password"
                        required
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                      {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                        <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                      )}
                      {passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword && (
                        <p className="text-xs text-green-400 mt-1">Passwords match ✓</p>
                      )}
                    </div>

                    <button
                      onClick={handlePasswordChange}
                      disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Changing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                      <div>
                        <p className="font-medium text-white">Order Updates</p>
                        <p className="text-sm text-gray-400">Get notified about order status changes</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-emerald-600" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                      <div>
                        <p className="font-medium text-white">New Products</p>
                        <p className="text-sm text-gray-400">Alert when new products are listed</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-emerald-600" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                      <div>
                        <p className="font-medium text-white">Price Drops</p>
                        <p className="text-sm text-gray-400">Notify when prices drop on saved items</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5 rounded text-emerald-600" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                      <div>
                        <p className="font-medium text-white">Marketing Emails</p>
                        <p className="text-sm text-gray-400">Receive promotions and newsletters</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5 rounded text-emerald-600" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
