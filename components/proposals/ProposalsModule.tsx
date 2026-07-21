'use client';

import React, { useState } from 'react';
import { FileCheck, Search, Plus, CheckCircle2, FileText, Send, Sparkles, X, ShieldCheck, PenTool } from 'lucide-react';
import { Proposal, Client } from '@/lib/types';
import { crmStore } from '@/lib/store';

interface ProposalsModuleProps {
  proposals: Proposal[];
  clients: Client[];
  isAdmin: boolean;
  onRefresh: () => void;
}

export const ProposalsModule: React.FC<ProposalsModuleProps> = ({
  proposals,
  clients,
  isAdmin,
  onRefresh,
}) => {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showSignModal, setShowSignModal] = useState<Proposal | null>(null);
  const [signatureName, setSignatureName] = useState('');

  const handleSignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showSignModal || !signatureName) return;
    crmStore.signProposal(showSignModal.id, signatureName);
    setShowSignModal(null);
    onRefresh();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <FileCheck className="w-4 h-4" /> Contract & Scope Management
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Proposals & E-Signature Hub
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Multi-phase project scopes, versioning control, & legally binding digital signatures
          </p>
        </div>

        <div className="px-5 py-3 rounded-lg bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800">
          {proposals.length} Proposals Generated
        </div>
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {proposals.map((prop) => (
          <div
            key={prop.id}
            className="bg-white rounded-xl p-6 border border-slate-200 hover:border-indigo-300 transition-all space-y-4 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="badge-indigo font-mono mb-1 inline-block">
                    {prop.version}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{prop.title}</h3>
                  <p className="text-xs text-slate-500">Client: {prop.clientName}</p>
                </div>

                <span
                  className={
                    prop.status === 'ACCEPTED'
                      ? 'badge-emerald'
                      : 'badge-amber'
                  }
                >
                  {prop.status}
                </span>
              </div>

              {/* Phased Breakdown */}
              <div className="mt-4 space-y-2">
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                  Phased Project Scope Breakdown
                </span>
                <div className="space-y-1.5">
                  {prop.phases.map((phase, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-800">{phase.phaseName}</p>
                        <p className="text-[11px] text-slate-500">{phase.scope} • {phase.timeline}</p>
                      </div>
                      <span className="font-bold text-emerald-700">{isAdmin ? `$${phase.cost.toLocaleString()}` : '🔒'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* E-Signature Status */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {prop.eSigned ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5 text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Signed: {prop.eSignatureData}
                  </span>
                ) : (
                  <span className="text-amber-700 font-semibold flex items-center gap-1 text-[11px]">
                    <PenTool className="w-3.5 h-3.5 text-amber-600" /> Pending Signature
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">Total: {isAdmin ? `$${prop.totalValue.toLocaleString()}` : '🔒'}</span>
              {!prop.eSigned && (
                <button
                  onClick={() => {
                    setShowSignModal(prop);
                    setSignatureName(prop.clientName);
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <PenTool className="w-3.5 h-3.5" /> Execute Digital Signature
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* SIGNATURE MODAL */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-emerald-700 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-emerald-600" /> Execute Proposal E-Signature
              </h3>
              <button onClick={() => setShowSignModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSignSubmit} className="space-y-4 text-xs">
              <p className="text-slate-700">
                Signing proposal: <span className="font-bold text-slate-900">&quot;{showSignModal.title}&quot;</span> for total value of <span className="font-bold text-emerald-700">${showSignModal.totalValue.toLocaleString()}</span>.
              </p>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Signatory Full Name *</label>
                <input
                  type="text"
                  required
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  placeholder="e.g. Dr. Robert Chen"
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 italic font-mono">
                Digital Signature Timestamp: {new Date().toISOString()}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowSignModal(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm transition-colors"
                >
                  Sign & Accept Scope
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

