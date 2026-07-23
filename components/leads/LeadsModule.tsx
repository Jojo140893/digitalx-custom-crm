'use client';

import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  LayoutGrid,
  List,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  Tag,
  Star,
  ChevronRight,
  Plus,
  X,
  ArrowRight,
  Globe,
  Award,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Lead, LeadStatus, LeadVertical, CountryCode, LeadSource, User, Client } from '@/lib/types';
import { crmStore } from '@/lib/store';
import { predictLeadScore } from '@/lib/ai-engine';

interface LeadsModuleProps {
  leads: Lead[];
  users: User[];
  isAdmin: boolean;
  onRefresh: () => void;
  onNavigateToClients: () => void;
}

export const LeadsModule: React.FC<LeadsModuleProps> = ({
  leads,
  users,
  isAdmin,
  onRefresh,
  onNavigateToClients,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVertical, setSelectedVertical] = useState<string>('ALL');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [convertLead, setConvertLead] = useState<Lead | null>(null);

  // New Lead Form State
  const [newLead, setNewLead] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    source: 'Website Form' as LeadSource,
    vertical: 'Home Services' as LeadVertical,
    country: 'AU' as CountryCode,
    status: 'NEW' as LeadStatus,
    score: 75,
    ownerId: users[0]?.id || '',
    notes: '',
    tags: 'High Intent, Sydney',
    followUpDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
  });

  // Convert Form State
  const [convertData, setConvertData] = useState({
    setupFee: 4500,
    monthlyRetainer: 2200,
    servicesSold: ['AI Voice Agents', 'GoHighLevel Setup'],
  });

  const statuses: { key: LeadStatus; label: string; color: string }[] = [
    { key: 'NEW', label: 'New Lead', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { key: 'CONTACTED', label: 'Contacted', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { key: 'QUALIFIED', label: 'Qualified', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { key: 'PROPOSAL_SENT', label: 'Proposal Sent', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { key: 'NEGOTIATION', label: 'Negotiation', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { key: 'WON', label: 'Won (Client)', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { key: 'LOST', label: 'Lost', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  ];

  // Filtering
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVertical = selectedVertical === 'ALL' || l.vertical === selectedVertical;
    const matchesCountry = selectedCountry === 'ALL' || l.country === selectedCountry;
    const matchesStatus = selectedStatus === 'ALL' || l.status === selectedStatus;
    return matchesSearch && matchesVertical && matchesCountry && matchesStatus;
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const owner = users.find((u) => u.id === newLead.ownerId);
    crmStore.addLead({
      ...newLead,
      ownerName: owner ? owner.name : 'Unassigned',
      tags: newLead.tags.split(',').map((t) => t.trim()).filter(Boolean),
    });
    setShowAddModal(false);
    onRefresh();
  };

  const handleConvertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertLead) return;
    crmStore.convertLeadToClient(
      convertLead.id,
      convertData.setupFee,
      convertData.monthlyRetainer,
      convertData.servicesSold
    );
    setConvertLead(null);
    onRefresh();
    onNavigateToClients();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 crm-header-card p-6 rounded-2xl border border-slate-200 bg-white">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
            <UserPlus className="w-4 h-4 text-indigo-600" /> Lead Acquisition Pipeline
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Lead Management Engine
          </h2>
          <p className="text-sm text-slate-600 mt-0.5 font-medium">
            Manage incoming lead opportunities & conversion funnels effortlessly
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Board View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" /> Data Table
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="crm-card p-4 rounded-2xl flex flex-wrap items-center gap-3 bg-white border border-slate-200">
        <div className="flex-1 min-w-[260px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by company or contact name..."
            className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-semibold placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 p-0.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded"
              title="Clear search filter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <select
          value={selectedVertical}
          onChange={(e) => setSelectedVertical(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
        >
          <option value="ALL">All Verticals</option>
          <option value="Home Services">Home Services</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Automotive">Automotive</option>
          <option value="Beauty & Wellness">Beauty & Wellness</option>
          <option value="Professional Services">Professional Services</option>
          <option value="Hospitality">Hospitality</option>
        </select>

        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
        >
          <option value="ALL">All Regions (AU & US)</option>
          <option value="AU">Australia (AU)</option>
          <option value="US">United States (US)</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
        >
          <option value="ALL">All Pipeline Stages</option>
          {statuses.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-6">
          {statuses.map((col) => {
            const colLeads = filteredLeads.filter((l) => l.status === col.key);
            return (
              <div
                key={col.key}
                className="w-80 shrink-0 bg-slate-100/70 border border-slate-200 rounded-2xl p-3 flex flex-col max-h-[75vh]"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${col.color}`}>
                    {col.label}
                  </span>
                  <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                    {colLeads.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {lead.company}
                          </h4>
                          <p className="text-xs text-slate-600 font-medium">{lead.name}</p>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
                          {lead.country === 'AU' ? 'AU' : 'US'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-amber-700 font-extrabold text-xs">
                          <Award className="w-3.5 h-3.5 text-amber-600" /> Score: {lead.score}/100
                        </div>
                        <span className="text-[11px] text-slate-700 px-2 py-0.5 rounded bg-slate-100 font-semibold border border-slate-200">
                          {lead.source}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 line-clamp-2 italic bg-slate-50 p-2 rounded-lg border border-slate-200">
                        &quot;{lead.notes}&quot;
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-semibold">Owner: {lead.ownerName}</span>

                        {lead.status === 'WON' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConvertLead(lead);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                          >
                            Convert <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <select
                            value={lead.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              crmStore.updateLeadStatus(lead.id, e.target.value as LeadStatus);
                              onRefresh();
                            }}
                            className="bg-slate-100 text-slate-800 text-xs font-bold px-2 py-0.5 rounded border border-slate-300 focus:outline-none"
                          >
                            {statuses.map((s) => (
                              <option key={s.key} value={s.key}>{s.label}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="crm-card rounded-2xl overflow-hidden bg-white border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Company & Contact</th>
                  <th className="p-4">Vertical / Country</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Assigned Owner</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="text-slate-900 font-bold text-sm">{lead.company}</p>
                      <p className="text-slate-600 text-xs font-medium">{lead.name} • {lead.email}</p>
                    </td>
                    <td className="p-4 font-bold text-slate-800">
                      {lead.vertical} <br />
                      <span className="text-slate-600 text-xs font-normal">{lead.country === 'AU' ? 'Australia' : 'United States'}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                        {lead.source}
                      </span>
                    </td>
                    <td className="p-4 font-extrabold text-amber-700 text-sm">{lead.score}/100</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statuses.find((s) => s.key === lead.status)?.color}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">{lead.ownerName}</td>
                    <td className="p-4 text-right">
                      {lead.status === 'WON' ? (
                        <button
                          onClick={() => setConvertLead(lead)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                        >
                          Convert →
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold border border-slate-300"
                        >
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD LEAD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" /> Create New Prospect Lead
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={newLead.company}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                    placeholder="e.g. Sydney Dental Clinic"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-600 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Primary Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    placeholder="e.g. Dr. Mark Vance"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-600 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-600 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-600 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Lead Source</label>
                  <select
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value as LeadSource })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none font-semibold"
                  >
                    <option value="Website Form">Website Form</option>
                    <option value="Apollo.io">Apollo.io</option>
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="GoHighLevel">GoHighLevel</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Vertical</label>
                  <select
                    value={newLead.vertical}
                    onChange={(e) => setNewLead({ ...newLead, vertical: e.target.value as LeadVertical })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none font-semibold"
                  >
                    <option value="Home Services">Home Services</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Beauty & Wellness">Beauty & Wellness</option>
                    <option value="Professional Services">Professional Services</option>
                    <option value="Hospitality">Hospitality</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Country</label>
                  <select
                    value={newLead.country}
                    onChange={(e) => setNewLead({ ...newLead, country: e.target.value as CountryCode })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none font-semibold"
                  >
                    <option value="AU">Australia (AU)</option>
                    <option value="US">United States (US)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONVERT MODAL */}
      {convertLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-extrabold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Convert &quot;{convertLead.company}&quot; to Active Client
              </h3>
              <button onClick={() => setConvertLead(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConvertSubmit} className="space-y-4 text-xs font-medium">
              <p className="text-slate-700 font-medium">
                Converting this lead creates an **Active Client record**, initializes an **Onboarding Checklist**, and generates the **Initial Setup Invoice**.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">One-Off Setup Fee ($)</label>
                  <input
                    type="number"
                    required
                    value={convertData.setupFee}
                    onChange={(e) => setConvertData({ ...convertData, setupFee: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Monthly Retainer ($/mo)</label>
                  <input
                    type="number"
                    required
                    value={convertData.monthlyRetainer}
                    onChange={(e) => setConvertData({ ...convertData, monthlyRetainer: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none font-bold text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setConvertLead(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs flex items-center gap-1.5 text-xs"
                >
                  Confirm Onboarding Launch <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
