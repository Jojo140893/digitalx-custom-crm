'use client';

import React from 'react';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  UserX,
  Briefcase,
  CheckCircle2,
  Clock,
  DollarSign,
  UserCheck,
  FileText,
  FileCheck,
  History,
  CheckSquare,
  Webhook,
  BarChart3,
  ShieldAlert,
  Timer,
  Building2,
  ChevronRight,
} from 'lucide-react';

export type ModuleKey =
  | 'dashboard'
  | 'leads'
  | 'clients'
  | 'churned-clients'
  | 'projects'
  | 'completed-projects'
  | 'pending-projects'
  | 'finance'
  | 'employees'
  | 'employee-background'
  | 'proposals'
  | 'activities'
  | 'tasks'
  | 'integrations'
  | 'reports'
  | 'audit'
  | 'timetracking';

interface SidebarProps {
  currentModule: ModuleKey;
  onSelectModule: (module: ModuleKey) => void;
  counts: {
    leads: number;
    activeClients: number;
    pendingProjects: number;
    overdueInvoices: number;
  };
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  counts,
  isOpenMobile,
  onCloseMobile,
}) => {
  const menuGroups = [
    {
      label: 'EXECUTIVE & PIPELINE',
      items: [
        { key: 'dashboard', label: 'Command Dashboard', icon: LayoutDashboard },
        { key: 'leads', label: 'Lead Pipeline', icon: UserPlus, badge: counts.leads, badgeColor: 'bg-indigo-500/20 text-indigo-300' },
        { key: 'clients', label: 'Active Clients', icon: Users, badge: counts.activeClients, badgeColor: 'bg-emerald-500/20 text-emerald-300' },
        { key: 'churned-clients', label: 'Churned Archive', icon: UserX },
      ],
    },
    {
      label: 'DELIVERY & OPERATIONS',
      items: [
        { key: 'projects', label: 'Client Projects', icon: Briefcase },
        { key: 'pending-projects', label: 'Pending / Delayed', icon: Clock, badge: counts.pendingProjects > 0 ? counts.pendingProjects : undefined, badgeColor: 'bg-amber-500/20 text-amber-300' },
        { key: 'completed-projects', label: 'Completed Builds', icon: CheckCircle2 },
      ],
    },
    {
      label: 'FINANCE & TEAM',
      items: [
        { key: 'finance', label: 'Finance & Invoices', icon: DollarSign, badge: counts.overdueInvoices > 0 ? counts.overdueInvoices : undefined, badgeColor: 'bg-rose-500/20 text-rose-300' },
        { key: 'proposals', label: 'Proposals & Scope', icon: FileCheck },
        { key: 'employees', label: 'Staff Directory', icon: UserCheck },
        { key: 'employee-background', label: 'Employee Profiles', icon: FileText },
      ],
    },
    {
      label: 'INTEGRATIONS & AUDIT',
      items: [
        { key: 'tasks', label: 'Tasks & Reminders', icon: CheckSquare },
        { key: 'activities', label: 'Activity Feed', icon: History },
        { key: 'timetracking', label: 'Time & Margin Log', icon: Timer },
        { key: 'integrations', label: 'Automations & Webhooks', icon: Webhook },
        { key: 'reports', label: 'Executive Reports', icon: BarChart3 },
        { key: 'audit', label: 'Security Audit Log', icon: ShieldAlert },
      ],
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0f172a] text-slate-300 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header Branding */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base text-white tracking-tight flex items-center gap-1.5">
                DigitalX <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">Enterprise v4.2</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">SOC2 Certified CRM Suite</p>
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                {group.label}
              </h3>
              <div className="space-y-0.5 mt-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentModule === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        onSelectModule(item.key as ModuleKey);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                            isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Organization Profile */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-200 font-semibold">
              <span>DigitalX Global Corp</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Systems Operational" />
            </div>
            <p className="text-slate-400 text-[11px]">Sydney (syd1) • NYC (iad1)</p>
            <p className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/80">SLA: 99.99% • Latency: 14ms</p>
          </div>
        </div>
      </aside>

    </>
  );
};
