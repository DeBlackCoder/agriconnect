'use client';

import { useEffect, useState, useRef } from 'react';
import Link from "next/link";
import Image from "next/image";
import { LogOut, ChevronDown, Settings, BarChart3, Menu, X } from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (response.ok && data.user) {
        setUser(data.user);
      }
    } catch (error) {
      // User not logged in
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setMobileMenuOpen(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      <div className="bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-2xl px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 transform group-hover:scale-110 transition-transform duration-300">
              <Image
                src="/images/logo.png"
                alt="AgriNet Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-xl font-bold text-white drop-shadow-lg">
              AgriNet
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href="/products"
                  className="px-4 py-2 text-sm font-semibold text-white hover:text-emerald-300 transition rounded-full hover:bg-white/10"
                >
                  Marketplace
                </Link>

                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-semibold text-white hover:text-emerald-300 transition rounded-full hover:bg-white/10"
                >
                  Dashboard
                </Link>

                <Link
                  href="/products/create"
                  className="px-4 py-2 text-sm font-semibold text-white hover:text-emerald-300 transition rounded-full hover:bg-white/10"
                >
                  Sell Product
                </Link>

                {/* User Profile Dropdown */}
                <div className="relative ml-2" ref={userDropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all group"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-semibold shadow-lg">
                      {getInitials(user.fullName)}
                    </div>
                    <span className="hidden lg:block text-sm font-semibold text-white">
                      {user.fullName}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-white/80 transition-transform duration-300 ${
                        userDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-200/50">
                        <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                        <p className="text-xs text-gray-600 mt-1">{user.email}</p>
                        <span className="inline-block mt-2 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>

                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100/50 transition-colors text-sm"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <BarChart3 className="w-4 h-4 text-gray-500" />
                        Dashboard
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100/50 transition-colors text-sm"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4 text-gray-500" />
                        Settings
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-sm border-t border-gray-200/50"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 sm:px-5 py-2 text-sm font-semibold text-white hover:text-emerald-300 transition rounded-full hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 sm:px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-full hover:from-green-700 hover:to-emerald-700 transition shadow-lg hover:shadow-xl transform hover:scale-105 duration-300"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-2 bg-white/95 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 space-y-2">
            {user ? (
              <>
                <div className="py-3 px-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl mb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold shadow-lg">
                      {getInitials(user.fullName)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/products"
                  className="block px-4 py-3 rounded-full text-gray-700 hover:bg-gray-100/50 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Marketplace
                </Link>

                <Link
                  href="/dashboard"
                  className="block px-4 py-3 rounded-full text-gray-700 hover:bg-gray-100/50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>

                <Link
                  href="/products/create"
                  className="block px-4 py-3 rounded-full text-gray-700 hover:bg-gray-100/50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sell Product
                </Link>

                <Link
                  href="/settings"
                  className="block px-4 py-3 rounded-full text-gray-700 hover:bg-gray-100/50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-full text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block px-4 py-3 rounded-full text-gray-700 hover:bg-gray-100/50 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full hover:from-green-700 hover:to-emerald-700 transition-all font-medium text-center shadow-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
