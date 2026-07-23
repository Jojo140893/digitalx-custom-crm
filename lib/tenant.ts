import { Tenant } from './types';

// Default agency tenant
export const DEFAULT_TENANT: Tenant = {
  id: 'tenant-digitalx',
  name: 'DigitalX AI Agency',
  slug: 'digitalx',
  logoUrl: '/digitalx-logo.svg',
  primaryColor: '#4f46e5', // Indigo-600
  domain: 'digitalx.ai',
  plan: 'ENTERPRISE',
  widgetKey: 'wk_live_digitalx_994821',
  encryptedSecrets: {},
  aiTokensUsed: 142500,
  voiceMinutesUsed: 420,
  proposalsGenerated: 18,
  createdAt: '2026-01-01',
  updatedAt: '2026-07-23',
};

export const MOCK_TENANTS: Tenant[] = [
  DEFAULT_TENANT,
  {
    id: 'tenant-apex',
    name: 'Apex Home Services',
    slug: 'apex-home',
    logoUrl: '/apex-logo.svg',
    primaryColor: '#059669', // Emerald-600
    domain: 'apexhome.com',
    plan: 'AGENCY',
    widgetKey: 'wk_live_apex_338192',
    encryptedSecrets: {},
    aiTokensUsed: 62100,
    voiceMinutesUsed: 185,
    proposalsGenerated: 8,
    createdAt: '2026-03-15',
    updatedAt: '2026-07-20',
  },
  {
    id: 'tenant-glow',
    name: 'Glow Beauty & Wellness',
    slug: 'glow-beauty',
    logoUrl: '/glow-logo.svg',
    primaryColor: '#db2777', // Pink-600
    domain: 'glowbeauty.com.au',
    plan: 'STARTER',
    widgetKey: 'wk_live_glow_771204',
    encryptedSecrets: {},
    aiTokensUsed: 18400,
    voiceMinutesUsed: 45,
    proposalsGenerated: 3,
    createdAt: '2026-05-10',
    updatedAt: '2026-07-22',
  },
];

// Simple obfuscation/encryption helper for per-tenant integration credentials
export function encryptSecret(secret: string): string {
  if (!secret) return '';
  const encoded = Buffer.from(secret).toString('base64');
  return `enc_v1_${encoded}`;
}

export function decryptSecret(encrypted: string): string {
  if (!encrypted || !encrypted.startsWith('enc_v1_')) return encrypted || '';
  const raw = encrypted.replace('enc_v1_', '');
  return Buffer.from(raw, 'base64').toString('utf-8');
}
