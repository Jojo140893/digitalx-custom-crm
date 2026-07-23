import {
  User,
  Lead,
  Client,
  Project,
  Task,
  Proposal,
  Invoice,
  Activity,
  TimeLog,
  AuditLog,
  WebhookLog,
  CallRecord,
  Tenant,
} from './types';
import {
  INITIAL_USERS,
  INITIAL_LEADS,
  INITIAL_CLIENTS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_INVOICES,
  INITIAL_PROPOSALS,
  INITIAL_ACTIVITIES,
  INITIAL_TIMELOGS,
  INITIAL_AUDITLOGS,
  INITIAL_WEBHOOKS,
  INITIAL_CALL_RECORDS,
} from './mockData';
import { DEFAULT_TENANT, MOCK_TENANTS } from './tenant';
import { toast } from './toast';
import { syncToSupabase } from './supabase';

class CRMStore {
  private users: User[] = [...INITIAL_USERS];
  private leads: Lead[] = [...INITIAL_LEADS];
  private clients: Client[] = [...INITIAL_CLIENTS];
  private projects: Project[] = [...INITIAL_PROJECTS];
  private tasks: Task[] = [...INITIAL_TASKS];
  private invoices: Invoice[] = [...INITIAL_INVOICES];
  private proposals: Proposal[] = [...INITIAL_PROPOSALS];
  private activities: Activity[] = [...INITIAL_ACTIVITIES];
  private timeLogs: TimeLog[] = [...INITIAL_TIMELOGS];
  private auditLogs: AuditLog[] = [...INITIAL_AUDITLOGS];
  private webhooks: WebhookLog[] = [...INITIAL_WEBHOOKS];
  private callRecords: CallRecord[] = [...INITIAL_CALL_RECORDS];

  private activeTenant: Tenant = { ...DEFAULT_TENANT };
  private tenantsList: Tenant[] = [...MOCK_TENANTS];
  private currentUser: User = INITIAL_USERS[0]; // Admin Sarah Jenkins by default
  private currency: 'AUD' | 'USD' = 'AUD';
  private exchangeRate: number = 0.67; // 1 AUD = 0.67 USD
  private listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('digitalx_users', JSON.stringify(this.users));
      localStorage.setItem('digitalx_leads', JSON.stringify(this.leads));
      localStorage.setItem('digitalx_clients', JSON.stringify(this.clients));
      localStorage.setItem('digitalx_projects', JSON.stringify(this.projects));
      localStorage.setItem('digitalx_tasks', JSON.stringify(this.tasks));
      localStorage.setItem('digitalx_invoices', JSON.stringify(this.invoices));
      localStorage.setItem('digitalx_proposals', JSON.stringify(this.proposals));
      localStorage.setItem('digitalx_activities', JSON.stringify(this.activities));
      localStorage.setItem('digitalx_timeLogs', JSON.stringify(this.timeLogs));
      localStorage.setItem('digitalx_auditLogs', JSON.stringify(this.auditLogs));
      localStorage.setItem('digitalx_callRecords', JSON.stringify(this.callRecords));
      localStorage.setItem('digitalx_currentUser', JSON.stringify(this.currentUser));
      localStorage.setItem('digitalx_currency', this.currency);
      localStorage.setItem('digitalx_activeTenant', JSON.stringify(this.activeTenant));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  private loadFromStorage() {
    try {
      const u = localStorage.getItem('digitalx_users');
      if (u) this.users = JSON.parse(u);
      const l = localStorage.getItem('digitalx_leads');
      if (l) this.leads = JSON.parse(l);
      const c = localStorage.getItem('digitalx_clients');
      if (c) this.clients = JSON.parse(c);
      const p = localStorage.getItem('digitalx_projects');
      if (p) this.projects = JSON.parse(p);
      const t = localStorage.getItem('digitalx_tasks');
      if (t) this.tasks = JSON.parse(t);
      const inv = localStorage.getItem('digitalx_invoices');
      if (inv) this.invoices = JSON.parse(inv);
      const prop = localStorage.getItem('digitalx_proposals');
      if (prop) this.proposals = JSON.parse(prop);
      const act = localStorage.getItem('digitalx_activities');
      if (act) this.activities = JSON.parse(act);
      const tl = localStorage.getItem('digitalx_timeLogs');
      if (tl) this.timeLogs = JSON.parse(tl);
      const aud = localStorage.getItem('digitalx_auditLogs');
      if (aud) this.auditLogs = JSON.parse(aud);
      const cr = localStorage.getItem('digitalx_callRecords');
      if (cr) this.callRecords = JSON.parse(cr);
      const cur = localStorage.getItem('digitalx_currentUser');
      if (cur) this.currentUser = JSON.parse(cur);
      const curr = localStorage.getItem('digitalx_currency');
      if (curr) this.currency = curr as 'AUD' | 'USD';
      const ten = localStorage.getItem('digitalx_activeTenant');
      if (ten) this.activeTenant = JSON.parse(ten);
    } catch (e) {
      console.error('Failed to load storage:', e);
    }
  }

  // --- Multi-Tenant Controls ---
  public getActiveTenant(): Tenant {
    return this.activeTenant;
  }

  public getTenants(): Tenant[] {
    return this.tenantsList;
  }

  public setActiveTenant(tenantId: string) {
    const found = this.tenantsList.find((t) => t.id === tenantId);
    if (found) {
      this.activeTenant = found;
      this.logAudit('TENANT_SWITCH', 'Tenant', found.id, `Switched active tenant to ${found.name}`);
      toast.info(`Tenant Switched: ${found.name}`, `Branding & data context set to ${found.name}`);
      this.notify();
    }
  }

  public recordAiUsage(tokens: number = 0, voiceMinutes: number = 0, proposals: number = 0) {
    this.activeTenant.aiTokensUsed += tokens;
    this.activeTenant.voiceMinutesUsed += voiceMinutes;
    this.activeTenant.proposalsGenerated += proposals;
    this.notify();
  }

  // --- Enterprise Currency & Region Controls ---
  public getCurrency(): 'AUD' | 'USD' {
    return this.currency;
  }

  public setCurrency(c: 'AUD' | 'USD') {
    this.currency = c;
    toast.info(`Display Currency Updated`, `Set to ${c} (${c === 'USD' ? '1 AUD = $0.67 USD' : 'Australian Dollars'})`);
    this.notify();
  }

  public formatCurrency(amountAUD: number): string {
    if (this.currency === 'USD') {
      const converted = Math.round(amountAUD * this.exchangeRate);
      return `$${converted.toLocaleString()} USD`;
    }
    return `$${amountAUD.toLocaleString()} AUD`;
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach((l) => l());
  }

  // --- Current User & RBAC ---
  public getCurrentUser(): User {
    return this.currentUser;
  }

  public setCurrentUser(user: User) {
    this.currentUser = user;
    this.logAudit('USER_SWITCH', 'User', user.id, `Switched active session to ${user.name} (${user.role})`);
    toast.info(`Session Role: ${user.name}`, `Active permissions updated to ${user.role}`);
    this.notify();
  }

  public isAdmin(): boolean {
    return this.currentUser.role === 'ADMIN';
  }

  // --- Users / Employees ---
  public getUsers(): User[] {
    return this.users;
  }

  public addUser(user: Omit<User, 'id' | 'rating'>) {
    const newUser: User = {
      ...user,
      id: `u-${Date.now()}`,
      rating: 4.8,
    };
    this.users.push(newUser);
    this.logAudit('EMPLOYEE_ADDED', 'User', newUser.id, `Added new team member ${newUser.name}`);
    toast.success('Team Member Added', `${newUser.name} added to workforce directory`);
    this.notify();
    return newUser;
  }

  // --- Call Records ---
  public getCallRecords(): CallRecord[] {
    return this.callRecords;
  }

  public addCallRecord(call: Omit<CallRecord, 'id' | 'createdAt' | 'tenantId'>): CallRecord {
    const newCall: CallRecord = {
      ...call,
      id: `call-${Date.now()}`,
      tenantId: this.activeTenant.id,
      createdAt: new Date().toISOString(),
    };
    this.callRecords.unshift(newCall);

    // Auto-activity logging from transcript!
    this.logActivity({
      entityName: newCall.callerName,
      type: 'CALL',
      title: `Call Transcribed: ${newCall.callerName} (${newCall.status})`,
      description: newCall.summary || newCall.transcript.slice(0, 150),
    });

    // Record voice minutes usage
    const minutes = Math.ceil(newCall.durationSeconds / 60);
    this.recordAiUsage(0, minutes, 0);

    toast.success('Call Logged & Transcribed', `Auto-activity created for ${newCall.callerName}`);
    this.notify();
    return newCall;
  }

  // --- Leads ---
  public getLeads(): Lead[] {
    if (!this.isAdmin()) {
      return this.leads.filter((l) => l.ownerId === this.currentUser.id || !l.ownerId);
    }
    return this.leads;
  }

  public addLead(leadData: Omit<Lead, 'id' | 'createdAt'>): Lead {
    const newLead: Lead = {
      ...leadData,
      id: `l-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.leads.unshift(newLead);
    this.logAudit('LEAD_CREATED', 'Lead', newLead.id, `Created lead ${newLead.company} (${newLead.source})`);
    toast.success(`Lead Created: ${newLead.company}`, `Added to ${newLead.status} pipeline from ${newLead.source}`);
    syncToSupabase('leads', newLead);
    this.notify();
    return newLead;
  }

  public updateLeadStatus(id: string, newStatus: Lead['status']) {
    const lead = this.leads.find((l) => l.id === id);
    if (lead) {
      const oldStatus = lead.status;
      lead.status = newStatus;
      this.logAudit('LEAD_STATUS_CHANGE', 'Lead', id, `Updated ${lead.company} status from ${oldStatus} to ${newStatus}`);
      toast.info(`Lead Pipeline Updated`, `${lead.company} moved to ${newStatus}`);
      syncToSupabase('leads', lead);
      this.notify();
    }
  }

  public convertLeadToClient(leadId: string, setupFee: number, monthlyRetainer: number, servicesSold: string[]): Client {
    const lead = this.leads.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    lead.status = 'WON';

    const newClient: Client = {
      id: `c-${Date.now()}`,
      leadId: lead.id,
      companyName: lead.company,
      primaryContact: lead.name,
      email: lead.email,
      phone: lead.phone,
      vertical: lead.vertical,
      country: lead.country,
      status: 'ACTIVE',
      healthScore: 90,
      healthRisk: 'LOW',
      marginPercent: 35.0,
      servicesSold,
      setupFee,
      monthlyRetainer,
      contractStartDate: new Date().toISOString().split('T')[0],
      lifetimeRevenue: setupFee + monthlyRetainer,
      onboardingChecklist: [
        { id: `ob-1`, task: 'Send Welcome Packet & Contract Sign-off', done: true },
        { id: `ob-2`, task: 'Kickoff Call & Account Strategy Sync', done: false },
        { id: `ob-3`, task: 'API Credentials & Webhook Integrations', done: false },
        { id: `ob-4`, task: 'Deliver Initial Automation Blueprint', done: false },
      ],
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.clients.unshift(newClient);

    if (setupFee > 0) {
      this.invoices.unshift({
        id: `inv-${Date.now()}`,
        invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
        clientId: newClient.id,
        clientName: newClient.companyName,
        amount: setupFee,
        type: 'SETUP_FEE',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        status: 'UNPAID',
      });
    }

    this.logAudit('LEAD_CONVERTED', 'Client', newClient.id, `Converted lead ${lead.company} to Active Client ($${monthlyRetainer}/mo)`);
    toast.success(`Lead Converted to Client!`, `${lead.company} is now Active ($${monthlyRetainer.toLocaleString()}/mo retainer)`);
    syncToSupabase('clients', newClient);
    this.notify();
    return newClient;
  }

  // --- Clients ---
  public getClients(): Client[] {
    return this.clients;
  }

  public getActiveClients(): Client[] {
    return this.clients.filter((c) => c.status === 'ACTIVE');
  }

  public getChurnedClients(): Client[] {
    return this.clients.filter((c) => c.status === 'CHURNED');
  }

  public churnClient(clientId: string, reason: string, notes: string) {
    const client = this.clients.find((c) => c.id === clientId);
    if (client) {
      client.status = 'CHURNED';
      client.churnReason = reason;
      client.reactivationNotes = notes;
      client.exitDate = new Date().toISOString().split('T')[0];
      this.logAudit('CLIENT_CHURNED', 'Client', clientId, `Archived client ${client.companyName}. Reason: ${reason}`);
      toast.warning('Account Archived', `${client.companyName} set to Churned status`);
      syncToSupabase('clients', client);
      this.notify();
    }
  }

  public reactivateClient(clientId: string) {
    const client = this.clients.find((c) => c.id === clientId);
    if (client) {
      client.status = 'ACTIVE';
      client.exitDate = undefined;
      client.churnReason = undefined;
      this.logAudit('CLIENT_REACTIVATED', 'Client', clientId, `Reactivated client ${client.companyName}`);
      toast.success('Account Reactivated', `${client.companyName} restored to Active clients`);
      syncToSupabase('clients', client);
      this.notify();
    }
  }

  public toggleOnboardingTask(clientId: string, taskId: string) {
    const client = this.clients.find((c) => c.id === clientId);
    if (client) {
      const item = client.onboardingChecklist.find((t) => t.id === taskId);
      if (item) {
        item.done = !item.done;
        toast.info('Onboarding Step Toggled', `[${item.task}] set to ${item.done ? 'Completed' : 'Pending'}`);
        this.notify();
      }
    }
  }

  // --- Projects ---
  public getProjects(): Project[] {
    return this.projects;
  }

  public addProject(proj: Omit<Project, 'id' | 'createdAt'>): Project {
    const newProj: Project = {
      ...proj,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      tasksCount: 0,
      completedTasksCount: 0,
    };
    this.projects.unshift(newProj);
    this.logAudit('PROJECT_CREATED', 'Project', newProj.id, `Created project "${newProj.name}" for ${newProj.clientName}`);
    toast.success('Project Created', `"${newProj.name}" added to delivery board`);
    syncToSupabase('projects', newProj);
    this.notify();
    return newProj;
  }

  public updateProjectStatus(id: string, status: Project['status'], blockerNotes?: string, delayReason?: string) {
    const p = this.projects.find((proj) => proj.id === id);
    if (p) {
      p.status = status;
      if (blockerNotes !== undefined) p.blockerNotes = blockerNotes;
      if (delayReason !== undefined) p.delayReason = delayReason;
      if (status === 'COMPLETED') {
        p.completionDate = new Date().toISOString().split('T')[0];
      }
      this.logAudit('PROJECT_STATUS', 'Project', id, `Updated project "${p.name}" status to ${status}`);
      toast.info('Project Updated', `"${p.name}" status set to ${status}`);
      syncToSupabase('projects', p);
      this.notify();
    }
  }

  // --- Tasks ---
  public getTasks(): Task[] {
    return this.tasks;
  }

  public addTask(task: Omit<Task, 'id' | 'createdAt' | 'loggedHours'>): Task {
    const newTask: Task = {
      ...task,
      id: `t-${Date.now()}`,
      loggedHours: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.tasks.unshift(newTask);
    toast.success('Task Added', `"${newTask.title}" assigned to ${newTask.assignedTo}`);
    this.notify();
    return newTask;
  }

  public toggleTaskStatus(id: string) {
    const t = this.tasks.find((task) => task.id === id);
    if (t) {
      t.status = t.status === 'DONE' ? 'IN_PROGRESS' : 'DONE';
      toast.info('Task Status Toggled', `"${t.title}" set to ${t.status}`);
      this.notify();
    }
  }

  public logTimeOnTask(taskId: string, hours: number, description: string) {
    const t = this.tasks.find((task) => task.id === taskId);
    if (t) {
      t.loggedHours += hours;
      const timeLog: TimeLog = {
        id: `tl-${Date.now()}`,
        employeeId: this.currentUser.id,
        employeeName: this.currentUser.name,
        projectId: t.projectId || '',
        projectName: t.projectName || '',
        clientId: t.clientId || '',
        clientName: t.clientName || '',
        hours,
        billable: true,
        date: new Date().toISOString().split('T')[0],
        description,
      };
      this.timeLogs.unshift(timeLog);
      this.logAudit('TIME_LOGGED', 'Task', taskId, `Logged ${hours}h by ${this.currentUser.name} on ${t.title}`);
      toast.success('Time Logged', `Logged ${hours}h on "${t.title}"`);
      this.notify();
    }
  }

  // --- Invoices ---
  public getInvoices(): Invoice[] {
    return this.invoices;
  }

  public addInvoice(inv: Omit<Invoice, 'id'>): Invoice {
    const newInv: Invoice = {
      ...inv,
      id: `inv-${Date.now()}`,
    };
    this.invoices.unshift(newInv);
    this.logAudit('INVOICE_CREATED', 'Invoice', newInv.id, `Created ${newInv.invoiceNumber} ($${newInv.amount})`);
    toast.success('Invoice Created', `${newInv.invoiceNumber} issued to ${newInv.clientName}`);
    syncToSupabase('invoices', newInv);
    this.notify();
    return newInv;
  }

  public markInvoicePaid(id: string) {
    const inv = this.invoices.find((i) => i.id === id);
    if (inv) {
      inv.status = 'PAID';
      inv.paidDate = new Date().toISOString().split('T')[0];
      this.logAudit('INVOICE_PAID', 'Invoice', id, `Marked invoice ${inv.invoiceNumber} as PAID ($${inv.amount})`);
      toast.success('Invoice Marked PAID', `${inv.invoiceNumber} ($${inv.amount.toLocaleString()}) marked as PAID`);
      syncToSupabase('invoices', inv);
      this.notify();
    }
  }

  // --- Proposals ---
  public getProposals(): Proposal[] {
    return this.proposals;
  }

  public addProposal(prop: Omit<Proposal, 'id' | 'createdAt'>): Proposal {
    const newProp: Proposal = {
      ...prop,
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.proposals.unshift(newProp);
    toast.success('Proposal Drafted', `"${newProp.title}" added to proposals hub`);
    this.notify();
    return newProp;
  }

  public signProposal(id: string, signatureName: string) {
    const prop = this.proposals.find((p) => p.id === id);
    if (prop) {
      prop.status = 'ACCEPTED';
      prop.eSigned = true;
      prop.eSignatureData = `${signatureName} [Signed ${new Date().toISOString().split('T')[0]}]`;
      this.logAudit('PROPOSAL_SIGNED', 'Proposal', id, `Proposal "${prop.title}" signed by ${signatureName}`);
      toast.success('Proposal E-Signed!', `"${prop.title}" accepted & executed by ${signatureName}`);
      this.notify();
    }
  }

  // --- Activities ---
  public getActivities(): Activity[] {
    return this.activities;
  }

  public logActivity(activity: Omit<Activity, 'id' | 'loggedAt' | 'employeeId' | 'employeeName'>) {
    const newAct: Activity = {
      ...activity,
      id: `act-${Date.now()}`,
      employeeId: this.currentUser.id,
      employeeName: this.currentUser.name,
      loggedAt: new Date().toISOString(),
    };
    this.activities.unshift(newAct);
    toast.info('Activity Logged', `${newAct.type} logged for ${newAct.entityName}`);
    this.notify();
    return newAct;
  }

  // --- Time Logs ---
  public getTimeLogs(): TimeLog[] {
    return this.timeLogs;
  }

  // --- Audit Logs ---
  public getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  public logAudit(action: string, entityType: string, entityId: string, details: string) {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      userName: this.currentUser.name,
      userRole: this.currentUser.role,
      action,
      entityType,
      details,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(newLog);
  }

  // --- Webhooks ---
  public getWebhooks(): WebhookLog[] {
    return this.webhooks;
  }

  public simulateWebhook(source: WebhookLog['source'], payload: Record<string, any>) {
    const log: WebhookLog = {
      id: `wh-${Date.now()}`,
      source,
      payload,
      receivedAt: new Date().toISOString(),
      status: 'PROCESSED',
    };
    this.webhooks.unshift(log);

    if (payload.company || payload.name) {
      this.addLead({
        name: payload.name || 'Webhook Lead',
        company: payload.company || `${source} Prospect`,
        email: payload.email || 'lead@webhook.io',
        phone: payload.phone || '+61 400 000 111',
        source: source === 'Apollo.io' ? 'Apollo.io' : source === 'Meta Ads' ? 'Meta Ads' : 'GoHighLevel',
        vertical: payload.vertical || 'Home Services',
        country: payload.country || 'AU',
        status: 'NEW',
        score: Math.floor(60 + Math.random() * 35),
        ownerId: this.currentUser.id,
        ownerName: this.currentUser.name,
        notes: `Captured automatically via ${source} webhook integration.`,
        tags: ['Webhook Incoming', source],
        followUpDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      });
    }

    toast.info(`Webhook Ingested (${source})`, `Live payload processed & logged`);
    this.notify();
  }
}

export const crmStore = new CRMStore();
