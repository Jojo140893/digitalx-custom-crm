'use client';

import React from 'react';
import { ShieldAlert, History, UserCheck, Clock } from 'lucide-react';
import { AuditLog } from '@/lib/types';

interface AuditLogModuleProps {
  auditLogs: AuditLog[];
}

export const AuditLogModule: React.FC<AuditLogModuleProps> = ({ auditLogs }) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">
            <ShieldAlert className="w-4 h-4" /> System Telemetry & Compliance
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Security Audit Log
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Tamper-proof audit trail of who changed what, status transitions, & billing modifications
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm font-bold">
          {auditLogs.length} Logged Events
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">User & Role</th>
                <th className="p-4">Action Type</th>
                <th className="p-4">Entity</th>
                <th className="p-4">Audit Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/50">
                  <td className="p-4 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-4">
                    <span className="font-bold text-slate-200">{log.userName}</span>{' '}
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold border border-purple-500/20">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{log.entityType}</td>
                  <td className="p-4 text-slate-200">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
