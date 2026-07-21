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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <DollarSign className="w-4 h-4" /> Financial Command Centre
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Invoicing & Revenue Engine
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            MRR/ARR reporting, automated invoice collection, & profit margin analysis
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV Report
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Create Invoice
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly MRR</span>
          <p className="text-2xl font-bold text-slate-900">{isAdmin ? `$${mrr.toLocaleString()}/mo` : '🔒 Masked'}</p>
          <p className="text-[11px] text-emerald-700 font-medium">Annualized ARR: {isAdmin ? `$${arr.toLocaleString()}` : '🔒'}</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Collected Revenue</span>
          <p className="text-2xl font-bold text-emerald-600">{isAdmin ? `$${totalPaid.toLocaleString()}` : '🔒 Masked'}</p>
          <p className="text-[11px] text-slate-500 font-medium">Paid Invoices</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Outstanding Unpaid</span>
          <p className="text-2xl font-bold text-amber-600">{isAdmin ? `$${totalUnpaid.toLocaleString()}` : '🔒 Masked'}</p>
          <p className="text-[11px] text-amber-700 font-medium">Awaiting payment</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overdue Collections</span>
          <p className="text-2xl font-bold text-rose-600">{isAdmin ? `$${totalOverdue.toLocaleString()}` : '🔒 Masked'}</p>
          <p className="text-[11px] text-rose-700 font-medium">Reminders active</p>
        </div>
      </div>

      {/* Profit Margin Analysis per Client */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" /> Client Profit Margin Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Retainer price vs employee logged hours cost (calculated @ $75/hr internal engineering cost)
            </p>
          </div>
          <span className="badge-indigo">
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
              <div key={client.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{client.companyName}</h4>
                  <span className={marginPct >= 50 ? 'badge-emerald' : 'badge-amber'}>
                    {marginPct}% Margin
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-slate-600 font-medium">
                  <div>Retainer: <span className="text-slate-900 font-bold">{isAdmin ? `$${client.monthlyRetainer}` : '🔒'}</span></div>
                  <div>Hours: <span className="text-slate-900 font-bold">{totalHours}h</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoices Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search invoices by INV number or client..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
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
                  <td className="p-4 font-mono font-bold text-indigo-600">{inv.invoiceNumber}</td>
                  <td className="p-4 font-bold text-slate-900">{inv.clientName}</td>
                  <td className="p-4">
                    <span className="badge-slate">
                      {inv.type}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-900">
                    {isAdmin ? `$${inv.amount.toLocaleString()}` : '🔒'}
                  </td>
                  <td className="p-4 text-slate-600 text-[11px]">
                    Issue: {inv.issueDate} <br />
                    Due: <span className="text-amber-700 font-semibold">{inv.dueDate}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={
                        inv.status === 'PAID'
                          ? 'badge-emerald'
                          : inv.status === 'OVERDUE'
                          ? 'badge-rose'
                          : 'badge-amber'
                      }
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedInvoicePdf(inv)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
                    >
                      PDF Invoice
                    </button>
                    {inv.status !== 'PAID' && (
                      <button
                        onClick={() => handleMarkPaid(inv.id)}
                        className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-sm transition-colors"
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white text-slate-900 rounded-xl p-8 shadow-xl space-y-6 border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-indigo-900">DigitalX Solutions</h2>
                <p className="text-xs text-slate-500">Sydney • Australia & USA</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-slate-900">{selectedInvoicePdf.invoiceNumber}</p>
                <p className="text-xs text-slate-500">Status: <span className="font-bold text-emerald-600 uppercase">{selectedInvoicePdf.status}</span></p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-500 font-bold uppercase">Billed To:</p>
                <p className="font-bold text-slate-800 text-sm">{selectedInvoicePdf.clientName}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 font-bold uppercase">Dates:</p>
                <p className="text-slate-700">Issue: {selectedInvoicePdf.issueDate}</p>
                <p className="text-slate-700 font-bold">Due: {selectedInvoicePdf.dueDate}</p>
              </div>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-y border-slate-200">
                  <th className="p-3">Item Description</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 font-semibold">{selectedInvoicePdf.type.replace('_', ' ')} Engagement</td>
                  <td className="p-3 text-right font-bold text-sm">${selectedInvoicePdf.amount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">Bank Transfer / Stripe Payment Online Ready</span>
              <button
                onClick={() => setSelectedInvoicePdf(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
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

