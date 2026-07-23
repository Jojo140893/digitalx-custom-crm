'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Shield,
  Menu,
  Database,
  Check,
  ChevronDown,
  Globe,
  DollarSign,
  Lock,
  Bell,
  Settings,
  Command,
} from 'lucide-react';
import { User } from '@/lib/types';
import { isSupabaseConfigured } from '@/lib/supabase';
import { crmStore } from '@/lib/store';

interface NavbarProps {
  currentUser: User;
  allUsers: User[];
  onSwitchUser: (user: User) => void;
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
  onOpenSupabaseConfig: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
  onOpenSearch,
  onOpenMobileMenu,
  onOpenSupabaseConfig,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isAdmin = currentUser.role === 'ADMIN';
  const currentCurrency = crmStore.getCurrency();

  const toggleCurrency = () => {
    const next = currentCurrency === 'AUD' ? 'USD' : 'AUD';
    crmStore.setCurrency(next);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-[60px] bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between">
      {/* ─── Left: Mobile menu + Search trigger ─── */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Trigger — compact pill */}
        <button
          onClick={onOpenSearch}
          className="group flex items-center gap-3 h-10 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-400 hover:text-slate-600 transition-all cursor-pointer w-72 lg:w-80 xl:w-96 min-w-0"
          aria-label="Open global search"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/80 bg-white text-slate-500 group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shrink-0">
            <Search className="w-4 h-4" strokeWidth={2.25} />
          </span>
          <span className="min-w-0 flex-1 text-[13px] font-semibold text-slate-600 group-hover:text-slate-800 truncate whitespace-nowrap">
            Search leads, clients, projects, invoices...
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 shrink-0 ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-400 shadow-xs">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </button>
      </div>

      {/* ─── Right: Action buttons + Profile ─── */}
      <div className="flex items-center gap-1">
        {/* Currency toggle */}
        <button
          onClick={toggleCurrency}
          title={`Currency: ${currentCurrency}`}
          className="hidden sm:flex items-center gap-1 h-8 px-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold transition-colors"
        >
          <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
          <span>{currentCurrency}</span>
        </button>

        {/* Security & Compliance badge */}
        <div className="hidden xl:flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-200/60">
          <Lock className="w-3 h-3 text-indigo-500" />
          <span>SOC 2 Audit in Progress</span>
          <span className="w-1 h-1 rounded-full bg-indigo-400" />
          <span>Enterprise Security</span>
        </div>

        {/* Supabase / Cloud Sync */}
        <button
          onClick={onOpenSupabaseConfig}
          title="Cloud Sync Settings"
          className={`hidden md:flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium transition-colors ${
            isSupabaseConfigured
              ? 'text-emerald-600 hover:bg-emerald-50'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">{isSupabaseConfigured ? 'Connected' : 'Cloud Sync'}</span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 mx-1.5 hidden sm:block" />

        {/* Notifications (placeholder) */}
        <button
          title="Notifications"
          className="relative flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 mx-1.5 hidden sm:block" />

        {/* User Profile + Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 h-9 pl-2 pr-2.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
            <div className="hidden md:block text-left leading-tight">
              <p className="text-[13px] font-semibold text-slate-800">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 font-medium">
                {isAdmin ? 'Admin' : 'Member'} · {currentUser.department}
              </p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* User / Role Switcher Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Current user header */}
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser.department} · {currentUser.role}</p>
                  </div>
                </div>
              </div>

              {/* Switch accounts */}
              <div className="p-1.5">
                <p className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch account</p>
                {allUsers.map((u) => {
                  const isSelected = u.id === currentUser.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSwitchUser(u);
                        setShowUserMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors ${
                        isSelected
                          ? 'bg-indigo-50'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13px] truncate ${isSelected ? 'font-semibold text-indigo-700' : 'font-medium text-slate-700'}`}>
                          {u.name}
                        </p>
                        <p className="text-[10px] text-slate-400">{u.department}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wide ${
                            u.role === 'ADMIN'
                              ? 'bg-indigo-100 text-indigo-600'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {u.role}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer hint */}
              <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/60">
                <p className="text-[10px] text-slate-400 text-center">
                  Switch roles to test RBAC &amp; financial masking
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
