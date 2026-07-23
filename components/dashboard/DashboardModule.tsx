'use client';

import React from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  UserPlus,
  Briefcase,
  AlertCircle,
  ArrowUpRight,
  PieChart as PieChartIcon,
  BarChart2,
  CheckCircle2,
  Calendar,
  Building2,
  ChevronRight,
  Shield,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Lead, Client, Project, Task, Invoice, Activity } from '@/lib/types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { crmStore } from '@/lib/store';

interface DashboardModuleProps {
  leads: Lead[];
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  invoices: Invoice[];
  activities: Activity[];
  isAdmin: boolean;
  onNavigate: (module: any) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  leads,
  clients,
  projects,
  tasks,
  invoices,
  activities,
  isAdmin,
  onNavigate,
}) => {
  // Compute KPIs
  const activeClients = clients.filter((c) => c.status === 'ACTIVE');
  const mrr = activeClients.reduce((acc, c) => acc + c.monthlyRetainer, 0);

  const pipelineValue = leads
    .filter((l) => l.status !== 'WON' && l.status !== 'LOST')
    .reduce((acc, l) => acc + 3500, 0); // Est $3.5k per open lead

  const openLeads = leads.filter((l) => l.status !== 'WON' && l.status !== 'LOST');
  const inProgressProjects = projects.filter((p) => p.status === 'IN_PROGRESS');
  const overdueTasks = tasks.filter((t) => t.status !== 'DONE' && new Date(t.dueDate) < new Date());

  // Chart Data
  const revenueTrendData = [
    { month: 'Feb', MRR: 8500, Revenue: 18000 },
    { month: 'Mar', MRR: 10200, Revenue: 24500 },
    { month: 'Apr', MRR: 11800, Revenue: 29000 },
    { month: 'May', MRR: 13500, Revenue: 34000 },
    { month: 'Jun', MRR: 14200, Revenue: 38500 },
    { month: 'Jul', MRR: mrr, Revenue: mrr + 27500 },
  ];

  const sourceCounts: Record<string, number> = {};
  leads.forEach((l) => {
    sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1;
  });
  const leadsBySource = Object.entries(sourceCounts).map(([name, value]) => ({ name, value }));

  const verticalCounts: Record<string, number> = {};
  leads.forEach((l) => {
    verticalCounts[l.vertical] = (verticalCounts[l.vertical] || 0) + 1;
  });
  const leadsByVertical = Object.entries(verticalCounts).map(([name, count]) => ({ name, count }));

  const COLORS = ['#4f46e5', '#0284c7', '#7c3aed', '#059669', '#d97706', '#e11d48'];

  const funnelSteps = [
    { label: 'New Ingested', count: leads.filter((l) => l.status === 'NEW').length, pct: '100%' },
    { label: 'Contacted', count: leads.filter((l) => l.status === 'CONTACTED').length, pct: '85%' },
    { label: 'Qualified', count: leads.filter((l) => l.status === 'QUALIFIED').length, pct: '65%' },
    { label: 'Proposal Sent', count: leads.filter((l) => l.status === 'PROPOSAL_SENT' || l.status === 'NEGOTIATION').length, pct: '45%' },
    { label: 'Closed Won', count: leads.filter((l) => l.status === 'WON').length, pct: '32%' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 crm-header-card p-6 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4 text-indigo-600" /> Executive Business Overview
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            DigitalX Solutions Command Dashboard
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time pipeline telemetry across Australia & USA accounts • Enterprise-Grade Security
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('leads')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" /> Add Lead
          </button>
          <button
            onClick={() => onNavigate('finance')}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
          >
            <DollarSign className="w-4 h-4 text-emerald-600" /> Invoicing
          </button>
        </div>
      </div>

      {/* ─── Plain-English Weekly Exec AI Summary ─── */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-xl space-y-2 border border-indigo-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-indigo-400" /> AI Executive Dashboard Narrative
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            AUTO-GENERATED
          </span>
        </div>
        <p className="text-sm font-medium text-slate-200 leading-relaxed">
          "Monthly Recurring Revenue is up 18% MoM at <strong>${mrr.toLocaleString()} AUD</strong> across active accounts, driven by high-margin AI Voice Agent retainers. Missed-call recovery sitting strong at <strong>85%</strong>. Recommendation: reprice 1 under-margin account."
        </p>
      </div>

      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1 */}
        <div
          onClick={() => onNavigate('clients')}
          className="p-5 crm-card crm-card-hover cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Clients</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-3">{activeClients.length}</p>
          <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +2 accounts
          </p>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => onNavigate('finance')}
          className="p-5 crm-card crm-card-hover cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly MRR</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-3">
            {isAdmin ? crmStore.formatCurrency(mrr) : <span className="inline-flex items-center gap-1.5 text-slate-400 text-lg font-normal"><Lock className="w-4 h-4" /> Hidden</span>}
          </p>
          <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +18.4% YoY
          </p>
        </div>

        {/* Card 3 */}
        <div
          onClick={() => onNavigate('leads')}
          className="p-5 crm-card crm-card-hover cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pipeline Value</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-3">
            {isAdmin ? crmStore.formatCurrency(pipelineValue) : <span className="inline-flex items-center gap-1.5 text-slate-400 text-lg font-normal"><Lock className="w-4 h-4" /> Hidden</span>}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">{openLeads.length} active leads</p>
        </div>


        {/* Card 4 */}
        <div
          onClick={() => onNavigate('leads')}
          className="p-5 crm-card crm-card-hover cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Open Leads</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-3">{openLeads.length}</p>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">AU: 6 • US: 4</p>
        </div>

        {/* Card 5 */}
        <div
          onClick={() => onNavigate('projects')}
          className="p-5 crm-card crm-card-hover cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Progress</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-3">{inProgressProjects.length}</p>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">On schedule</p>
        </div>

        {/* Card 6 */}
        <div
          onClick={() => onNavigate('tasks')}
          className="p-5 crm-card crm-card-hover cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overdue Tasks</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-3">{overdueTasks.length}</p>
          <p className="text-[11px] text-rose-600 font-bold mt-1">Action required</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trajectory Line Chart */}
        <div className="lg:col-span-2 crm-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" /> Revenue & MRR Growth Trajectory
              </h3>
              <p className="text-xs text-slate-500">6-Month historical MRR vs recognized monthly revenue</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full badge-emerald font-bold">
              Upward Growth
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData}>
                <defs>
                  <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontSize: '12px', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="MRR" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorMRR)" />
                <Area type="monotone" dataKey="Revenue" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Source Pie Chart */}
        <div className="crm-card p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-indigo-600" /> Leads by Source
            </h3>
            <p className="text-xs text-slate-500">Distribution across acquisition channels</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={leadsBySource} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {leadsBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            {leadsBySource.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="truncate">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: Leads by Vertical + Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Vertical Bar Chart */}
        <div className="crm-card p-6 space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-600" /> Industry Vertical Distribution
            </h3>
            <p className="text-xs text-slate-500">Account volume by target business sector</p>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadsByVertical}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="crm-card p-6 space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Sales Funnel Conversion Rate
            </h3>
            <p className="text-xs text-slate-500">Conversion velocity from raw lead to Won Client</p>
          </div>

          <div className="space-y-3.5 pt-2">
            {funnelSteps.map((step, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{step.label}</span>
                  <span className="text-slate-500">{step.count} leads ({step.pct})</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: step.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Log Feed */}
      <div className="crm-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" /> Recent Touchpoints & Activity Feed
            </h3>
            <p className="text-xs text-slate-500">Real-time log of calls, meetings, notes, and won deals</p>
          </div>

          <button
            onClick={() => onNavigate('activities')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            View Full Log →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {activities.slice(0, 3).map((act) => (
            <div key={act.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
                  {act.type}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(act.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
              <p className="text-[11px] text-slate-600 line-clamp-2">{act.description}</p>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                <span>By: {act.employeeName}</span>
                <span className="text-slate-800 font-bold">{act.entityName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
