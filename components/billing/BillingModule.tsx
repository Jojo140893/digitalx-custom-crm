import React, { useState } from 'react';
import {
  CreditCard,
  Zap,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  FileText,
  ShieldCheck,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { crmStore } from '@/lib/store';
import { Tenant } from '@/lib/types';
import { toast } from '@/lib/toast';

export const BillingModule: React.FC = () => {
  const [activeTenant, setActiveTenant] = useState<Tenant>(crmStore.getActiveTenant());

  const handleUpgradeTier = (planName: 'STARTER' | 'AGENCY' | 'ENTERPRISE') => {
    activeTenant.plan = planName;
    toast.success(`Plan Upgraded: ${planName}`, `Your account quota has been updated for ${activeTenant.name}`);
    crmStore.setActiveTenant(activeTenant.id);
    setActiveTenant({ ...crmStore.getActiveTenant() });
  };

  // Tier limits
  const quotaLimits = {
    STARTER: { tokens: 50000, voiceMinutes: 100, proposals: 5 },
    AGENCY: { tokens: 250000, voiceMinutes: 1000, proposals: 50 },
    ENTERPRISE: { tokens: 1000000, voiceMinutes: 5000, proposals: 500 },
  }[activeTenant.plan];

  const tokenPercent = Math.min(100, Math.round((activeTenant.aiTokensUsed / quotaLimits.tokens) * 100));
  const voicePercent = Math.min(100, Math.round((activeTenant.voiceMinutesUsed / quotaLimits.voiceMinutes) * 100));
  const proposalPercent = Math.min(100, Math.round((activeTenant.proposalsGenerated / quotaLimits.proposals) * 100));

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 crm-card p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4" /> Billing & Metered Usage Infrastructure
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Transparent SaaS Tiering & AI Metering
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time tracking of AI token consumption, voice minutes, and proposal generations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
            Active Tier: {activeTenant.plan}
          </span>
        </div>
      </div>

      {/* ─── Live Metered Usage Meters ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Meter 1: AI Tokens */}
        <div className="crm-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Sparkles className="w-4 h-4 text-indigo-600" /> AI Tokens Consumed
            </div>
            <span className="text-xs font-mono font-bold text-indigo-600">{tokenPercent}%</span>
          </div>

          <div className="text-2xl font-black text-slate-900">
            {activeTenant.aiTokensUsed.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ {quotaLimits.tokens.toLocaleString()} tokens</span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div className={`h-full transition-all ${tokenPercent > 85 ? 'bg-amber-500' : 'bg-indigo-600'}`} style={{ width: `${tokenPercent}%` }} />
          </div>

          <p className="text-[11px] text-slate-500">Auto-metered across prompt generations and NL queries.</p>
        </div>

        {/* Meter 2: Voice Minutes */}
        <div className="crm-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <PhoneCall className="w-4 h-4 text-emerald-600" /> AI Voice Minutes
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600">{voicePercent}%</span>
          </div>

          <div className="text-2xl font-black text-slate-900">
            {activeTenant.voiceMinutesUsed} <span className="text-xs font-normal text-slate-400">/ {quotaLimits.voiceMinutes} mins</span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${voicePercent}%` }} />
          </div>

          <p className="text-[11px] text-slate-500">Twilio / Vapi live streaming call time metered per second.</p>
        </div>

        {/* Meter 3: Proposals Generated */}
        <div className="crm-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <FileText className="w-4 h-4 text-amber-600" /> AI Proposals Created
            </div>
            <span className="text-xs font-mono font-bold text-amber-600">{proposalPercent}%</span>
          </div>

          <div className="text-2xl font-black text-slate-900">
            {activeTenant.proposalsGenerated} <span className="text-xs font-normal text-slate-400">/ {quotaLimits.proposals} drafts</span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 transition-all" style={{ width: `${proposalPercent}%` }} />
          </div>

          <p className="text-[11px] text-slate-500">Scope + pricing documents drafted from discovery calls.</p>
        </div>
      </div>

      {/* ─── Transparent Subscription Tiers ─── */}
      <div className="crm-card p-6 rounded-2xl space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Select Subscription Tier</h3>
          <p className="text-xs text-slate-500">Transparent pricing with zero hidden add-on fees.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1: Starter */}
          <div className={`p-6 rounded-2xl border-2 transition-all space-y-4 ${
            activeTenant.plan === 'STARTER' ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-200 bg-white'
          }`}>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Starter</span>
              <div className="text-3xl font-black text-slate-900 mt-1">$99 <span className="text-xs text-slate-400">/mo</span></div>
              <p className="text-xs text-slate-500 mt-1">Single-location agency setup</p>
            </div>

            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> 50,000 AI Tokens /mo</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> 100 AI Voice Minutes /mo</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> 5 AI Proposals /mo</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> Standard Activity Feed</li>
            </ul>

            <button
              onClick={() => handleUpgradeTier('STARTER')}
              disabled={activeTenant.plan === 'STARTER'}
              className="w-full py-2.5 rounded-xl font-bold text-xs border border-slate-300 hover:bg-slate-50 disabled:opacity-50"
            >
              {activeTenant.plan === 'STARTER' ? 'Current Active Tier' : 'Switch to Starter'}
            </button>
          </div>

          {/* Tier 2: Agency White-Label */}
          <div className={`p-6 rounded-2xl border-2 transition-all space-y-4 relative ${
            activeTenant.plan === 'AGENCY' ? 'border-indigo-600 bg-indigo-50/20 shadow-lg' : 'border-slate-200 bg-white'
          }`}>
            <span className="absolute -top-3 right-4 bg-indigo-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              Most Popular
            </span>

            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Agency White-Label</span>
              <div className="text-3xl font-black text-slate-900 mt-1">$297 <span className="text-xs text-slate-400">/mo</span></div>
              <p className="text-xs text-slate-500 mt-1">Full agency rebranding + embeddable widgets</p>
            </div>

            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> 250,000 AI Tokens /mo</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> 1,000 AI Voice Minutes /mo</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> 50 AI Proposals /mo</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> Embeddable Widget Generator</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> Custom Domain & Logo</li>
            </ul>

            <button
              onClick={() => handleUpgradeTier('AGENCY')}
              disabled={activeTenant.plan === 'AGENCY'}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {activeTenant.plan === 'AGENCY' ? 'Current Active Tier' : 'Upgrade to Agency White-Label'}
            </button>
          </div>

          {/* Tier 3: Enterprise */}
          <div className={`p-6 rounded-2xl border-2 transition-all space-y-4 ${
            activeTenant.plan === 'ENTERPRISE' ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-200 bg-white'
          }`}>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enterprise</span>
              <div className="text-3xl font-black text-slate-900 mt-1">$997 <span className="text-xs text-slate-400">/mo</span></div>
              <p className="text-xs text-slate-500 mt-1">Unlimited multi-location scalability</p>
            </div>

            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> 1,000,000 AI Tokens /mo</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> 5,000 AI Voice Minutes /mo</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> 500 AI Proposals /mo</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> Dedicated Account Architecture</li>
            </ul>

            <button
              onClick={() => handleUpgradeTier('ENTERPRISE')}
              disabled={activeTenant.plan === 'ENTERPRISE'}
              className="w-full py-2.5 rounded-xl font-bold text-xs border border-slate-300 hover:bg-slate-50 disabled:opacity-50"
            >
              {activeTenant.plan === 'ENTERPRISE' ? 'Current Active Tier' : 'Upgrade to Enterprise'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
