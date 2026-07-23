import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  ShieldCheck,
  Zap,
  TrendingUp,
  Star,
  ExternalLink,
  Award,
} from 'lucide-react';
import { Client, Project, Invoice, Proposal } from '@/lib/types';
import { crmStore } from '@/lib/store';

export const ClientPortalModule: React.FC = () => {
  const [clients] = useState<Client[]>(crmStore.getClients());
  // Pick active client or first client
  const [activeClient, setActiveClient] = useState<Client>(clients[0]);

  const projects = crmStore.getProjects().filter((p) => p.clientId === activeClient?.id);
  const invoices = crmStore.getInvoices().filter((i) => i.clientId === activeClient?.id);
  const proposals = crmStore.getProposals().filter((pr) => pr.clientId === activeClient?.id);

  const completedProjects = projects.filter((p) => p.status === 'COMPLETED');
  const activeProjects = projects.filter((p) => p.status === 'IN_PROGRESS' || p.status === 'PENDING');

  const totalPaidInvoices = invoices
    .filter((i) => i.status === 'PAID')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      {/* ─── Client Portal Top Header Banner ─── */}
      <div className="crm-card p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Client-Facing Executive Portal
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {activeClient?.companyName} • Account Dashboard
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Primary Contact: <strong>{activeClient?.primaryContact}</strong> ({activeClient?.email}) • Active Retainer: <strong>${activeClient?.monthlyRetainer.toLocaleString()}/mo</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={activeClient?.id}
              onChange={(e) => {
                const found = clients.find((c) => c.id === e.target.value);
                if (found) setActiveClient(found);
              }}
              className="bg-white/10 text-white font-bold text-xs px-3 py-2 rounded-xl border border-white/20 hover:bg-white/20 transition-all outline-none"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id} className="text-slate-900">
                  {c.companyName} ({c.vertical})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ─── ROI & Account Value Metrics ─── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="crm-card p-5 rounded-2xl space-y-1 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/80">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
            <span>Estimated ROI Value Delivered</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-900">$34,500 AUD</div>
          <p className="text-[11px] text-emerald-700 font-medium">3.8x Return on AI Voice Investment</p>
        </div>

        <div className="crm-card p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Active Deployments</span>
            <Zap className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{activeProjects.length} Active</div>
          <p className="text-[11px] text-slate-500 font-medium">{completedProjects.length} Completed Projects</p>
        </div>

        <div className="crm-card p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Total Invested</span>
            <DollarSign className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">${totalPaidInvoices.toLocaleString()} AUD</div>
          <p className="text-[11px] text-slate-500 font-medium">{invoices.length} total invoices issued</p>
        </div>

        <div className="crm-card p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Satisfaction CSAT</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">5.0 / 5.0</div>
          <p className="text-[11px] text-slate-500 font-medium">Verified Client Rating</p>
        </div>
      </div>

      {/* ─── Active Deliverables & Milestones ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="crm-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-600" /> Active Service Deployments & Milestones
              </h3>
              <span className="text-xs font-semibold text-slate-400">{projects.length} Total Projects</span>
            </div>

            <div className="space-y-3">
              {projects.length > 0 ? (
                projects.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-xl border border-slate-200 space-y-2 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900">{proj.name}</h4>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        proj.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        proj.status === 'IN_PROGRESS' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {proj.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Service Type: <strong>{proj.serviceType}</strong> • Delivery Date: {proj.targetDelivery}</p>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                      <div className={`h-full ${proj.status === 'COMPLETED' ? 'bg-emerald-500 w-full' : 'bg-indigo-600 w-2/3'}`} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">No active project deployments for this account.</div>
              )}
            </div>
          </div>

          {/* Onboarding Checklist Status */}
          <div className="crm-card p-6 rounded-2xl space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Account Onboarding & Integration Status
            </h3>

            <div className="space-y-2">
              {activeClient?.onboardingChecklist?.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-800">{item.task}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.done ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                    {item.done ? 'COMPLETED' : 'PENDING'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Invoices & Signed Scope Documents */}
        <div className="lg:col-span-4 space-y-4">
          <div className="crm-card p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" /> Invoices & Billing History
            </h3>

            <div className="space-y-2">
              {invoices.map((inv) => (
                <div key={inv.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{inv.invoiceNumber}</span>
                    <span className="text-[10px] text-slate-400">Due: {inv.dueDate}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">${inv.amount.toLocaleString()}</span>
                    <span className={`text-[10px] font-bold ${inv.status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="crm-card p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" /> Executed Proposals & Scope
            </h3>

            <div className="space-y-2">
              {proposals.map((prop) => (
                <div key={prop.id} className="p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <span className="font-bold text-slate-900 block">{prop.title}</span>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>Value: ${prop.totalValue.toLocaleString()}</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> E-SIGNED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
