'use client';

import React, { useState } from 'react';
import { BarChart3, FileSpreadsheet, Download, Filter, Calendar, Globe, Building2, Lock } from 'lucide-react';
import { Lead, Client, Invoice } from '@/lib/types';

interface ReportsModuleProps {
  leads: Lead[];
  clients: Client[];
  invoices: Invoice[];
  isAdmin: boolean;
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  leads,
  clients,
  invoices,
  isAdmin,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedVertical, setSelectedVertical] = useState<string>('ALL');

  const filteredLeads = leads.filter(
    (l) =>
      (selectedCountry === 'ALL' || l.country === selectedCountry) &&
      (selectedVertical === 'ALL' || l.vertical === selectedVertical)
  );

  const filteredClients = clients.filter(
    (c) =>
      (selectedCountry === 'ALL' || c.country === selectedCountry) &&
      (selectedVertical === 'ALL' || c.vertical === selectedVertical)
  );

  const totalMRR = filteredClients
    .filter((c) => c.status === 'ACTIVE')
    .reduce((acc, c) => acc + c.monthlyRetainer, 0);

  const downloadCSV = () => {
    const headers = ['Type', 'Name/Company', 'Vertical', 'Country', 'Status', 'MRR / Score'];
    const rows = [
      ...filteredLeads.map((l) => ['Lead', `"${l.company}"`, l.vertical, l.country, l.status, l.score]),
      ...filteredClients.map((c) => ['Client', `"${c.companyName}"`, c.vertical, c.country, c.status, c.monthlyRetainer]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DigitalX_CRM_Executive_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">
            <BarChart3 className="w-4 h-4" /> Custom Analytics & Reporting
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Filterable Executive Reports
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Segment agency data by Country (AU/US), Industry Vertical, or Conversion Status
          </p>
        </div>

        <button
          onClick={downloadCSV}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
        >
          <Download className="w-4 h-4" /> Download Filtered CSV Report
        </button>
      </div>

      {/* Filter Controls */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-[10px] text-slate-400 font-semibold mb-1 uppercase">Country Target</label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Regions (AU & US)</option>
            <option value="AU">Australia (AU)</option>
            <option value="US">United States (US)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] text-slate-400 font-semibold mb-1 uppercase">Industry Vertical</label>
          <select
            value={selectedVertical}
            onChange={(e) => setSelectedVertical(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Market Verticals</option>
            <option value="Home Services">Home Services</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Automotive">Automotive</option>
            <option value="Beauty & Wellness">Beauty & Wellness</option>
            <option value="Professional Services">Professional Services</option>
            <option value="Hospitality">Hospitality</option>
          </select>
        </div>
      </div>

      {/* Report KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Matching Leads</span>
          <p className="text-2xl font-black text-blue-400">{filteredLeads.length} Leads</p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Matching Clients</span>
          <p className="text-2xl font-black text-emerald-400">{filteredClients.length} Clients</p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Filtered Segment MRR</span>
          <p className="text-2xl font-black text-white">{isAdmin ? `$${totalMRR.toLocaleString()}/mo` : <span className="inline-flex items-center gap-1 text-slate-400 font-normal"><Lock className="w-4 h-4" /> Masked</span>}</p>
        </div>
      </div>

      {/* Data Summary Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 font-bold text-xs text-slate-200">
          Filtered Accounts Summary ({filteredLeads.length + filteredClients.length} Records)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Account Type</th>
                <th className="p-4">Company Name</th>
                <th className="p-4">Vertical</th>
                <th className="p-4">Country</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredClients.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/50">
                  <td className="p-4 font-bold text-emerald-400">Active Client</td>
                  <td className="p-4 font-bold text-slate-100">{c.companyName}</td>
                  <td className="p-4 text-slate-300">{c.vertical}</td>
                  <td className="p-4">{c.country === 'AU' ? 'AU' : 'US'}</td>
                  <td className="p-4 font-semibold text-emerald-400">{c.status}</td>
                </tr>
              ))}
              {filteredLeads.map((l) => (
                <tr key={l.id} className="hover:bg-slate-800/50">
                  <td className="p-4 font-bold text-blue-400">Prospect Lead</td>
                  <td className="p-4 font-bold text-slate-100">{l.company}</td>
                  <td className="p-4 text-slate-300">{l.vertical}</td>
                  <td className="p-4">{l.country === 'AU' ? 'AU' : 'US'}</td>
                  <td className="p-4 font-semibold text-blue-400">{l.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
