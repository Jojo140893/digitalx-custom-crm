'use client';

import React, { useState } from 'react';
import { History, Search, Plus, Phone, Mail, Calendar, FileText, UserCheck, X } from 'lucide-react';
import { Activity, User } from '@/lib/types';
import { crmStore } from '@/lib/store';

interface ActivityTimelineModuleProps {
  activities: Activity[];
  users: User[];
  onRefresh: () => void;
}

export const ActivityTimelineModule: React.FC<ActivityTimelineModuleProps> = ({
  activities,
  users,
  onRefresh,
}) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [newLog, setNewLog] = useState({
    entityName: 'LA Dental Care Group',
    type: 'CALL' as Activity['type'],
    title: '',
    description: '',
  });

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    crmStore.logActivity({
      ...newLog,
    });
    setShowLogModal(false);
    setNewLog({ entityName: '', type: 'CALL', title: '', description: '' });
    onRefresh();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <History className="w-4 h-4" /> Client Interaction Log
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Activity Timeline & Touchpoints
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Complete communication audit log across calls, emails, strategy meetings, & notes
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Log Touchpoint / Call
        </button>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-6 relative before:absolute before:left-6 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {activities.map((act) => (
            <div key={act.id} className="relative pl-12 space-y-1 group">
              {/* Timeline Icon Marker */}
              <div className="absolute left-6 top-0.5 w-7 h-7 rounded-full bg-white border border-slate-300 shadow-xs flex items-center justify-center text-indigo-600 -translate-x-1/2 group-hover:scale-105 transition-transform">
                {act.type === 'CALL' && <Phone className="w-3.5 h-3.5 text-indigo-600" />}
                {act.type === 'EMAIL' && <Mail className="w-3.5 h-3.5 text-purple-600" />}
                {act.type === 'MEETING' && <Calendar className="w-3.5 h-3.5 text-emerald-600" />}
                {act.type === 'NOTE' && <FileText className="w-3.5 h-3.5 text-amber-600" />}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{act.title}</span>
                  <span className="badge-slate font-medium">
                    {act.entityName}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(act.loggedAt).toLocaleString()}
                </span>
              </div>

              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed font-medium">
                {act.description}
              </p>

              <p className="text-[10px] text-slate-500 pt-0.5">
                Logged by <span className="text-slate-800 font-semibold">{act.employeeName}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* LOG MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" /> Log Communication Touchpoint
              </h3>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Company / Entity Name *</label>
                <input
                  type="text"
                  required
                  value={newLog.entityName}
                  onChange={(e) => setNewLog({ ...newLog, entityName: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Touchpoint Type</label>
                  <select
                    value={newLog.type}
                    onChange={(e) => setNewLog({ ...newLog, type: e.target.value as Activity['type'] })}
                    className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="CALL">Call</option>
                    <option value="EMAIL">Email</option>
                    <option value="MEETING">Meeting</option>
                    <option value="NOTE">Internal Note</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Subject / Title *</label>
                  <input
                    type="text"
                    required
                    value={newLog.title}
                    onChange={(e) => setNewLog({ ...newLog, title: e.target.value })}
                    placeholder="e.g. Discovery Call"
                    className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Key Discussion Notes</label>
                <textarea
                  rows={3}
                  required
                  value={newLog.description}
                  onChange={(e) => setNewLog({ ...newLog, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm transition-colors"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

