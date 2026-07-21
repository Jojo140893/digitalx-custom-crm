'use client';

import React, { useState } from 'react';
import { UserCheck, Search, Plus, Award, Briefcase, Star, FileText, CheckCircle2, X } from 'lucide-react';
import { User } from '@/lib/types';
import { EmployeeBackgroundModal } from './EmployeeBackgroundModal';

interface EmployeesModuleProps {
  users: User[];
  onRefresh: () => void;
}

export const EmployeesModule: React.FC<EmployeesModuleProps> = ({ users, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4" /> Agency Talent & Workforce
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Team Directory & Workload Meter
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Managing Sydney & US engineers, automation architects, CRM leads, & campaign managers
          </p>
        </div>

        <div className="px-5 py-3 rounded-lg bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800">
          {users.length} Active Team Members
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employees by name, department, or skill (e.g. n8n, Vapi)..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-xl p-6 border border-slate-200 hover:border-indigo-300 transition-all space-y-4 shadow-sm group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                    {user.name}
                    {user.role === 'ADMIN' && (
                      <span className="badge-indigo text-[9px] uppercase">
                        FOUNDER
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-indigo-600 font-semibold">{user.department}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{user.email}</p>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="mt-4 space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                  Core Technical Skillset
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {user.skills.map((skill) => (
                    <span
                      key={skill}
                      className="badge-slate"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Workload Indicator */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Current Workload</span>
                <span
                  className={
                    user.workloadLevel === 'HIGH'
                      ? 'badge-rose'
                      : user.workloadLevel === 'MEDIUM'
                      ? 'badge-amber'
                      : 'badge-emerald'
                  }
                >
                  {user.workloadLevel} Capacity
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedUser(user)}
                className="w-full py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-indigo-600" /> View Extended Background & CV
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Extended Profile Modal */}
      {selectedUser && (
        <EmployeeBackgroundModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

