'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Search,
  X,
  UserPlus,
  Users,
  Briefcase,
  DollarSign,
  ArrowRight,
  UserCheck,
  Command,
  CornerDownLeft,
  Hash,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { Lead, Client, Project, Invoice, User } from '@/lib/types';
import { ModuleKey } from '../layout/Sidebar';
import { parseNaturalLanguageQuery } from '@/lib/ai-engine';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  leads: Lead[];
  clients: Client[];
  projects: Project[];
  invoices: Invoice[];
  users: User[];
  onSelectModule: (module: ModuleKey) => void;
}

interface SearchResult {
  id: string;
  type: 'lead' | 'client' | 'project' | 'invoice' | 'user';
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  module: ModuleKey;
  icon: React.ReactNode;
}

const TYPE_META: Record<string, { label: string; color: string }> = {
  lead: { label: 'Lead', color: 'text-indigo-500 bg-indigo-50' },
  client: { label: 'Client', color: 'text-emerald-600 bg-emerald-50' },
  project: { label: 'Project', color: 'text-purple-600 bg-purple-50' },
  invoice: { label: 'Invoice', color: 'text-amber-600 bg-amber-50' },
  user: { label: 'Team', color: 'text-blue-600 bg-blue-50' },
};

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onOpen,
  leads,
  clients,
  projects,
  invoices,
  users,
  onSelectModule,
}) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // ⌘K toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onOpen();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build search results
  const results: SearchResult[] = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const out: SearchResult[] = [];

    leads.forEach((l) => {
      if ([l.name, l.company, l.vertical, l.country].some((v) => v.toLowerCase().includes(q))) {
        out.push({
          id: l.id,
          type: 'lead',
          title: l.company,
          subtitle: `${l.name} · ${l.vertical} · ${l.country}`,
          badge: l.status,
          module: 'leads',
          icon: <UserPlus className="w-4 h-4" />,
        });
      }
    });

    clients.forEach((c) => {
      if ([c.companyName, c.primaryContact, c.vertical].some((v) => v.toLowerCase().includes(q))) {
        out.push({
          id: c.id,
          type: 'client',
          title: c.companyName,
          subtitle: `${c.primaryContact} · $${c.monthlyRetainer.toLocaleString()}/mo`,
          badge: c.status,
          module: 'clients',
          icon: <Users className="w-4 h-4" />,
        });
      }
    });

    projects.forEach((p) => {
      if ([p.name, p.clientName, p.serviceType].some((v) => v.toLowerCase().includes(q))) {
        out.push({
          id: p.id,
          type: 'project',
          title: p.name,
          subtitle: `${p.clientName} · ${p.serviceType}`,
          badge: p.status,
          module: 'projects',
          icon: <Briefcase className="w-4 h-4" />,
        });
      }
    });

    invoices.forEach((i) => {
      if ([i.invoiceNumber, i.clientName].some((v) => v.toLowerCase().includes(q))) {
        out.push({
          id: i.id,
          type: 'invoice',
          title: `${i.invoiceNumber} — ${i.clientName}`,
          subtitle: `$${i.amount.toLocaleString()} · Due ${i.dueDate}`,
          badge: i.status,
          module: 'finance',
          icon: <DollarSign className="w-4 h-4" />,
        });
      }
    });

    users.forEach((u) => {
      if ([u.name, u.department].some((v) => v.toLowerCase().includes(q))) {
        out.push({
          id: u.id,
          type: 'user',
          title: u.name,
          subtitle: `${u.department} · ${u.role}`,
          module: 'employees',
          icon: <UserCheck className="w-4 h-4" />,
        });
      }
    });

    return out;
  }, [query, leads, clients, projects, invoices, users]);

  // Keyboard navigation
  const handleSelect = useCallback(
    (result: SearchResult) => {
      onSelectModule(result.module);
      onClose();
    },
    [onSelectModule, onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyNav = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && results[activeIndex]) {
        e.preventDefault();
        handleSelect(results[activeIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyNav);
    return () => window.removeEventListener('keydown', handleKeyNav);
  }, [isOpen, results, activeIndex, handleSelect]);

  // Scroll active result into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
      activeEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  // Reset active when query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const q = query.trim();

  // Quick actions (show when no query)
  const quickActions = [
    { label: 'Open Lead Pipeline', module: 'leads' as ModuleKey, icon: <UserPlus className="w-4 h-4" /> },
    { label: 'View Active Clients', module: 'clients' as ModuleKey, icon: <Users className="w-4 h-4" /> },
    { label: 'Client Projects', module: 'projects' as ModuleKey, icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Finance & Invoicing', module: 'finance' as ModuleKey, icon: <DollarSign className="w-4 h-4" /> },
    { label: 'Reports & Analytics', module: 'reports' as ModuleKey, icon: <TrendingUp className="w-4 h-4" /> },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200/80 overflow-hidden flex flex-col max-h-[65vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── Search Input ─── */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-slate-100">
          <Search className="w-[18px] h-[18px] text-slate-400 shrink-0" strokeWidth={2.25} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything..."
            className="flex-1 bg-transparent text-[15px] text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
            autoFocus
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="text-[11px] font-medium text-slate-400 hover:text-slate-700 px-2 py-0.5 rounded hover:bg-slate-100 transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="flex items-center justify-center w-6 h-6 rounded-md text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ─── Results / Quick Actions ─── */}
        <div className="flex-1 overflow-y-auto" ref={listRef}>
          {/* Empty state — quick actions */}
          {!q && (
            <div className="p-2">
              <p className="px-3 pt-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quick navigation</p>
              {quickActions.map((action) => (
                <button
                  key={action.module}
                  onClick={() => {
                    onSelectModule(action.module);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    {action.icon}
                  </div>
                  <span className="text-[13px] font-medium text-slate-700 group-hover:text-slate-900">
                    {action.label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {q && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Search className="w-8 h-8 mb-3 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">No results for &quot;{query}&quot;</p>
              <p className="text-xs text-slate-400 mt-1">Try a different keyword</p>
            </div>
          )}

          {/* Results list */}
          {q && results.length > 0 && (
            <div className="p-2">
              <p className="px-3 pt-1.5 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </p>
              {results.map((result, index) => {
                const meta = TYPE_META[result.type];
                const isActive = index === activeIndex;
                return (
                  <button
                    key={`${result.type}-${result.id}`}
                    data-index={index}
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      isActive ? 'bg-indigo-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors ${
                        isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {result.icon}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] font-semibold truncate ${isActive ? 'text-indigo-700' : 'text-slate-800'}`}>
                        {result.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{result.subtitle}</p>
                    </div>

                    {/* Badge */}
                    {result.badge && (
                      <span className={`shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${meta.color}`}>
                        {result.badge.replace(/_/g, ' ')}
                      </span>
                    )}

                    {/* Type tag */}
                    <span className="shrink-0 text-[10px] font-medium text-slate-300 hidden sm:block">
                      {meta.label}
                    </span>

                    {/* Enter hint for active */}
                    {isActive && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── Footer ─── */}
        <div className="flex items-center justify-between px-4 h-10 border-t border-slate-100 bg-slate-50/80 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="inline-flex items-center justify-center w-5 h-5 rounded bg-white border border-slate-200 text-[10px] font-mono shadow-xs">↑</kbd>
              <kbd className="inline-flex items-center justify-center w-5 h-5 rounded bg-white border border-slate-200 text-[10px] font-mono shadow-xs">↓</kbd>
              <span className="ml-0.5">Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="inline-flex items-center justify-center h-5 px-1.5 rounded bg-white border border-slate-200 text-[10px] font-mono shadow-xs">↵</kbd>
              <span className="ml-0.5">Open</span>
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="inline-flex items-center justify-center h-5 px-1.5 rounded bg-white border border-slate-200 text-[10px] font-mono shadow-xs">Esc</kbd>
            <span className="ml-0.5">Close</span>
          </span>
        </div>
      </div>
    </div>
  );
};
