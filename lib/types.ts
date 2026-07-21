export type UserRole = 'ADMIN' | 'MEMBER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  phone?: string;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE';
  startDate: string;
  skills: string[];
  certifications: string[];
  experienceNotes: string;
  cvUrl?: string;
  rating: number;
  workloadLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export type LeadSource = 'Apollo.io' | 'Meta Ads' | 'Website Form' | 'GoHighLevel' | 'Referral';
export type LeadVertical = 'Home Services' | 'Healthcare' | 'Automotive' | 'Beauty & Wellness' | 'Professional Services' | 'Hospitality';
export type CountryCode = 'AU' | 'US';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL_SENT' | 'NEGOTIATION' | 'WON' | 'LOST';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: LeadSource;
  vertical: LeadVertical;
  country: CountryCode;
  status: LeadStatus;
  score: number;
  ownerId: string;
  ownerName: string;
  notes: string;
  tags: string[];
  followUpDate: string;
  createdAt: string;
}

export interface OnboardingItem {
  id: string;
  task: string;
  done: boolean;
}

export interface Client {
  id: string;
  leadId?: string;
  companyName: string;
  primaryContact: string;
  email: string;
  phone: string;
  vertical: LeadVertical;
  country: CountryCode;
  status: 'ACTIVE' | 'CHURNED';
  servicesSold: string[];
  setupFee: number;
  monthlyRetainer: number;
  contractStartDate: string;
  exitDate?: string;
  churnReason?: string;
  lifetimeRevenue: number;
  reactivationNotes?: string;
  onboardingChecklist: OnboardingItem[];
  createdAt: string;
}

export type ServiceType =
  | 'AI Voice Agents'
  | 'GoHighLevel Setup'
  | 'Missed-Call Text-Back'
  | 'n8n Automation'
  | 'Chatbots'
  | 'Meta Ads'
  | 'Web Design'
  | 'Analytics Dashboard';

export type ProjectStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  serviceType: ServiceType;
  status: ProjectStatus;
  targetDelivery: string;
  expectedStartDate?: string;
  completionDate?: string;
  finalInvoiceValue?: number;
  blockerNotes?: string;
  delayReason?: string;
  testimonialQuote?: string;
  csatRating?: number; // 1 to 5
  assignees: string[];
  tasksCount?: number;
  completedTasksCount?: number;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId?: string;
  projectName?: string;
  clientId?: string;
  clientName?: string;
  title: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueDate: string;
  assignedTo: string;
  assignedId: string;
  estimatedHours: number;
  loggedHours: number;
  createdAt: string;
}

export interface ProposalPhase {
  phaseName: string;
  scope: string;
  timeline: string;
  cost: number;
}

export interface Proposal {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  phases: ProposalPhase[];
  version: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED';
  totalValue: number;
  sentDate: string;
  eSigned: boolean;
  eSignatureData?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  amount: number;
  type: 'SETUP_FEE' | 'MONTHLY_RETAINER' | 'CUSTOM';
  issueDate: string;
  dueDate: string;
  status: 'PAID' | 'UNPAID' | 'OVERDUE';
  paidDate?: string;
}

export interface Activity {
  id: string;
  leadId?: string;
  clientId?: string;
  entityName: string;
  employeeId: string;
  employeeName: string;
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE' | 'SYSTEM';
  title: string;
  description: string;
  loggedAt: string;
}

export interface TimeLog {
  id: string;
  employeeId: string;
  employeeName: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  hours: number;
  billable: boolean;
  date: string;
  description: string;
}

export interface AuditLog {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: string;
  details: string;
  timestamp: string;
}

export interface WebhookLog {
  id: string;
  source: 'GoHighLevel' | 'Apollo.io' | 'n8n' | 'Meta Ads' | 'GA4';
  payload: Record<string, any>;
  receivedAt: string;
  status: 'PROCESSED' | 'FAILED';
}
