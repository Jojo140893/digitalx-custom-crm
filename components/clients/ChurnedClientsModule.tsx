'use client';

import React from 'react';
import { UserX, RefreshCw, Calendar, DollarSign, FileText, AlertCircle, Lock } from 'lucide-react';
import { Client } from '@/lib/types';
import { crmStore } from '@/lib/store';

interface ChurnedClientsModuleProps {
  clients: Client[];
  isAdmin: boolean;
  onRefresh: () => void;
  onNavigateToActive: () => void;
}

export const ChurnedClientsModule: React.FC<ChurnedClientsModuleProps> = ({
  clients,
  isAdmin,
  onRefresh,
  onNavigateToActive,
}) => {
  const churnedClients = clients.filter((c) => c.status === 'CHURNED');

  const totalLifetimeRevenue = churnedClients.reduce((acc, c) => acc + c.lifetimeRevenue, 0);

  const handleReactivate = (id: string) => {
    crmStore.reactivateClient(id);
    onRefresh();
    onNavigateToActive();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
            <UserX className="w-4 h-4" /> Archived & Past Accounts
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Churned Client Archive
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Historical audit log of churn reasons, lifetime values, and reactivation campaign notes
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-5 py-3 rounded-lg">
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Archived Accounts</p>
            <p className="text-xl font-bold text-rose-600">{churnedClients.length} Accounts</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Past Revenue</p>
            <p className="text-xl font-bold text-slate-900">{isAdmin ? `$${totalLifetimeRevenue.toLocaleString()}` : <span className="inline-flex items-center gap-1 text-slate-400 font-normal"><Lock className="w-4 h-4" /> Masked</span>}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Company & Contact</th>
                <th className="p-4">Exit Date</th>
                <th className="p-4">Churn Reason</th>
                <th className="p-4">Lifetime Revenue</th>
                <th className="p-4">Reactivation Strategy Notes</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {churnedClients.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No churned clients in archive.
                  </td>
                </tr>
              )}

              {churnedClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium">
                    <p className="text-slate-900 font-bold">{client.companyName}</p>
                    <p className="text-slate-500 text-[11px]">{client.primaryContact} • {client.email}</p>
                  </td>
                  <td className="p-4 text-slate-600 font-mono text-[11px]">{client.exitDate || 'N/A'}</td>
                  <td className="p-4">
                    <span className="badge-rose">
                      {client.churnReason || 'Not Specified'}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-emerald-700">
                    {isAdmin ? `$${client.lifetimeRevenue.toLocaleString()}` : <Lock className="w-3.5 h-3.5 text-slate-400 inline" />}
                  </td>
                  <td className="p-4 text-slate-500 max-w-xs truncate italic">
                    &quot;{client.reactivationNotes || 'No notes'}&quot;
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleReactivate(client.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 ml-auto shadow-sm transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Reactivate Account
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

