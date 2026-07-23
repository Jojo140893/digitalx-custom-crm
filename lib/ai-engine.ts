import { Client, Lead, TimeLog, ProposalPhase, Invoice, CallRecord } from './types';
import { crmStore } from './store';

export interface MarginAnalysisResult {
  clientId: string;
  companyName: string;
  monthlyRetainer: number;
  totalLoggedHours: number;
  totalCost: number;
  marginPercent: number;
  isUnderMargin: boolean;
  suggestedRetainer: number;
  recommendation: string;
}

export interface LeadScoreResult {
  score: number;
  nextBestAction: string;
  reasons: string[];
}

export interface ClientHealthResult {
  healthScore: number;
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH';
  reasons: string[];
}

export interface ExecSummaryResult {
  summary: string;
  mrrGrowth: string;
  topRisk: string;
  actionItem: string;
}

/**
 * 1. AI Margin Analyst (Deterministic Calculation)
 * Pure math: Hours * Employee Rate vs Retainer Fee
 */
export function analyzeClientMargin(
  client: Client,
  timeLogs: TimeLog[],
  hourlyCostRate: number = 75
): MarginAnalysisResult {
  const clientLogs = timeLogs.filter((tl) => tl.clientId === client.id && tl.billable);
  const totalHours = clientLogs.reduce((sum, log) => sum + log.hours, 0);
  const totalCost = totalHours * hourlyCostRate;
  const retainer = client.monthlyRetainer || 1; // avoid divide by 0

  const profit = retainer - totalCost;
  const marginPercent = Math.round((profit / retainer) * 100);

  const isUnderMargin = marginPercent < 20;
  // Suggested retainer to hit 35% target margin
  const suggestedRetainer = Math.round(totalCost / 0.65);

  let recommendation = `Account is performing healthy at ${marginPercent}% margin.`;
  if (isUnderMargin) {
    recommendation = `⚠️ CRITICAL: Client is operating at ${marginPercent}% margin (${totalHours}h logged this month = $${totalCost} cost vs $${retainer} retainer). Recommend repricing retainer to $${suggestedRetainer.toLocaleString()}/mo.`;
  }

  return {
    clientId: client.id,
    companyName: client.companyName,
    monthlyRetainer: client.monthlyRetainer,
    totalLoggedHours: totalHours,
    totalCost,
    marginPercent,
    isUnderMargin,
    suggestedRetainer,
    recommendation,
  };
}

/**
 * 2. Predictive Lead Scoring & Next-Best-Action Engine
 * Combines structural lead heuristics with action synthesis
 */
export function predictLeadScore(lead: Lead): LeadScoreResult {
  let score = 50;
  const reasons: string[] = [];

  // Source quality weighting
  if (lead.source === 'GoHighLevel' || lead.source === 'Referral') {
    score += 20;
    reasons.push('High-converting source channel (+20)');
  } else if (lead.source === 'Meta Ads') {
    score += 10;
    reasons.push('Inbound ad interest (+10)');
  }

  // Vertical weighting (High-demand verticals for AI Voice Agents)
  if (['Home Services', 'Healthcare', 'Automotive'].includes(lead.vertical)) {
    score += 15;
    reasons.push(`High-demand AI Voice vertical: ${lead.vertical} (+15)`);
  }

  // Pipeline status weighting
  if (lead.status === 'QUALIFIED') score += 15;
  if (lead.status === 'PROPOSAL_SENT') score += 20;

  score = Math.min(98, Math.max(15, score));

  // Determine Next Best Action
  let nextBestAction = `Call ${lead.name} today at ${lead.company} to qualify AI Voice scope.`;
  if (lead.status === 'QUALIFIED') {
    nextBestAction = `Draft AI Voice & Automation proposal for ${lead.company} (${lead.vertical}).`;
  } else if (lead.status === 'PROPOSAL_SENT') {
    nextBestAction = `Follow up with ${lead.name} on e-signature & setup invoice payment.`;
  } else if (score >= 75) {
    nextBestAction = `🔥 High-priority lead: Schedule discovery call today.`;
  }

  // Meter usage
  crmStore.recordAiUsage(150, 0, 0);

  return {
    score,
    nextBestAction,
    reasons,
  };
}

/**
 * 3. Client Health & Churn Risk Engine
 */
export function calculateClientHealth(
  client: Client,
  invoices: Invoice[],
  timeLogs: TimeLog[]
): ClientHealthResult {
  let healthScore = 85;
  const reasons: string[] = [];

  const clientInvoices = invoices.filter((i) => i.clientId === client.id);
  const overdueCount = clientInvoices.filter((i) => i.status === 'OVERDUE').length;

  if (overdueCount > 0) {
    healthScore -= 25 * overdueCount;
    reasons.push(`${overdueCount} overdue invoice(s) pending payment`);
  }

  const margin = analyzeClientMargin(client, timeLogs);
  if (margin.isUnderMargin) {
    healthScore -= 20;
    reasons.push(`Low operational margin (${margin.marginPercent}%)`);
  }

  healthScore = Math.max(10, Math.min(100, healthScore));

  let riskTier: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (healthScore < 50) riskTier = 'HIGH';
  else if (healthScore < 75) riskTier = 'MEDIUM';

  return {
    healthScore,
    riskTier,
    reasons,
  };
}

/**
 * 4. AI Proposal Scope & Pricing Drafter
 */
export function generateAiProposal(
  companyName: string,
  vertical: string,
  transcriptOrNotes: string
): { title: string; phases: ProposalPhase[]; totalValue: number } {
  const isEnterprise = transcriptOrNotes.toLowerCase().includes('enterprise') || transcriptOrNotes.toLowerCase().includes('multi-location');
  
  const baseMultiplier = isEnterprise ? 2.5 : 1.0;

  const phases: ProposalPhase[] = [
    {
      phaseName: 'Phase 1: Discovery, Voice Agent Prompt & Twilio Setup',
      scope: `Custom LLM prompt design for ${vertical}, Twilio/Vapi phone routing, and test call simulation based on discovery notes: "${transcriptOrNotes.slice(0, 100)}..."`,
      timeline: '1 Week',
      cost: Math.round(2500 * baseMultiplier),
    },
    {
      phaseName: 'Phase 2: CRM & n8n Webhook Integration',
      scope: 'Live call transcript injection into CRM Activity feed, automated calendar booking, and SMS missed-call recovery triggers.',
      timeline: '2 Weeks',
      cost: Math.round(3500 * baseMultiplier),
    },
    {
      phaseName: 'Phase 3: Staff Training & Ongoing AI Retainer',
      scope: 'Team onboarding, custom analytics dashboard, and monthly 24/7 AI agent monitoring.',
      timeline: 'Ongoing',
      cost: Math.round(1500 * baseMultiplier),
    },
  ];

  const totalValue = phases.reduce((sum, p) => sum + p.cost, 0);

  // Meter proposal generation
  crmStore.recordAiUsage(450, 0, 1);

  return {
    title: `AI Voice & Automation Scope — ${companyName}`,
    phases,
    totalValue,
  };
}

/**
 * 5. Automated Invoice Chaser Drafter
 */
export function generateInvoiceReminder(
  invoice: Invoice,
  client: Client,
  stage: 'Gentle' | 'Firm' | 'Urgent'
): string {
  if (stage === 'Gentle') {
    return `Hi ${client.primaryContact}, just a friendly reminder that invoice ${invoice.invoiceNumber} ($${invoice.amount.toLocaleString()}) for ${client.companyName} was due on ${invoice.dueDate}. Please let us know once processed!`;
  }
  if (stage === 'Firm') {
    return `Hello ${client.primaryContact}, invoice ${invoice.invoiceNumber} ($${invoice.amount.toLocaleString()}) is now overdue. Please remit payment today to maintain uninterrupted AI voice agent services.`;
  }
  return `URGENT NOTICE: Invoice ${invoice.invoiceNumber} ($${invoice.amount.toLocaleString()}) for ${client.companyName} is severely overdue. Account services will be suspended if not cleared within 24 hours.`;
}

/**
 * 6. Natural Language Search Parser
 */
export function parseNaturalLanguageQuery(query: string): {
  type: 'UNDER_MARGIN' | 'OVERDUE_INVOICES' | 'HIGH_LEADS' | 'MISSED_CALLS' | 'GENERAL';
  filterDescription: string;
} {
  const q = query.toLowerCase();
  if (q.includes('margin') || q.includes('under 20%') || q.includes('unprofitable')) {
    return {
      type: 'UNDER_MARGIN',
      filterDescription: 'Showing clients with operational margin below 20%',
    };
  }
  if (q.includes('overdue') || q.includes('unpaid') || q.includes('chase')) {
    return {
      type: 'OVERDUE_INVOICES',
      filterDescription: 'Showing unpaid and overdue invoices needing attention',
    };
  }
  if (q.includes('lead') || q.includes('today') || q.includes('hot') || q.includes('best action')) {
    return {
      type: 'HIGH_LEADS',
      filterDescription: 'Showing high-scoring open leads ready for contact',
    };
  }
  if (q.includes('call') || q.includes('missed') || q.includes('transcript')) {
    return {
      type: 'MISSED_CALLS',
      filterDescription: 'Showing recent call records and missed-call recovery feeds',
    };
  }
  return {
    type: 'GENERAL',
    filterDescription: `Filtered search for "${query}"`,
  };
}

/**
 * 7. Plain-English Executive Summary Generator
 */
export function generateExecSummary(
  leadsCount: number,
  mrr: number,
  missedCallRecoveryRate: number,
  underMarginCount: number
): ExecSummaryResult {
  const summary = `MRR is running at $${mrr.toLocaleString()}/mo across active accounts. Missed-call recovery rate is sitting strong at ${missedCallRecoveryRate}%, while ${leadsCount} high-intent leads are ready in the sales pipeline.`;
  const mrrGrowth = `+18% MoM growth driven by AI Voice Retainers`;
  const topRisk = underMarginCount > 0 ? `${underMarginCount} client account(s) operating below 20% target margin` : 'All active accounts operating above target margin';
  const actionItem = underMarginCount > 0 ? 'Review AI Margin Analyst re-price suggestions for under-margin accounts.' : 'Scale Apollo lead outreach sequence to Home Services leads.';

  // Meter summary usage
  crmStore.recordAiUsage(220, 0, 0);

  return {
    summary,
    mrrGrowth,
    topRisk,
    actionItem,
  };
}
