'use client';

import { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface CustomAlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  onClose: () => void;
  duration?: number;
}

export default function CustomAlert({ 
  type, 
  title, 
  message, 
  onClose, 
  duration = 5000 
}: CustomAlertProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle2,
      bgColor: 'bg-emerald-500',
      borderColor: 'border-emerald-600',
      iconColor: 'text-emerald-600',
      bgGradient: 'from-emerald-50 to-green-50',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-500',
      borderColor: 'border-red-600',
      iconColor: 'text-red-600',
      bgGradient: 'from-red-50 to-pink-50',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-amber-500',
      borderColor: 'border-amber-600',
      iconColor: 'text-amber-600',
      bgGradient: 'from-amber-50 to-yellow-50',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-500',
      borderColor: 'border-blue-600',
      iconColor: 'text-blue-600',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
  };

  const Icon = config[type].icon;

  return (
    <div className="fixed top-24 right-4 z-[100] animate-in slide-in-from-right duration-300">
      <div className={`max-w-md bg-gradient-to-br ${config[type].bgGradient} backdrop-blur-md rounded-2xl shadow-2xl border-2 ${config[type].borderColor} overflow-hidden`}>
        <div className="p-4 flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md`}>
            <Icon className={`w-6 h-6 ${config[type].iconColor}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-gray-900 font-bold text-base mb-1">
              {title}
            </h4>
            {message && (
              <p className="text-gray-700 text-sm leading-relaxed">
                {message}
              </p>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-white/50"
            aria-label="Close notification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {duration > 0 && (
          <div className="h-1 bg-white/30 overflow-hidden">
            <div 
              className={`h-full ${config[type].bgColor} animate-progress`}
              style={{ 
                animation: `progress ${duration}ms linear forwards`,
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        .animate-progress {
          animation: progress ${duration}ms linear forwards;
        }
      `}</style>
    </div>
  );
}
