import React, { useState } from 'react';
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Play,
  Pause,
  Clock,
  Sparkles,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  TrendingUp,
  Tag,
} from 'lucide-react';
import { CallRecord } from '@/lib/types';
import { crmStore } from '@/lib/store';

interface CallCenterModuleProps {
  onNavigateToActivity?: () => void;
}

export const CallCenterModule: React.FC<CallCenterModuleProps> = ({ onNavigateToActivity }) => {
  const [callRecords, setCallRecords] = useState<CallRecord[]>(crmStore.getCallRecords());
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(callRecords[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);

  // New Call Modal State
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [simCallerName, setSimCallerName] = useState('');
  const [simCallerPhone, setSimCallerPhone] = useState('');
  const [simTranscript, setSimTranscript] = useState('');
  const [simSummary, setSimSummary] = useState('');
  const [simStatus, setSimStatus] = useState<'COMPLETED' | 'MISSED' | 'RECOVERED'>('RECOVERED');

  const refreshCalls = () => {
    setCallRecords([...crmStore.getCallRecords()]);
  };

  // Hero KPI calculation: Missed-Call Recovery Rate
  const totalCalls = callRecords.length;
  const missedCalls = callRecords.filter((c) => c.status === 'MISSED' || c.status === 'RECOVERED').length;
  const recoveredCalls = callRecords.filter((c) => c.status === 'RECOVERED').length;
  const recoveryRate = missedCalls > 0 ? Math.round((recoveredCalls / missedCalls) * 100) : 100;
  const estimatedRevenueRecovered = recoveredCalls * 1250; // $1,250 avg customer value

  const handleSimulateCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simCallerName || !simCallerPhone) return;

    const newCall = crmStore.addCallRecord({
      callerName: simCallerName,
      callerPhone: simCallerPhone,
      direction: 'INBOUND',
      durationSeconds: simStatus === 'MISSED' ? 0 : 195,
      status: simStatus,
      recordingUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
      transcript: simTranscript || `Caller: Hi, I'm calling from ${simCallerName}. We need an AI Voice Agent for after-hours calls.\nAgent: Great! I can schedule a demo right away.`,
      summary: simSummary || `Inbound call from ${simCallerName}. Interest expressed in AI Voice Agents.`,
      sentiment: 'POSITIVE',
      actionItems: ['Schedule Follow-up Demo', 'Send Scope Proposal'],
    });

    setSelectedCall(newCall);
    refreshCalls();
    setIsSimulateOpen(false);
    setSimCallerName('');
    setSimCallerPhone('');
    setSimTranscript('');
    setSimSummary('');
  };

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 crm-card p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <PhoneCall className="w-4 h-4" /> Live Voice & Call Command Center
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Voice Call Telemetry & Auto-Transcript Stream
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time audio stream feeds, AI summaries, and automated activity logging across accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSimulateOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" /> Simulate Live Call Ingestion
          </button>
        </div>
      </div>

      {/* ─── Hero KPI Section: Missed-Call Recovery Rate ─── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* HERO KPI 1: Missed-Call Recovery Rate */}
        <div className="md:col-span-2 crm-card p-6 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <PhoneMissed className="w-32 h-32" />
          </div>
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> Hero KPI • Recovery Telemetry
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE METRIC
              </span>
            </div>
            <div>
              <div className="text-4xl font-black tracking-tight text-white flex items-baseline gap-2">
                {recoveryRate}%
                <span className="text-sm font-semibold text-emerald-400">Missed-Call Recovery Rate</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Automated SMS & AI Voice overflow converted {recoveredCalls} of {missedCalls} missed leads into active appointments.
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span>Estimated Value Saved: <strong className="text-emerald-400">${estimatedRevenueRecovered.toLocaleString()} AUD</strong></span>
              <span className="font-mono text-[11px] text-indigo-300">n8n Missed-Call Text-Back Active</span>
            </div>
          </div>
        </div>

        <div className="crm-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Total Calls Processed</span>
            <PhoneCall className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalCalls}</div>
          <p className="text-[11px] text-slate-500 font-medium">Inbound & Outbound AI Audio Stream</p>
        </div>

        <div className="crm-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Recovered Leads</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{recoveredCalls}</div>
          <p className="text-[11px] text-slate-500 font-medium">Auto-converted via Missed-Call Text-Back</p>
        </div>
      </div>

      {/* ─── Call Feed + Transcript Detail Split View ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Call Stream List (5 cols) */}
        <div className="lg:col-span-5 crm-card p-4 rounded-2xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Recent Call Logs</h3>
            <span className="text-[11px] font-semibold text-slate-400">{callRecords.length} records</span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {callRecords.map((call) => {
              const isSelected = selectedCall?.id === call.id;
              return (
                <div
                  key={call.id}
                  onClick={() => setSelectedCall(call)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        call.status === 'RECOVERED' ? 'bg-emerald-100 text-emerald-700' :
                        call.status === 'MISSED' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {call.status === 'MISSED' ? <PhoneMissed className="w-4 h-4" /> : <PhoneIncoming className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{call.callerName}</h4>
                        <p className="text-[11px] text-slate-500 font-mono">{call.callerPhone}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      call.status === 'RECOVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      call.status === 'MISSED' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {call.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 italic">
                    "{call.summary || call.transcript}"
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {Math.floor(call.durationSeconds / 60)}m {call.durationSeconds % 60}s
                    </span>
                    <span>{new Date(call.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Transcript & AI Activity Reader (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedCall ? (
            <div className="crm-card p-6 rounded-2xl space-y-6">
              {/* Call Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{selectedCall.callerName}</h3>
                    <span className="text-xs text-slate-400 font-mono">({selectedCall.callerPhone})</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Call logged on {new Date(selectedCall.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Auto-Logged to Activity Feed
                  </span>
                </div>
              </div>

              {/* Audio Player Controls */}
              <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all shadow-md"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <div>
                    <span className="text-xs font-bold block text-slate-200">
                      {isPlaying ? 'Playing Audio Recording...' : 'Listen to Call Recording'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Duration: {Math.floor(selectedCall.durationSeconds / 60)}m {selectedCall.durationSeconds % 60}s
                    </span>
                  </div>
                </div>

                <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`h-full bg-indigo-500 transition-all ${isPlaying ? 'w-3/4 animate-pulse' : 'w-0'}`} />
                </div>
              </div>

              {/* AI Call Summary */}
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> AI Executive Call Summary
                </div>
                <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                  {selectedCall.summary || 'Summary generated automatically from call transcript.'}
                </p>
                {selectedCall.actionItems && selectedCall.actionItems.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {selectedCall.actionItems.map((action, i) => (
                      <span key={i} className="text-[10px] font-bold bg-white text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-indigo-500" /> {action}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Full Live Transcript */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-500" /> Complete Live Transcript
                </h4>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-mono text-slate-800 space-y-3 max-h-72 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {selectedCall.transcript}
                </div>
              </div>
            </div>
          ) : (
            <div className="crm-card p-12 text-center rounded-2xl text-slate-400">
              Select a call record to view transcript and AI summary.
            </div>
          )}
        </div>
      </div>

      {/* Simulate Live Call Ingestion Modal */}
      {isSimulateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" /> Simulate Inbound Call Ingestion
              </h3>
              <button onClick={() => setIsSimulateOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSimulateCall} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Caller Name / Business</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dave Thompson (Sydney Roofing)"
                  value={simCallerName}
                  onChange={(e) => setSimCallerName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="+61 400 998 877"
                  value={simCallerPhone}
                  onChange={(e) => setSimCallerPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Call Status</label>
                <select
                  value={simStatus}
                  onChange={(e) => setSimStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  <option value="RECOVERED">RECOVERED (Missed-Call Recovery)</option>
                  <option value="COMPLETED">COMPLETED (Normal Call)</option>
                  <option value="MISSED">MISSED (Unanswered Call)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Raw Transcript</label>
                <textarea
                  rows={3}
                  placeholder="Caller: Hi, we miss 15 calls a day..."
                  value={simTranscript}
                  onChange={(e) => setSimTranscript(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsSimulateOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700"
                >
                  Ingest & Transcribe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
