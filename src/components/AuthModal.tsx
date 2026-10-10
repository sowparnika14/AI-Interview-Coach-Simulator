import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Sparkles, ArrowRight } from 'lucide-react';
import { StorageService } from '../services/storage';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('Senior Frontend Engineer');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      const res = StorageService.login(email, password);
      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Invalid credentials');
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your full name');
        return;
      }
      const res = StorageService.register(name, email, password, targetRole);
      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Failed to create account');
      }
    }
  };

  const handleDemoLogin = () => {
    const res = StorageService.login('alex.rivera@example.com', 'password123');
    if (res.success && res.user) {
      onSuccess(res.user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10152B]/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#F0EDFF] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-b from-[#F0EDFF]/50 to-white border-b border-[#F0EDFF] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#7657F6] text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#10152B]">
                {isLogin ? 'Sign In to Your Account' : 'Create Your Account'}
              </h2>
              <p className="text-xs text-gray-500">
                Save mock interview history, scores & progress
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl">
              {error}
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7657F6]/20 focus:border-[#7657F6] transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7657F6]/20 focus:border-[#7657F6] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7657F6]/20 focus:border-[#7657F6] transition-all"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Target Position / Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7657F6]/20 focus:border-[#7657F6] transition-all"
              >
                <option value="Senior Frontend Engineer">Senior Frontend Engineer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Backend Engineer">Backend Engineer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Data Scientist / AI Engineer">Data Scientist / AI Engineer</option>
                <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-[#7657F6] hover:bg-[#6344E8] text-white text-sm font-semibold rounded-xl shadow-md shadow-[#7657F6]/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{isLogin ? 'Sign In to Dashboard' : 'Create Free Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo button */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="text-xs text-[#7657F6] hover:underline font-semibold cursor-pointer"
            >
              Or load sample demo candidate account (Alex Rivera)
            </button>
          </div>
        </form>

        {/* Footer Toggle */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500">
          {isLogin ? (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => { setIsLogin(false); setError(null); }}
                className="font-bold text-[#7657F6] hover:underline cursor-pointer ml-1"
              >
                Sign Up Free
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsLogin(true); setError(null); }}
                className="font-bold text-[#7657F6] hover:underline cursor-pointer ml-1"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
