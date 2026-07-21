'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar, ModuleKey } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { GlobalSearchModal } from '@/components/search/GlobalSearchModal';
import { SupabaseConfigModal } from '@/components/ui/SupabaseConfigModal';

// Modules
import { DashboardModule } from '@/components/dashboard/DashboardModule';
import { LeadsModule } from '@/components/leads/LeadsModule';
import { ClientsModule } from '@/components/clients/ClientsModule';
import { ChurnedClientsModule } from '@/components/clients/ChurnedClientsModule';
import { ProjectsModule } from '@/components/projects/ProjectsModule';
import { CompletedProjectsModule } from '@/components/projects/CompletedProjectsModule';
import { PendingProjectsModule } from '@/components/projects/PendingProjectsModule';
import { FinanceModule } from '@/components/finance/FinanceModule';
import { EmployeesModule } from '@/components/employees/EmployeesModule';
import { ProposalsModule } from '@/components/proposals/ProposalsModule';
import { ActivityTimelineModule } from '@/components/activities/ActivityTimelineModule';
import { TasksModule } from '@/components/tasks/TasksModule';
import { IntegrationsHubModule } from '@/components/integrations/IntegrationsHubModule';
import { ReportsModule } from '@/components/reports/ReportsModule';
import { AuditLogModule } from '@/components/audit/AuditLogModule';
import { TimeTrackingModule } from '@/components/timetracking/TimeTrackingModule';

import { crmStore } from '@/lib/store';
import { User } from '@/lib/types';

export default function CRMPage() {
  const [currentModule, setCurrentModule] = useState<ModuleKey>('dashboard');
  const [currentUser, setCurrentUser] = useState<User>(crmStore.getCurrentUser());
  const [allUsers, setAllUsers] = useState<User[]>(crmStore.getUsers());

  // Store state slices
  const [leads, setLeads] = useState(crmStore.getLeads());
  const [clients, setClients] = useState(crmStore.getClients());
  const [projects, setProjects] = useState(crmStore.getProjects());
  const [tasks, setTasks] = useState(crmStore.getTasks());
  const [invoices, setInvoices] = useState(crmStore.getInvoices());
  const [proposals, setProposals] = useState(crmStore.getProposals());
  const [activities, setActivities] = useState(crmStore.getActivities());
  const [timeLogs, setTimeLogs] = useState(crmStore.getTimeLogs());
  const [auditLogs, setAuditLogs] = useState(crmStore.getAuditLogs());
  const [webhooks, setWebhooks] = useState(crmStore.getWebhooks());

  // Layout UI state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSupabaseConfigOpen, setIsSupabaseConfigOpen] = useState(false);

  const refreshState = () => {
    setCurrentUser(crmStore.getCurrentUser());
    setAllUsers(crmStore.getUsers());
    setLeads(crmStore.getLeads());
    setClients(crmStore.getClients());
    setProjects(crmStore.getProjects());
    setTasks(crmStore.getTasks());
    setInvoices(crmStore.getInvoices());
    setProposals(crmStore.getProposals());
    setActivities(crmStore.getActivities());
    setTimeLogs(crmStore.getTimeLogs());
    setAuditLogs(crmStore.getAuditLogs());
    setWebhooks(crmStore.getWebhooks());
  };

  useEffect(() => {
    const unsubscribe = crmStore.subscribe(() => {
      refreshState();
    });
    return () => unsubscribe();
  }, []);

  const handleSwitchUser = (user: User) => {
    crmStore.setCurrentUser(user);
    refreshState();
  };

  const counts = {
    leads: leads.filter((l) => l.status !== 'WON' && l.status !== 'LOST').length,
    activeClients: clients.filter((c) => c.status === 'ACTIVE').length,
    pendingProjects: projects.filter((p) => p.status === 'PENDING' || p.status === 'ON_HOLD').length,
    overdueInvoices: invoices.filter((i) => i.status === 'OVERDUE').length,
  };

  const isAdmin = currentUser.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex">
      {/* Sidebar */}
      <Sidebar
        currentModule={currentModule}
        onSelectModule={setCurrentModule}
        counts={counts}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Navbar
          currentUser={currentUser}
          allUsers={allUsers}
          onSwitchUser={handleSwitchUser}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenSupabaseConfig={() => setIsSupabaseConfigOpen(true)}
        />

        <main className="flex-1 px-4 lg:px-8 py-6 max-w-7xl mx-auto w-full">
          {currentModule === 'dashboard' && (
            <DashboardModule
              leads={leads}
              clients={clients}
              projects={projects}
              tasks={tasks}
              invoices={invoices}
              activities={activities}
              isAdmin={isAdmin}
              onNavigate={setCurrentModule}
            />
          )}

          {currentModule === 'leads' && (
            <LeadsModule
              leads={leads}
              users={allUsers}
              isAdmin={isAdmin}
              onRefresh={refreshState}
              onNavigateToClients={() => setCurrentModule('clients')}
            />
          )}

          {currentModule === 'clients' && (
            <ClientsModule
              clients={clients}
              isAdmin={isAdmin}
              onRefresh={refreshState}
              onNavigateToChurned={() => setCurrentModule('churned-clients')}
            />
          )}

          {currentModule === 'churned-clients' && (
            <ChurnedClientsModule
              clients={clients}
              isAdmin={isAdmin}
              onRefresh={refreshState}
              onNavigateToActive={() => setCurrentModule('clients')}
            />
          )}

          {currentModule === 'projects' && (
            <ProjectsModule
              projects={projects}
              clients={clients}
              users={allUsers}
              onRefresh={refreshState}
            />
          )}

          {currentModule === 'completed-projects' && (
            <CompletedProjectsModule projects={projects} isAdmin={isAdmin} />
          )}

          {currentModule === 'pending-projects' && (
            <PendingProjectsModule projects={projects} />
          )}

          {currentModule === 'finance' && (
            <FinanceModule
              invoices={invoices}
              clients={clients}
              timeLogs={timeLogs}
              isAdmin={isAdmin}
              onRefresh={refreshState}
            />
          )}

          {(currentModule === 'employees' || currentModule === 'employee-background') && (
            <EmployeesModule users={allUsers} onRefresh={refreshState} />
          )}

          {currentModule === 'proposals' && (
            <ProposalsModule
              proposals={proposals}
              clients={clients}
              isAdmin={isAdmin}
              onRefresh={refreshState}
            />
          )}

          {currentModule === 'activities' && (
            <ActivityTimelineModule activities={activities} users={allUsers} onRefresh={refreshState} />
          )}

          {currentModule === 'tasks' && (
            <TasksModule tasks={tasks} users={allUsers} onRefresh={refreshState} />
          )}

          {currentModule === 'integrations' && (
            <IntegrationsHubModule webhooks={webhooks} onRefresh={refreshState} />
          )}

          {currentModule === 'reports' && (
            <ReportsModule leads={leads} clients={clients} invoices={invoices} isAdmin={isAdmin} />
          )}

          {currentModule === 'audit' && (
            <AuditLogModule auditLogs={auditLogs} />
          )}

          {currentModule === 'timetracking' && (
            <TimeTrackingModule timeLogs={timeLogs} />
          )}
        </main>
      </div>

      {/* Cmd+K Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        leads={leads}
        clients={clients}
        projects={projects}
        invoices={invoices}
        users={allUsers}
        onSelectModule={setCurrentModule}
      />

      {/* Supabase Config & Cloud Sync Modal */}
      <SupabaseConfigModal
        isOpen={isSupabaseConfigOpen}
        onClose={() => setIsSupabaseConfigOpen(false)}
      />
    </div>
  );
}
