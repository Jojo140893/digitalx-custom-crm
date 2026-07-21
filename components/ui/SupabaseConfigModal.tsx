'use client';

import React, { useState, useEffect } from 'react';
import { X, Database, Check, RefreshCw, Copy, ExternalLink, ShieldCheck, CloudUpload, Server, AlertCircle } from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig, checkSupabaseHealth, syncAllTablesToSupabase } from '@/lib/supabase';
import { crmStore } from '@/lib/store';
import { toast } from '@/lib/toast';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusInfo, setStatusInfo] = useState<{ status: 'CONNECTED' | 'READY' | 'DISCONNECTED'; message: string }>({
    status: 'READY',
    message: 'Initializing diagnostic check...',
  });
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = getSupabaseConfig();
      setUrl(config.url);
      setAnonKey(config.anonKey);
      runHealthCheck();
    }
  }, [isOpen]);

  const runHealthCheck = async () => {
    setIsTesting(true);
    const health = await checkSupabaseHealth();
    setStatusInfo(health);
    setIsTesting(false);
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    saveSupabaseConfig(url.trim(), anonKey.trim());
    const health = await checkSupabaseHealth();
    setStatusInfo(health);
    setIsTesting(false);
    if (health.status === 'CONNECTED') {
      toast.success('Supabase Connected!', health.message);
    } else {
      toast.info('Credentials Saved', health.message);
    }
  };

  const handleSyncToCloud = async () => {
    setIsSyncing(true);
    const state = crmStore.getState();
    const result = await syncAllTablesToSupabase(state);
    setIsSyncing(false);
    if (result.success) {
      toast.success('Cloud Sync Complete', `Synced ${result.count} records to Supabase tables.`);
      runHealthCheck();
    } else {
      toast.error('Sync Encountered Issues', result.message);
    }
  };

  const sqlScript = `-- DigitalX Enterprise CRM — Supabase PostgreSQL Schema Generator
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Leads Table
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  vertical TEXT,
  country TEXT,
  estimatedValue NUMERIC,
  status TEXT,
  assignedTo TEXT,
  source TEXT,
  notes TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Clients Table
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  companyName TEXT NOT NULL,
  primaryContact TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  vertical TEXT,
  country TEXT,
  monthlyRetainer NUMERIC,
  onboardingDate TEXT,
  status TEXT,
  accountOwner TEXT,
  gDriveUrl TEXT,
  slackChannel TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  clientId TEXT,
  clientName TEXT NOT NULL,
  name TEXT NOT NULL,
  serviceType TEXT,
  oneOffFee NUMERIC,
  status TEXT,
  progress INTEGER,
  dueDate TEXT,
  assignedTeam TEXT[],
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  invoiceNumber TEXT NOT NULL,
  clientId TEXT,
  clientName TEXT NOT NULL,
  amount NUMERIC,
  dueDate TEXT,
  status TEXT,
  description TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  dueDate TEXT,
  priority TEXT,
  status TEXT,
  assignedTo TEXT,
  category TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) or public access policies
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write for CRM anon key" ON leads FOR ALL USING (true);
CREATE POLICY "Allow public read/write for CRM anon key" ON clients FOR ALL USING (true);
CREATE POLICY "Allow public read/write for CRM anon key" ON projects FOR ALL USING (true);
CREATE POLICY "Allow public read/write for CRM anon key" ON invoices FOR ALL USING (true);
CREATE POLICY "Allow public read/write for CRM anon key" ON tasks FOR ALL USING (true);
`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    toast.success('SQL Copied', 'Paste this script into your Supabase SQL Editor.');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-linear-to-r from-slate-50 to-indigo-50/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Supabase Database & Cloud Sync</h2>
              <p className="text-xs text-slate-600 font-medium">Connect your Supabase PostgreSQL cloud database or manage stateful local storage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Diagnostic Card */}
          <div className="p-4 rounded-2xl border bg-slate-50/80 border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Database Connection Status</span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                  statusInfo.status === 'CONNECTED'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-indigo-100 text-indigo-800 border-indigo-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${statusInfo.status === 'CONNECTED' ? 'bg-emerald-600 animate-pulse' : 'bg-indigo-600'}`} />
                {statusInfo.status === 'CONNECTED' ? 'Connected to Supabase Cloud' : 'Stateful Local Engine Active'}
              </span>
            </div>

            <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
              {statusInfo.message}
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={runHealthCheck}
                disabled={isTesting}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-indigo-600' : ''}`} />
                <span>Re-Test Connection</span>
              </button>

              <button
                onClick={handleSyncToCloud}
                disabled={isSyncing}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
              >
                <CloudUpload className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
                <span>{isSyncing ? 'Syncing to Cloud...' : 'Sync Local CRM Data to Supabase'}</span>
              </button>
            </div>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSaveCredentials} className="space-y-4 p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> Supabase API Credentials Configuration
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Project URL (`NEXT_PUBLIC_SUPABASE_URL`)</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-project-id.supabase.co"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 text-xs font-medium placeholder-slate-400 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Anon Public Key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)</label>
              <input
                type="password"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJh..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 text-xs font-mono placeholder-slate-400 bg-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">Saved locally in browser & persistent across reloads.</span>
              <button
                type="submit"
                disabled={isTesting}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Save Credentials & Connect</span>
              </button>
            </div>
          </form>

          {/* SQL Setup Generator */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" /> Supabase SQL Table Setup Script
              </h3>
              <button
                onClick={copySql}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Need tables created in your Supabase project? Copy this SQL script and execute it in your{' '}
              <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold underline inline-flex items-center gap-0.5">
                Supabase SQL Editor <ExternalLink className="w-3 h-3" />
              </a>.
            </p>
            <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-40 border border-slate-800">
              {sqlScript}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">DigitalX Solutions Enterprise Data Governance</p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all shadow-xs"
          >
            Done & Close
          </button>
        </div>
      </div>
    </div>
  );
};
