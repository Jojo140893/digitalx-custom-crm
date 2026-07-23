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
  Mail,
  Building2,
  Calendar,
  Send,
} from 'lucide-react';
import { crmStore } from '@/lib/store';
import { Tenant } from '@/lib/types';
import { toast } from '@/lib/toast';

export const BillingModule: React.FC = () => {
  const [activeTenant, setActiveTenant] = useState<Tenant>(crmStore.getActiveTenant());
  const [allTenants] = useState<Tenant[]>(crmStore.getTenants());

  // Demo Modal State
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoName, setDemoName] = useState('');
  const [demoEmail, setDemoEmail] = useState('');
  const [demoCompany, setDemoCompany] = useState('');
  const [demoVertical, setDemoVertical] = useState('Home Services');
  const [demoEstVolume, setDemoEstVolume] = useState('500 - 2,500 calls/mo');

  // Aggregate Cross-Tenant Telemetry
  const totalTokensAllTenants = allTenants.reduce((sum, t) => sum + (t.aiTokensUsed || 0), 0);
  const totalVoiceMinsAllTenants = allTenants.reduce((sum, t) => sum + (t.voiceMinutesUsed || 0), 0);
  // Est AI cost: $0.002 per 1k tokens, $0.05 per voice minute
  const totalEstimatedCostUSD = Math.round((totalTokensAllTenants / 1000) * 0.002 + totalVoiceMinsAllTenants * 0.05);

  const handleSelectTierInternal = (planName: 'STARTER' | 'AGENCY' | 'ENTERPRISE') => {
    activeTenant.plan = planName;
    toast.info(`Tier Scope Updated`, `Internal tenant tier set to ${planName}`);
    crmStore.setActiveTenant(activeTenant.id);
    setActiveTenant({ ...crmStore.getActiveTenant() });
  };

  const handleRequestDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoName || !demoEmail) return;

    // Log activity in CRM automatically
    crmStore.addLead({
      name: demoName,
      company: demoCompany || 'Demo Prospect Inc',
      email: demoEmail,
      phone: '+61 400 111 222',
      source: 'Website Form',
      vertical: demoVertical as any,
      country: 'AU',
      status: 'QUALIFIED',
      score: 85,
      notes: `Requested Enterprise B2B Demo. Est Volume: ${demoEstVolume}`,
      tags: ['B2B Demo Request', 'High Intent'],
      ownerId: 'u-1',
      ownerName: 'Sarah Jenkins',
      followUpDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    });

    toast.success('🎉 Demo Request Submitted!', `Thank you ${demoName}, our enterprise onboarding team will reach out within 2 hours.`);
    setIsDemoModalOpen(false);
    setDemoName('');
    setDemoEmail('');
    setDemoCompany('');
  };

  // Quota limits for active tenant
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
            <CreditCard className="w-4 h-4" /> Metered AI Telemetry & Enterprise Access
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Usage Metering & Custom B2B Tiering
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time tracking of AI token consumption, voice minutes, and proposal generations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDemoModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Calendar className="w-4 h-4" /> Request Custom Access & Demo
          </button>
        </div>
      </div>

      {/* ─── Aggregate Cross-Tenant Telemetry (Agency Owner View) ─── */}
      <div className="crm-card p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4" /> Agency Admin • Cross-Tenant Aggregate Spend
          </span>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            TOTAL AI SPEND: ${totalEstimatedCostUSD} USD
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs text-slate-300 block font-semibold">Cross-Tenant AI Tokens</span>
            <span className="text-2xl font-black text-white">{totalTokensAllTenants.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{allTenants.length} Active Workspaces</span>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs text-slate-300 block font-semibold">Total Voice Streaming Mins</span>
            <span className="text-2xl font-black text-emerald-400">{totalVoiceMinsAllTenants.toLocaleString()} mins</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Twilio / Vapi Streaming Call Telemetry</span>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs text-slate-300 block font-semibold">Estimated Gross API Margin</span>
            <span className="text-2xl font-black text-indigo-300">78.4%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Retainer Value vs Infrastructure Cost</span>
          </div>
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

      {/* ─── Enterprise Access & Tailored Architecture ─── */}
      <div className="crm-card p-6 rounded-2xl space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Enterprise B2B Architecture Tiers</h3>
          <p className="text-xs text-slate-500">Custom multi-tenant deployments configured for high-volume B2B automation agencies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1: Starter */}
          <div className={`p-6 rounded-2xl border-2 transition-all space-y-4 ${
            activeTenant.plan === 'STARTER' ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-200 bg-white'
          }`}>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Starter Workspace</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">Single Location</div>
              <p className="text-xs text-slate-500 mt-1">Foundational AI Voice setup for local businesses</p>
            </div>

            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> 50,000 AI Tokens /mo</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> 100 AI Voice Minutes /mo</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> 5 AI Proposals /mo</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> Standard Activity Feed</li>
            </ul>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Request Access
            </button>
          </div>

          {/* Tier 2: Agency White-Label */}
          <div className={`p-6 rounded-2xl border-2 transition-all space-y-4 relative ${
            activeTenant.plan === 'AGENCY' ? 'border-indigo-600 bg-indigo-50/20 shadow-lg' : 'border-slate-200 bg-white'
          }`}>
            <span className="absolute -top-3 right-4 bg-indigo-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              Recommended
            </span>

            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Agency White-Label</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">Multi-Client Scaling</div>
              <p className="text-xs text-slate-500 mt-1">Full white-label branding + embeddable widgets</p>
            </div>

            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> 250,000 AI Tokens /mo</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> 1,000 AI Voice Minutes /mo</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> 50 AI Proposals /mo</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> Embeddable Widget Generator</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> Custom Domain & Logo</li>
            </ul>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Book Agency Demo
            </button>
          </div>

          {/* Tier 3: Enterprise */}
          <div className={`p-6 rounded-2xl border-2 transition-all space-y-4 ${
            activeTenant.plan === 'ENTERPRISE' ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-200 bg-white'
          }`}>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enterprise Custom</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">High Volume Scale</div>
              <p className="text-xs text-slate-500 mt-1">Dedicated architecture for 10,000+ monthly calls</p>
            </div>

            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> 1,000,000 AI Tokens /mo</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> 5,000 AI Voice Minutes /mo</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> 500 AI Proposals /mo</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> Dedicated Account Architecture</li>
            </ul>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full py-2.5 rounded-xl font-bold text-xs border border-slate-300 hover:bg-slate-50"
            >
              Contact Enterprise Team
            </button>
          </div>
        </div>
      </div>

      {/* Demo Request Modal */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" /> Request Access & Book a Demo
              </h3>
              <button onClick={() => setIsDemoModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleRequestDemoSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={demoName}
                  onChange={(e) => setDemoName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="sarah@agency.com"
                  value={demoEmail}
                  onChange={(e) => setDemoEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Company / Agency Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DigitalX Growth Agency"
                  value={demoCompany}
                  onChange={(e) => setDemoCompany(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Niche / Vertical</label>
                <select
                  value={demoVertical}
                  onChange={(e) => setDemoVertical(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  <option value="Home Services">Home Services (Roofing, Plumbing, HVAC)</option>
                  <option value="Healthcare">Healthcare & Dental Clinics</option>
                  <option value="Automotive">Automotive Dealerships & Repair</option>
                  <option value="Professional Services">Legal & Financial Services</option>
                  <option value="Beauty & Wellness">Beauty, Spas & Wellness</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Estimated Monthly Call Volume</label>
                <select
                  value={demoEstVolume}
                  onChange={(e) => setDemoEstVolume(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  <option value="Under 500 calls/mo">Under 500 calls/mo</option>
                  <option value="500 - 2,500 calls/mo">500 - 2,500 calls/mo</option>
                  <option value="2,500 - 10,000 calls/mo">2,500 - 10,000 calls/mo</option>
                  <option value="10,000+ calls/mo (Enterprise)">10,000+ calls/mo (Enterprise)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsDemoModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
