'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  Search,
  Plus,
  Download,
  FileSpreadsheet,
  FileCheck2,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Clock,
  Send,
  X,
  CreditCard,
  Building2,
  Sparkles,
} from 'lucide-react';
import { Invoice, Client, TimeLog } from '@/lib/types';
import { crmStore } from '@/lib/store';

interface FinanceModuleProps {
  invoices: Invoice[];
  clients: Client[];
  timeLogs: TimeLog[];
  isAdmin: boolean;
  onRefresh: () => void;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({
  invoices,
  clients,
  timeLogs,
  isAdmin,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInvoicePdf, setSelectedInvoicePdf] = useState<Invoice | null>(null);

  // New Invoice State
  const [newInv, setNewInv] = useState({
    clientId: clients[0]?.id || '',
    amount: 2500,
    type: 'MONTHLY_RETAINER' as Invoice['type'],
    dueDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
  });

  const activeClients = clients.filter((c) => c.status === 'ACTIVE');
  const mrr = activeClients.reduce((acc, c) => acc + c.monthlyRetainer, 0);
  const arr = mrr * 12;

  const totalPaid = invoices.filter((i) => i.status === 'PAID').reduce((acc, i) => acc + i.amount, 0);
  const totalUnpaid = invoices.filter((i) => i.status === 'UNPAID').reduce((acc, i) => acc + i.amount, 0);
  const totalOverdue = invoices.filter((i) => i.status === 'OVERDUE').reduce((acc, i) => acc + i.amount, 0);

  const filteredInvoices = invoices.filter(
    (i) =>
      i.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === newInv.clientId);
    crmStore.addInvoice({
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientId: newInv.clientId,
      clientName: client ? client.companyName : 'Unknown Client',
      amount: newInv.amount,
      type: newInv.type,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: newInv.dueDate,
      status: 'UNPAID',
    });
    setShowAddModal(false);
    onRefresh();
  };

  const handleMarkPaid = (id: string) => {
    crmStore.markInvoicePaid(id);
    onRefresh();
  };

  const exportCSV = () => {
    const headers = ['Invoice Number', 'Client Name', 'Amount', 'Type', 'Issue Date', 'Due Date', 'Status'];
    const rows = filteredInvoices.map((i) => [
      i.invoiceNumber,
      `"${i.clientName}"`,
      i.amount,
      i.type,
      i.issueDate,
      i.dueDate,
      i.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DigitalX_Invoices_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <DollarSign className="w-4 h-4 text-emerald-600" /> Financial Command Centre
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Invoicing & Revenue Engine
          </h2>
          <p className="text-sm text-slate-600 font-medium mt-0.5">
            MRR/ARR reporting, automated invoice collection, & profit margin analysis
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs flex items-center gap-2 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV Report
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Create Invoice
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly MRR</span>
          <p className="text-2xl font-extrabold text-slate-900">{isAdmin ? `${crmStore.formatCurrency(mrr)}/mo` : '🔒 Masked'}</p>
          <p className="text-xs text-emerald-700 font-bold">Annualized ARR: {isAdmin ? crmStore.formatCurrency(arr) : '🔒'}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Collected Revenue</span>
          <p className="text-2xl font-extrabold text-emerald-700">{isAdmin ? crmStore.formatCurrency(totalPaid) : '🔒 Masked'}</p>
          <p className="text-xs text-slate-600 font-medium">Paid Invoices</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Outstanding Unpaid</span>
          <p className="text-2xl font-extrabold text-amber-600">{isAdmin ? crmStore.formatCurrency(totalUnpaid) : '🔒 Masked'}</p>
          <p className="text-xs text-amber-700 font-bold">Awaiting payment</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overdue Collections</span>
          <p className="text-2xl font-extrabold text-rose-600">{isAdmin ? crmStore.formatCurrency(totalOverdue) : '🔒 Masked'}</p>
          <p className="text-xs text-rose-700 font-bold">Reminders active</p>
        </div>
      </div>

      {/* Profit Margin Analysis per Client */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" /> Client Profit Margin Breakdown
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Retainer price vs employee logged hours cost (calculated @ $75/hr internal engineering cost)
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            Stripe & Xero API Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeClients.map((client) => {
            const clientLogs = timeLogs.filter((t) => t.clientId === client.id);
            const totalHours = clientLogs.reduce((acc, t) => acc + t.hours, 0);
            const laborCost = totalHours * 75; // $75/hr cost
            const profit = client.monthlyRetainer - laborCost;
            const marginPct = client.monthlyRetainer > 0 ? Math.round((profit / client.monthlyRetainer) * 100) : 100;

            return (
              <div key={client.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{client.companyName}</h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${marginPct >= 50 ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                    {marginPct}% Margin
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-slate-700 font-semibold">
                  <div>Retainer: <span className="text-slate-900 font-extrabold">{isAdmin ? crmStore.formatCurrency(client.monthlyRetainer) : '🔒'}</span></div>
                  <div>Hours: <span className="text-slate-900 font-extrabold">{totalHours}h</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoices Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search invoices by INV number or client name..."
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
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Client Name</th>
                <th className="p-4">Invoice Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Issue / Due Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono font-bold text-indigo-700 text-sm">{inv.invoiceNumber}</td>
                  <td className="p-4 font-bold text-slate-900 text-sm">{inv.clientName}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold border border-slate-200">
                      {inv.type}
                    </span>
                  </td>
                  <td className="p-4 font-extrabold text-slate-900 text-sm">
                    {isAdmin ? crmStore.formatCurrency(inv.amount) : '🔒'}
                  </td>
                  <td className="p-4 text-slate-700 text-xs font-medium">
                    Issue: {inv.issueDate} <br />
                    Due: <span className="text-amber-800 font-bold">{inv.dueDate}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : inv.status === 'OVERDUE'
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedInvoicePdf(inv)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold border border-slate-300 transition-colors"
                    >
                      PDF Invoice
                    </button>
                    {inv.status !== 'PAID' && (
                      <button
                        onClick={() => handleMarkPaid(inv.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF INVOICE VIEW MODAL */}
      {selectedInvoicePdf && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white text-slate-900 rounded-3xl p-8 shadow-2xl space-y-6 border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-extrabold text-indigo-900">DigitalX Solutions</h2>
                <p className="text-xs text-slate-500 font-medium">Sydney • Australia & USA</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-slate-900">{selectedInvoicePdf.invoiceNumber}</p>
                <p className="text-xs text-slate-600">Status: <span className="font-bold text-emerald-600 uppercase">{selectedInvoicePdf.status}</span></p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-500 font-bold uppercase">Billed To:</p>
                <p className="font-extrabold text-slate-900 text-sm">{selectedInvoicePdf.clientName}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 font-bold uppercase">Dates:</p>
                <p className="text-slate-700 font-medium">Issue: {selectedInvoicePdf.issueDate}</p>
                <p className="text-slate-900 font-bold">Due: {selectedInvoicePdf.dueDate}</p>
              </div>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-y border-slate-200">
                  <th className="p-3">Item Description</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 font-bold">{selectedInvoicePdf.type.replace('_', ' ')} Engagement</td>
                  <td className="p-3 text-right font-extrabold text-sm">{crmStore.formatCurrency(selectedInvoicePdf.amount)}</td>
                </tr>
              </tbody>
            </table>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Bank Transfer / Stripe Payment Online Ready</span>
              <button
                onClick={() => setSelectedInvoicePdf(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                Close PDF Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
