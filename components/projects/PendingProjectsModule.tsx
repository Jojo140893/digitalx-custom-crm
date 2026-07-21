'use client';

import React from 'react';
import { Clock, AlertTriangle, Calendar, UserCheck, CheckCircle2 } from 'lucide-react';
import { Project } from '@/lib/types';

interface PendingProjectsModuleProps {
  projects: Project[];
}

export const PendingProjectsModule: React.FC<PendingProjectsModuleProps> = ({ projects }) => {
  const pendingProjects = projects.filter((p) => p.status === 'PENDING' || p.status === 'ON_HOLD');

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4" /> Delayed & Pending Builds
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pending Projects Queue
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Track blocked initiatives, missing prerequisites, client approvals, & expected kickoff dates
          </p>
        </div>

        <div className="px-5 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold">
          {pendingProjects.length} Blocked / On Hold Projects
        </div>
      </div>

      {/* Pending Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pendingProjects.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl p-6 border border-slate-200 hover:border-amber-300 transition-all space-y-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="badge-amber mb-1 inline-block">
                  {p.status}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                <p className="text-xs text-slate-500">Client: {p.clientName}</p>
              </div>
            </div>

            {/* Blocker Card */}
            {p.blockerNotes && (
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1 font-medium">
                <div className="flex items-center gap-1.5 font-bold text-amber-700">
                  <AlertTriangle className="w-4 h-4" /> Active Blocker Note
                </div>
                <p className="italic">&quot;{p.blockerNotes}&quot;</p>
              </div>
            )}

            {/* Delay Reason */}
            {p.delayReason && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <span className="text-slate-500 text-[10px] block font-semibold">Reason for Delay</span>
                <p>{p.delayReason}</p>
              </div>
            )}

            {/* Target Dates */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block font-medium">Expected Start Date</span>
                <span className="font-semibold text-slate-800 font-mono text-[11px]">{p.expectedStartDate || 'TBD'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-medium">Assigned Lead</span>
                <span className="font-semibold text-indigo-600 text-[11px]">{p.assignees.join(', ')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

