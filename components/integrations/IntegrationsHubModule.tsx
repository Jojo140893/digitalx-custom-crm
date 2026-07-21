'use client';

import React, { useState } from 'react';
import { Webhook, Play, CheckCircle2, Zap, ArrowRight, Code, Copy, Check } from 'lucide-react';
import { WebhookLog } from '@/lib/types';
import { crmStore } from '@/lib/store';

interface IntegrationsHubModuleProps {
  webhooks: WebhookLog[];
  onRefresh: () => void;
}

export const IntegrationsHubModule: React.FC<IntegrationsHubModuleProps> = ({
  webhooks,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'ghl' | 'apollo' | 'meta' | 'n8n'>('ghl');
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Simulation Payload Form
  const [simName, setSimName] = useState('Dr. Marcus Aurelius');
  const [simCompany, setSimCompany] = useState('Aurelius Dental Sydney');
  const [simPhone, setSimPhone] = useState('+61 400 999 888');

  const webhookUrls = {
    ghl: 'http://localhost:3000/api/webhooks/ghl',
    apollo: 'http://localhost:3000/api/webhooks/apollo',
    meta: 'http://localhost:3000/api/webhooks/meta-ads',
    n8n: 'http://localhost:3000/api/webhooks/n8n',
  };

  const handleSimulate = (sourceName: WebhookLog['source']) => {
    crmStore.simulateWebhook(sourceName, {
      name: simName,
      company: simCompany,
      phone: simPhone,
      email: `${simName.toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
      vertical: 'Healthcare',
      country: 'AU',
      timestamp: new Date().toISOString(),
    });
    onRefresh();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <Webhook className="w-4 h-4" /> Integrations & Webhook Connectors
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Automation & Webhooks Hub
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Plugs DigitalX CRM into GoHighLevel, Apollo.io, n8n, Meta Ads, & GA4 in real-time
          </p>
        </div>

        <div className="px-5 py-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-600" /> Webhook Listener Live
        </div>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { key: 'ghl', name: 'GoHighLevel CRM', desc: 'Syncs lead pipelines & SMS triggers' },
          { key: 'apollo', name: 'Apollo.io B2B', desc: 'Ingests cold outbound leads & data' },
          { key: 'meta', name: 'Meta Ads Lead Gen', desc: 'Instant instant form payload sync' },
          { key: 'n8n', name: 'n8n Orchestrator', desc: 'Triggers custom agency workflows' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key as any)}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeTab === item.key
                ? 'bg-white border-indigo-600 shadow-sm'
                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
            }`}
          >
            <h4 className={`text-sm font-bold ${activeTab === item.key ? 'text-indigo-600' : 'text-slate-900'}`}>{item.name}</h4>
            <p className="text-xs text-slate-500 mt-1 font-medium">{item.desc}</p>
          </button>
        ))}
      </div>

      {/* Active Endpoint & Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Endpoint Specs */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-600" /> Webhook URL Endpoint
          </h3>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between font-mono text-xs text-slate-800 font-semibold">
            <span className="truncate">{webhookUrls[activeTab]}</span>
            <button
              onClick={() => copyToClipboard(webhookUrls[activeTab])}
              className="p-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 ml-2 shadow-xs transition-colors"
            >
              {copiedUrl ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="space-y-2 text-xs text-slate-700">
            <p className="font-semibold text-slate-800">Payload Expected Format (POST JSON):</p>
            <pre className="p-3 rounded-lg bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto">
{`{
  "name": "Dr. Marcus Aurelius",
  "company": "Aurelius Dental Sydney",
  "email": "marcus@aurelius.com.au",
  "phone": "+61 400 999 888",
  "vertical": "Healthcare",
  "country": "AU"
}`}
            </pre>
          </div>
        </div>

        {/* Live Simulation Sandbox */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Play className="w-5 h-5 text-emerald-600" /> Test Webhook Ingestion Sandbox
          </h3>
          <p className="text-xs text-slate-500">
            Simulate receiving an incoming payload to test real-time lead creation
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Company Name</label>
              <input
                type="text"
                value={simCompany}
                onChange={(e) => setSimCompany(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Contact Name</label>
                <input
                  type="text"
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Phone</label>
                <input
                  type="text"
                  value={simPhone}
                  onChange={(e) => setSimPhone(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              onClick={() =>
                handleSimulate(
                  activeTab === 'ghl'
                    ? 'GoHighLevel'
                    : activeTab === 'apollo'
                    ? 'Apollo.io'
                    : activeTab === 'meta'
                    ? 'Meta Ads'
                    : 'n8n'
                )
              }
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4 fill-white" /> Fire Simulated Webhook Payload
            </button>
          </div>
        </div>
      </div>

      {/* Webhook History Log */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Live Ingested Webhook Payload Trail</h3>
        <div className="space-y-2">
          {webhooks.map((wh) => (
            <div key={wh.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between font-mono">
              <div className="flex items-center gap-3">
                <span className="badge-indigo font-semibold">
                  {wh.source}
                </span>
                <span className="text-slate-700 font-medium truncate max-w-md">
                  {JSON.stringify(wh.payload)}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">{new Date(wh.receivedAt).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

