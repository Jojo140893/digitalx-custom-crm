'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckSquare,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  Archive,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  X,
  Globe,
  Tag,
  Sparkles,
  ShieldAlert,
  TrendingDown,
} from 'lucide-react';
import { Client } from '@/lib/types';
import { crmStore } from '@/lib/store';
import { calculateClientHealth } from '@/lib/ai-engine';

interface ClientsModuleProps {
  clients: Client[];
  isAdmin: boolean;
  onRefresh: () => void;
  onNavigateToChurned: () => void;
}

export const ClientsModule: React.FC<ClientsModuleProps> = ({
  clients,
  isAdmin,
  onRefresh,
  onNavigateToChurned,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Churn Modal state
  const [churningClient, setChurningClient] = useState<Client | null>(null);
  const [churnReason, setChurnReason] = useState('Budget constraints');
  const [reactivationNotes, setReactivationNotes] = useState('Follow up in Q4 2026 for seasonal campaign');

  const activeClients = clients.filter(
    (c) =>
      c.status === 'ACTIVE' &&
      (c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.primaryContact.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.vertical.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalMRR = activeClients.reduce((acc, c) => acc + c.monthlyRetainer, 0);

  const handleChurnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!churningClient) return;
    crmStore.churnClient(churningClient.id, churnReason, reactivationNotes);
    setChurningClient(null);
    onRefresh();
    onNavigateToChurned();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 crm-header-card p-6 rounded-2xl border border-slate-200 bg-white">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-emerald-600" /> Active Client Portfolio
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Client Account Directory
          </h2>
          <p className="text-sm text-slate-600 font-medium mt-0.5">
            Managing active agency retainers, onboarding checklists, & service deliverables
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-5 py-3 rounded-xl">
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold">Active Retainers</p>
            <p className="text-xl font-extrabold text-emerald-700">{activeClients.length} Accounts</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold">Combined MRR</p>
            <p className="text-xl font-extrabold text-slate-900">{isAdmin ? crmStore.formatCurrency(totalMRR) + '/mo' : '🔒 Masked'}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="crm-card p-4 rounded-2xl flex items-center justify-between gap-4 bg-white border border-slate-200">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search active clients by company name, contact, or vertical..."
            className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-semibold placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 p-0.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded"
              title="Clear search input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {activeClients.map((client) => {
          const completedOb = client.onboardingChecklist.filter((i) => i.done).length;
          const totalOb = client.onboardingChecklist.length;
          const pctOb = totalOb > 0 ? Math.round((completedOb / totalOb) * 100) : 100;

          return (
            <div
              key={client.id}
              className="crm-card crm-card-hover rounded-2xl p-6 flex flex-col justify-between space-y-4 group bg-white border border-slate-200"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {client.companyName}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">{client.primaryContact}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                    {client.country === 'AU' ? '🇦🇺 AU' : '🇺🇸 US'}
                  </span>
                </div>

                {/* Financial Summary Pill */}
                <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-bold">Setup Fee</span>
                    <span className="font-extrabold text-slate-900">
                      {isAdmin ? crmStore.formatCurrency(client.setupFee) : '🔒'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-bold">Monthly Retainer</span>
                    <span className="font-extrabold text-emerald-700">
                      {isAdmin ? `${crmStore.formatCurrency(client.monthlyRetainer)}/mo` : '🔒'}
                    </span>
                  </div>
                </div>

                {/* Services Badges */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Active Services Package
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {client.servicesSold.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Onboarding Progress */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 flex items-center gap-1 text-[11px] font-bold">
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> Onboarding Checklist
                    </span>
                    <span className="text-slate-900 font-extrabold text-[11px]">
                      {completedOb}/{totalOb} ({pctOb}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${pctOb}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedClient(client)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition-all border border-slate-300"
                >
                  Manage Checklist & Contact
                </button>
                <button
                  onClick={() => setChurningClient(client)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Archive Client"
                >
                  <Archive className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CLIENT CHECKLIST MODAL */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedClient.companyName}</h3>
                <p className="text-xs text-slate-600 font-medium">
                  Contract Started: {selectedClient.contractStartDate} • {selectedClient.country}
                </p>
              </div>
              <button onClick={() => setSelectedClient(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 font-bold block">Primary Contact</span>
                <span className="font-extrabold text-slate-900">{selectedClient.primaryContact}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Contact Details</span>
                <span className="font-semibold text-slate-700">{selectedClient.email} • {selectedClient.phone}</span>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-600" /> Interactive Onboarding Tasks
              </h4>
              <div className="space-y-2">
                {selectedClient.onboardingChecklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      crmStore.toggleOnboardingTask(selectedClient.id, item.id);
                      onRefresh();
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      item.done
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs">{item.task}</span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        item.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {item.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedClient(null)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ARCHIVE MODAL */}
      {churningClient && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-extrabold text-rose-700 flex items-center gap-2">
                <Archive className="w-5 h-5" /> Archive Client &quot;{churningClient.companyName}&quot;
              </h3>
              <button onClick={() => setChurningClient(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChurnSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-800 font-bold mb-1">Reason for Churn *</label>
                <select
                  value={churnReason}
                  onChange={(e) => setChurnReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold focus:outline-none"
                >
                  <option value="Budget constraints">Budget constraints</option>
                  <option value="Acquired by national firm">Acquired by national firm</option>
                  <option value="Seasonal hiatus">Seasonal hiatus</option>
                  <option value="Project completed">Project completed</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Reactivation Notes</label>
                <textarea
                  rows={3}
                  value={reactivationNotes}
                  onChange={(e) => setReactivationNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setChurningClient(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs"
                >
                  Confirm Archive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
