import Link from "next/link";
import { ArrowRight, Mail, Sprout } from "lucide-react";

export default function Footer() {
  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .footer-link {
          position: relative;
          padding-bottom: 2px;
          transition: color 0.3s ease;
        }

        .footer-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #16a34a, #10b981);
          transition: width 0.3s ease;
        }

        .footer-link:hover::after {
          width: 100%;
        }

        .footer-link:hover {
          color: #10b981;
        }

        .social-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(22, 163, 74, 0.1);
          border: 1px solid rgba(22, 163, 74, 0.2);
          color: #94a3b8;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .social-icon:hover {
          background: linear-gradient(135deg, #16a34a, #10b981);
          border-color: #16a34a;
          color: white;
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(22, 163, 74, 0.3);
        }

        .newsletter-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(22, 163, 74, 0.2);
          color: white;
          transition: all 0.3s ease;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .newsletter-input::placeholder {
          color: rgba(148, 163, 184, 0.6);
        }

        .newsletter-input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(22, 163, 74, 0.4);
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
        }

        .newsletter-btn {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
          color: white;
          border: none;
          cursor: pointer;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .newsletter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(22, 163, 74, 0.4);
          background: linear-gradient(135deg, #15803d 0%, #166534 100%);
        }

        .footer-section-title {
          background: linear-gradient(135deg, #f0fdf4 0%, transparent 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-logo {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #16a34a 0%, #10b981 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
          margin-bottom: 12px;
        }

        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(22, 163, 74, 0.2), transparent);
        }

        .footer-column {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .footer-column:nth-child(1) { animation-delay: 0.1s; }
        .footer-column:nth-child(2) { animation-delay: 0.2s; }
        .footer-column:nth-child(3) { animation-delay: 0.3s; }
        .footer-column:nth-child(4) { animation-delay: 0.4s; }
        .footer-column:nth-child(5) { animation-delay: 0.5s; }

        .footer-bottom {
          animation: fadeInUp 0.6s ease-out 0.6s forwards;
          opacity: 0;
        }
      `}</style>

      <footer className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10">
          {/* Newsletter Section */}
          <div className="border-b border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                  <h3 className="text-2xl md:text-3xl font-black mb-3">
                    Stay Updated
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Get exclusive tips, market insights, and platform updates delivered to your inbox weekly.
                  </p>
                </div>

                <form className="flex flex-col sm:flex-row gap-3 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="newsletter-input flex-1"
                    required
                  />
                  <button type="submit" className="newsletter-btn group">
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Footer Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="grid md:grid-cols-5 gap-8 md:gap-12 mb-12">
              
              {/* Brand Column */}
              <div className="footer-column md:col-span-1">
                <Link href="/" className="inline-block group">
                  <div className="brand-logo group-hover:scale-110 transition-transform">
                    <Sprout className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-black mb-2">AgriNet</h3>
                  <p className="text-xs text-gray-500 font-medium">Direct Farm Trading</p>
                </Link>
                <p className="text-gray-400 text-sm leading-relaxed mt-6">
                  Connecting farmers directly with buyers for fair, transparent, and sustainable agricultural trade across Africa.
                </p>
              </div>

              {/* Platform Links */}
              <div className="footer-column">
                <h4 className="text-sm font-black uppercase tracking-widest text-green-400 mb-6">Platform</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/features" className="footer-link text-gray-400 text-sm">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="footer-link text-gray-400 text-sm">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="/how-it-works" className="footer-link text-gray-400 text-sm">
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link href="/security" className="footer-link text-gray-400 text-sm">
                      Security
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company Links */}
              <div className="footer-column">
                <h4 className="text-sm font-black uppercase tracking-widest text-green-400 mb-6">Company</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/about" className="footer-link text-gray-400 text-sm">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="footer-link text-gray-400 text-sm">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="footer-link text-gray-400 text-sm">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="footer-link text-gray-400 text-sm">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal Links */}
              <div className="footer-column">
                <h4 className="text-sm font-black uppercase tracking-widest text-green-400 mb-6">Legal</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/privacy" className="footer-link text-gray-400 text-sm">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="footer-link text-gray-400 text-sm">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookies" className="footer-link text-gray-400 text-sm">
                      Cookie Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/disclaimer" className="footer-link text-gray-400 text-sm">
                      Disclaimer
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-divider mb-8"></div>

            <div className="footer-bottom flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} AgriNet. Empowering agricultural trade across Africa.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label="Follow us on Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label="Follow us on Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label="Follow us on LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Subtle top border glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent"></div>
        </div>
      </footer>
    </>
  );
}