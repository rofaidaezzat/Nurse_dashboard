import React, { useState } from 'react';
import logoImage from '../assets/photo_2026-06-17_08-23-26.jpg';
import { LayoutDashboard, Users, UserCheck, Stethoscope, LogOut, Menu, X, LucideIcon } from 'lucide-react';
import { User } from '../types';

interface DashboardLayoutProps {
  user: User | null;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export default function DashboardLayout({ user, currentPage, setCurrentPage, onLogout, children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'registered_nurse', label: 'Registered Nurse', icon: Users },
    { id: 'assistant_nurse', label: 'Assistant Nurse', icon: UserCheck },
    { id: 'general_dr', label: 'General Dr', icon: Stethoscope },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 lg:hidden focus:outline-none transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <div className="flex items-center gap-2.5">
            <img src={logoImage} alt="Clinic Logo" className="w-7 h-7 object-contain rounded-lg" />
            <span className="font-bold text-lg text-gray-900 tracking-tight">Staff Dashboard</span>
          </div>
        </div>

        {/* User profile & Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold text-gray-800">{user?.name || 'Admin'}</span>
            <span className="text-xs text-gray-500">{user?.email || 'admin@clinic.com'}</span>
          </div>
          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all active:scale-[0.98]"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <div className="flex-grow flex relative">
        
        {/* Desktop Sidebar (Left side) */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 flex-shrink-0 min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sky-50 text-sky-600 shadow-sm border-l-4 border-sky-500 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-sky-500' : 'text-gray-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Navigation Drawer Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* Mobile Navigation Drawer */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:hidden pt-16 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="p-4 space-y-1 mt-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sky-50 text-sky-600 shadow-sm border-l-4 border-sky-500 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-sky-500' : 'text-gray-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Pane */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
        
      </div>
    </div>
  );
}
