'use client';

import React from 'react';
import { Timer, Clock, UserCheck, Briefcase, DollarSign } from 'lucide-react';
import { TimeLog } from '@/lib/types';

interface TimeTrackingModuleProps {
  timeLogs: TimeLog[];
}

export const TimeTrackingModule: React.FC<TimeTrackingModuleProps> = ({ timeLogs }) => {
  const totalHours = timeLogs.reduce((acc, t) => acc + t.hours, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">
            <Timer className="w-4 h-4" /> Labor & Engineering Margin Analysis
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Employee Time Tracking Log
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Logged engineering hours per project/client for calculating account profitability
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm font-bold">
          {totalHours} Total Billable Hours Logged
        </div>
      </div>

      {/* Time Logs Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Employee</th>
                <th className="p-4">Project & Client</th>
                <th className="p-4">Hours</th>
                <th className="p-4">Work Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {timeLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/50">
                  <td className="p-4 font-mono text-slate-400">{log.date}</td>
                  <td className="p-4 font-bold text-slate-200">{log.employeeName}</td>
                  <td className="p-4">
                    <p className="font-bold text-blue-400">{log.projectName}</p>
                    <p className="text-slate-500 text-[10px]">{log.clientName}</p>
                  </td>
                  <td className="p-4 font-bold text-emerald-400 text-sm">{log.hours}h</td>
                  <td className="p-4 text-slate-300 italic max-w-xs">&quot;{log.description}&quot;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
