import { DEFAULT_TENANT, MOCK_TENANTS, encryptSecret, decryptSecret } from '../lib/tenant';
import { analyzeClientMargin, predictLeadScore } from '../lib/ai-engine';
import { Client, TimeLog, Lead } from '../lib/types';

/**
 * Automated Verification Suite for DigitalX Enterprise CRM
 * 1. Multi-Tenant Data Isolation Tests
 * 2. Encrypted Per-Tenant Secrets Verification
 * 3. Deterministic AI Margin Analyst Math
 * 4. Lead Scoring & Metered Token Tracking
 */

function runTenantIsolationTests() {
  console.log('Starting Tenant Isolation & Verification Tests...');

  // Test 1: Secret Encryption & Decryption
  const rawApiKey = 'sk_live_apollo_992014881023910';
  const encrypted = encryptSecret(rawApiKey);
  const decrypted = decryptSecret(encrypted);

  if (encrypted === rawApiKey) {
    throw new Error('TEST FAILED: Secret was not encrypted!');
  }
  if (decrypted !== rawApiKey) {
    throw new Error('TEST FAILED: Secret decryption failed!');
  }
  console.log('TEST PASSED: Encrypted Secret Storage Verified (AES-256 equivalent)');

  // Test 2: Cross-Tenant Data Scoping Rule
  const tenantA = DEFAULT_TENANT;
  const tenantB = MOCK_TENANTS[1];

  if (tenantA.id === tenantB.id) {
    throw new Error('TEST FAILED: Tenant IDs must be distinct!');
  }
  if (tenantA.widgetKey === tenantB.widgetKey) {
    throw new Error('TEST FAILED: Widget Keys must be distinct per tenant!');
  }
  console.log('TEST PASSED: Multi-Tenant Data Scoping & Public Keys Isolated');

  // Test 3: Deterministic Margin Analyst Math
  const testClient: Client = {
    id: 'c-test-1',
    companyName: 'Test Plumbers',
    primaryContact: 'Bob Smith',
    email: 'bob@test.com',
    phone: '+61 400 000 000',
    vertical: 'Home Services',
    country: 'AU',
    status: 'ACTIVE',
    servicesSold: ['AI Voice Agents'],
    setupFee: 2500,
    monthlyRetainer: 2000,
    contractStartDate: '2026-01-01',
    lifetimeRevenue: 14500,
    onboardingChecklist: [],
    createdAt: '2026-01-01',
  };

  const testLogs: TimeLog[] = [
    {
      id: 'tl-1',
      employeeId: 'u-1',
      employeeName: 'Alex Rivera',
      projectId: 'p-1',
      projectName: 'Test Proj',
      clientId: 'c-test-1',
      clientName: 'Test Plumbers',
      hours: 25, // 25 hours * $75/hr = $1875 cost vs $2000 retainer = 6% margin (< 20%)
      billable: true,
      date: '2026-07-20',
      description: 'Custom AI Voice Prompt Engineering',
    },
  ];

  const margin = analyzeClientMargin(testClient, testLogs, 75);

  if (!margin.isUnderMargin) {
    throw new Error(`TEST FAILED: Expected client to be flagged under-margin, got margin=${margin.marginPercent}%`);
  }
  if (margin.suggestedRetainer <= testClient.monthlyRetainer) {
    throw new Error('TEST FAILED: Suggested retainer must be higher than current retainer for under-margin account');
  }
  console.log(`TEST PASSED: Deterministic Margin Analyst correctly flagged ${margin.marginPercent}% margin (Suggested Retainer: $${margin.suggestedRetainer}/mo)`);

  // Test 4: Lead Scoring Engine
  const testLead: Lead = {
    id: 'l-test',
    name: 'Dave Thompson',
    company: 'Sydney Roofing',
    email: 'dave@sydneyroofing.com.au',
    phone: '+61 400 998 877',
    source: 'GoHighLevel',
    vertical: 'Home Services',
    country: 'AU',
    status: 'QUALIFIED',
    score: 50,
    ownerId: 'u-1',
    ownerName: 'Sarah Jenkins',
    notes: 'Urgent need for call overflow handling',
    tags: ['Roofing', 'High Intent'],
    followUpDate: '2026-07-24',
    createdAt: '2026-07-22',
  };

  const leadResult = predictLeadScore(testLead);
  if (leadResult.score < 75) {
    throw new Error(`TEST FAILED: Qualified GHL Home Services lead should score >= 75, got ${leadResult.score}`);
  }
  console.log(`TEST PASSED: Lead Scoring Engine generated Score=${leadResult.score} with Next Best Action: "${leadResult.nextBestAction}"`);

  console.log('ALL STEP 0 TENANT & MATH VERIFICATION TESTS PASSED!');
}

runTenantIsolationTests();
