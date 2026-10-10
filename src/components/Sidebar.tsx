import React from 'react';
import {
  LayoutDashboard,
  Video,
  FileText,
  TrendingUp,
  History,
  Bot,
  Settings,
  LogOut,
  Sparkles,
  Flame,
  ChevronRight
} from 'lucide-react';
import { AppView, User } from '../types';

interface SidebarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentUser: User | null;
  onOpenSetup: () => void;
  onLogout: () => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  currentUser,
  onOpenSetup,
  onLogout,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const navItems = [
    { id: 'dashboard' as AppView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'start-interview', label: 'Start Interview', icon: Video, isAction: true },
    { id: 'resume' as AppView, label: 'My Resume', icon: FileText },
    { id: 'performance' as AppView, label: 'Performance', icon: TrendingUp },
    { id: 'history' as AppView, label: 'Interview History', icon: History },
    { id: 'ai-coach' as AppView, label: 'Ask AI Coach', icon: Bot },
    { id: 'settings' as AppView, label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.isAction) {
      onOpenSetup();
    } else {
      setCurrentView(item.id as AppView);
    }
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#F0EDFF] flex flex-col justify-between transition-transform duration-200 ease-in-out
        lg:static lg:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo & Header */}
          <div className="p-6 border-b border-[#F0EDFF]">
            <button
              onClick={() => setCurrentView('landing')}
              className="flex items-center gap-3 text-left w-full group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7657F6] to-[#9B82FC] flex items-center justify-center text-white shadow-md shadow-[#7657F6]/25">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base text-[#10152B] tracking-tight block">
                  AI Interview
                </span>
                <span className="text-[11px] text-gray-500 font-medium block">
                  Candidate Hub
                </span>
              </div>
            </button>
          </div>

          {/* User Streak Banner */}
          {currentUser && (
            <div className="mx-4 mt-4 p-3 rounded-xl bg-[#F0EDFF] flex items-center justify-between border border-[#7657F6]/15">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#7657F6] flex items-center justify-center text-white shadow-xs">
                  <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#10152B]">{currentUser.streakDays} Day Streak</p>
                  <p className="text-[10px] text-gray-500">Practice daily to grow</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const isStartAction = item.isAction;

              if (isStartAction) {
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#7657F6] hover:bg-[#6344E8] shadow-sm shadow-[#7657F6]/20 transition-all cursor-pointer group my-2 active:scale-98"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-white" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-75 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                );
              }

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#F0EDFF] text-[#7657F6] font-semibold'
                      : 'text-gray-600 hover:text-[#10152B] hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#7657F6]' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-[#F0EDFF] bg-gray-50/50">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div 
                  onClick={() => setCurrentView('settings')}
                  className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                >
                  <div className="w-9 h-9 rounded-full bg-[#7657F6]/15 text-[#7657F6] font-bold text-xs flex items-center justify-center shrink-0 border border-[#7657F6]/20">
                    {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#10152B] truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{currentUser.targetRole}</p>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick(navItems[0])}
                className="w-full py-2 text-xs font-semibold text-center text-[#7657F6] bg-[#F0EDFF] rounded-lg"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
