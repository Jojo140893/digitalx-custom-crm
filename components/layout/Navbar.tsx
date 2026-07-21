'use client';

import React, { useState } from 'react';
import { Search, Bell, Shield, User as UserIcon, Menu, Database, Check, ChevronDown, RefreshCw, Globe, DollarSign, Lock } from 'lucide-react';
import { User } from '@/lib/types';
import { isSupabaseConfigured, checkSupabaseHealth } from '@/lib/supabase';
import { toast } from '@/lib/toast';
import { crmStore } from '@/lib/store';

interface NavbarProps {
  currentUser: User;
  allUsers: User[];
  onSwitchUser: (user: User) => void;
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
  onOpenSearch,
  onOpenMobileMenu,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showTenantMenu, setShowTenantMenu] = useState(false);
  const [checkingSupabase, setCheckingSupabase] = useState(false);

  const isAdmin = currentUser.role === 'ADMIN';
  const currentCurrency = crmStore.getCurrency();
  const currentTenant = crmStore.getTenant();

  const handleCheckSupabase = async () => {
    setCheckingSupabase(true);
    const health = await checkSupabaseHealth();
    setCheckingSupabase(false);
    if (health.status === 'CONNECTED') {
      toast.success('Supabase Connected', health.message);
    } else {
      toast.info('Database Mode', health.message);
    }
  };

  const toggleCurrency = () => {
    const nextCurrency = currentCurrency === 'AUD' ? 'USD' : 'AUD';
    crmStore.setCurrency(nextCurrency);
  };

  const tenants = ['Sydney HQ (AU)', 'New York Office (US)', 'London Office (UK)'];

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between shadow-xs">
      {/* Left section: Mobile menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 text-slate-500 hover:text-slate-900 rounded-lg lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-500 hover:text-slate-800 transition-all max-w-md w-full text-xs font-medium"
        >
          <Search className="w-4 h-4 text-indigo-600" />
          <span className="flex-1 text-left">Search leads, clients, projects, invoices...</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-600 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right section: Tenant Switcher, Currency, Supabase Status, Role Switcher */}
      <div className="flex items-center gap-2.5">
        {/* Tenant/Region Switcher */}
        <div className="relative hidden xl:block">
          <button
            onClick={() => setShowTenantMenu(!showTenantMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{currentTenant}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showTenantMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-50">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <p className="text-[11px] font-bold text-slate-900">Organization Tenant</p>
                <p className="text-[10px] text-slate-500">Multi-region server node</p>
              </div>
              {tenants.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    crmStore.setTenant(t);
                    setShowTenantMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                    currentTenant === t ? 'bg-indigo-50 text-indigo-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{t}</span>
                  {currentTenant === t && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Currency Switcher Toggle */}
        <button
          onClick={toggleCurrency}
          title="Toggle display currency (AUD / USD)"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all"
        >
          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          <span>{currentCurrency}</span>
        </button>

        {/* SOC2 & Uptime Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-200 bg-slate-100 text-[10px] font-mono text-slate-600">
          <Lock className="w-3 h-3 text-indigo-600" />
          <span>SOC2 Type II • 99.99% SLA</span>
        </div>

        {/* Supabase Indicator Pill */}
        <button
          onClick={handleCheckSupabase}
          disabled={checkingSupabase}
          title="Click to check database health"
          className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 ${
            isSupabaseConfigured
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
          }`}
        >
          <Database className={`w-3.5 h-3.5 ${checkingSupabase ? 'animate-spin' : ''}`} />
          <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Supabase Ready'}</span>
        </button>

        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              isAdmin
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Role: {currentUser.role === 'ADMIN' ? 'Founder (Admin)' : 'Team Member'}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {/* Role switcher dropdown */}
          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">Switch Role & User Session</p>
                <p className="text-[11px] text-slate-500">Test RBAC financial masking in real-time</p>
              </div>

              <div className="py-1 space-y-1">
                {allUsers.map((u) => {
                  const isSelected = u.id === currentUser.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSwitchUser(u);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                        isSelected
                          ? 'bg-indigo-50 text-indigo-900 font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-300"
                        />
                        <div className="text-left">
                          <p className="font-semibold text-slate-900">{u.name}</p>
                          <p className="text-[10px] text-slate-500">{u.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                            u.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {u.role}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-indigo-300"
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
            <p className="text-[10px] text-slate-500">{currentUser.department}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

