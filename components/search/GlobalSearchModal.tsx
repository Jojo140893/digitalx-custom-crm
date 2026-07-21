'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, UserPlus, Users, Briefcase, DollarSign, ArrowRight, UserCheck } from 'lucide-react';
import { Lead, Client, Project, Invoice, User } from '@/lib/types';
import { ModuleKey } from '../layout/Sidebar';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  clients: Client[];
  projects: Project[];
  invoices: Invoice[];
  users: User[];
  onSelectModule: (module: ModuleKey) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  leads,
  clients,
  projects,
  invoices,
  users,
  onSelectModule,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredLeads = q ? leads.filter((l) => l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.vertical.toLowerCase().includes(q)) : [];
  const filteredClients = q ? clients.filter((c) => c.companyName.toLowerCase().includes(q) || c.primaryContact.toLowerCase().includes(q) || c.vertical.toLowerCase().includes(q)) : [];
  const filteredProjects = q ? projects.filter((p) => p.name.toLowerCase().includes(q) || p.clientName.toLowerCase().includes(q) || p.serviceType.toLowerCase().includes(q)) : [];
  const filteredInvoices = q ? invoices.filter((i) => i.invoiceNumber.toLowerCase().includes(q) || i.clientName.toLowerCase().includes(q)) : [];
  const filteredUsers = q ? users.filter((u) => u.name.toLowerCase().includes(q) || u.department.toLowerCase().includes(q)) : [];

  const totalResults = filteredLeads.length + filteredClients.length + filteredProjects.length + filteredInvoices.length + filteredUsers.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-20 px-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/80">
          <Search className="w-5 h-5 text-indigo-600" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads, clients, projects, invoices, or team members..."
            className="flex-1 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-base font-semibold"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="px-2 py-1 text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-all"
              title="Clear search input"
            >
              Clear
            </button>
          )}
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {!q && (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Search className="w-10 h-10 mx-auto text-indigo-400" />
              <p className="text-sm font-bold text-slate-800">Search DigitalX CRM Database</p>
              <p className="text-xs text-slate-500 font-medium">Type any keyword or press <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-700 font-mono text-[10px]">ESC</kbd> to close</p>
            </div>
          )}

          {q && totalResults === 0 && (
            <div className="text-center py-12 text-slate-600">
              <p className="text-sm font-medium">No matching records found for &quot;<span className="text-slate-900 font-bold">{query}</span>&quot;</p>
            </div>
          )}

          {/* Leads */}
          {filteredLeads.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-600" /> Leads ({filteredLeads.length})
              </h4>
              <div className="space-y-1.5">
                {filteredLeads.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => {
                      onSelectModule('leads');
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/80 border border-slate-200 flex items-center justify-between cursor-pointer group transition-all"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-700">{l.company}</p>
                      <p className="text-xs text-slate-600 font-medium">{l.name} • {l.vertical} ({l.country})</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full font-bold bg-indigo-100 text-indigo-900 border border-indigo-200">{l.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clients */}
          {filteredClients.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" /> Active Clients ({filteredClients.length})
              </h4>
              <div className="space-y-1.5">
                {filteredClients.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectModule('clients');
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-200 flex items-center justify-between cursor-pointer group transition-all"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-800">{c.companyName}</p>
                      <p className="text-xs text-slate-600 font-medium">{c.primaryContact} • Retainer: ${c.monthlyRetainer.toLocaleString()}/mo</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-600" /> Projects ({filteredProjects.length})
              </h4>
              <div className="space-y-1.5">
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectModule('projects');
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-purple-50/80 border border-slate-200 flex items-center justify-between cursor-pointer group transition-all"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-purple-800">{p.name}</p>
                      <p className="text-xs text-slate-600 font-medium">Client: {p.clientName} • Service: {p.serviceType}</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full font-bold bg-slate-200 text-slate-800">{p.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invoices */}
          {filteredInvoices.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Invoices ({filteredInvoices.length})
              </h4>
              <div className="space-y-1.5">
                {filteredInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => {
                      onSelectModule('finance');
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-200 flex items-center justify-between cursor-pointer group transition-all"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-800">{inv.invoiceNumber} — {inv.clientName}</p>
                      <p className="text-xs text-slate-600 font-medium">Amount: ${inv.amount.toLocaleString()} • Due: {inv.dueDate}</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">{inv.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Members */}
          {filteredUsers.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" /> Team Members ({filteredUsers.length})
              </h4>
              <div className="space-y-1.5">
                {filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => {
                      onSelectModule('employees');
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200 flex items-center justify-between cursor-pointer group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full border border-slate-300 object-cover" />
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-800">{u.name}</p>
                        <p className="text-xs text-slate-600 font-medium">{u.department} • {u.role}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
