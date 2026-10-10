import React, { useState } from 'react';
import { Sparkles, Menu, X, ArrowRight, User as UserIcon } from 'lucide-react';
import { User, AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenSetup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  currentUser,
  onOpenAuth,
  onOpenSetup,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F0EDFF] text-[#10152B] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button 
          onClick={() => setCurrentView('landing')} 
          className="flex items-center gap-2.5 group cursor-pointer text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7657F6] to-[#9B82FC] flex items-center justify-center text-white shadow-md shadow-[#7657F6]/25 transition-transform group-hover:scale-105">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight font-heading block leading-tight text-[#10152B]">
              AI Interview
            </span>
            <span className="text-[11px] block font-medium text-gray-500">
              Coach & Simulator
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => setCurrentView('landing')}
            className={`text-sm font-medium transition-colors hover:text-[#7657F6] cursor-pointer ${
              currentView === 'landing' ? 'text-[#7657F6] font-semibold' : 'text-gray-600'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              if (currentView !== 'landing') setCurrentView('landing');
              setTimeout(() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="text-sm font-medium transition-colors text-gray-600 hover:text-[#7657F6] cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => {
              if (currentView !== 'landing') setCurrentView('landing');
              setTimeout(() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="text-sm font-medium transition-colors text-gray-600 hover:text-[#7657F6] cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`text-sm font-medium transition-colors hover:text-[#7657F6] cursor-pointer ${
              currentView === 'dashboard' ? 'text-[#7657F6] font-semibold' : 'text-gray-600'
            }`}
          >
            Dashboard
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer bg-[#F0EDFF] hover:bg-[#E5DFFF] text-[#7657F6]"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>{currentUser.name}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer text-gray-700 hover:text-[#7657F6]"
            >
              Sign In
            </button>
          )}

          <button
            onClick={onOpenSetup}
            className="flex items-center gap-2 px-4 py-2 bg-[#7657F6] hover:bg-[#6344E8] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-[#7657F6]/25 transition-all cursor-pointer active:scale-95"
          >
            <span>Start Interview</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-100"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 border-b border-[#F0EDFF] space-y-3 bg-white text-[#10152B]">
          <button
            onClick={() => { setCurrentView('landing'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-medium text-sm"
          >
            Home
          </button>
          <button
            onClick={() => { setCurrentView('dashboard'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-medium text-sm"
          >
            Dashboard
          </button>
          <button
            onClick={() => { setCurrentView('resume'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-medium text-sm"
          >
            My Resume
          </button>
          <button
            onClick={() => { setCurrentView('history'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-medium text-sm"
          >
            Interview History
          </button>

          <div className="pt-3 border-t border-gray-200/40 flex flex-col gap-2">
            {currentUser ? (
              <button
                onClick={() => { setCurrentView('dashboard'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 text-center text-sm font-semibold bg-[#F0EDFF] text-[#7657F6] rounded-xl"
              >
                Dashboard ({currentUser.name})
              </button>
            ) : (
              <button
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 text-center text-sm font-semibold border rounded-xl"
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => { onOpenSetup(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 text-center text-sm font-semibold bg-[#7657F6] text-white rounded-xl shadow-md"
            >
              Start Interview
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
