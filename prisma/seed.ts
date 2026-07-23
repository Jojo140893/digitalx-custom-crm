import { PrismaClient } from '@prisma/client';
import {
  INITIAL_USERS,
  INITIAL_LEADS,
  INITIAL_CLIENTS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_PROPOSALS,
  INITIAL_INVOICES,
  INITIAL_ACTIVITIES,
  INITIAL_TIMELOGS,
  INITIAL_CALL_RECORDS,
} from '../lib/mockData';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Supabase Postgres Database Seed...');

  // 1. Create Default Agency Tenant
  const tenant = await prisma.tenant.upsert({
    where: { id: 'default-tenant' },
    update: {
      name: 'DigitalX AI Agency',
      slug: 'digitalx-au',
    },
    create: {
      id: 'default-tenant',
      name: 'DigitalX AI Agency',
      slug: 'digitalx-au',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      primaryColor: '#4f46e5',
      domain: 'crm.digitalx.agency',
      plan: 'AGENCY',
      widgetKey: 'widget_live_digitalx_sec_99182',
      aiTokensUsed: 142500,
      voiceMinutesUsed: 420,
      proposalsGenerated: 18,
      dataRetentionMonths: 12,
    },
  });
  console.log(`✅ Tenant created: ${tenant.name} (${tenant.id})`);

  // 2. Seed Users
  for (const u of INITIAL_USERS) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {
        tenantId: tenant.id,
        name: u.name,
        email: u.email,
        role: u.role,
        department: u.department,
        skills: JSON.stringify(u.skills),
        certifications: JSON.stringify(u.certifications),
      },
      create: {
        id: u.id,
        tenantId: tenant.id,
        name: u.name,
        email: u.email,
        role: u.role,
        department: u.department,
        phone: u.phone,
        avatar: u.avatar,
        status: u.status,
        startDate: u.startDate,
        skills: JSON.stringify(u.skills),
        certifications: JSON.stringify(u.certifications),
        experienceNotes: u.experienceNotes,
        cvUrl: u.cvUrl,
        rating: u.rating,
        workloadLevel: u.workloadLevel,
      },
    });
  }
  console.log(`✅ ${INITIAL_USERS.length} Users seeded.`);

  // 3. Seed Leads
  for (const l of INITIAL_LEADS) {
    await prisma.lead.upsert({
      where: { id: l.id },
      update: {
        tenantId: tenant.id,
        status: l.status,
        score: l.score,
      },
      create: {
        id: l.id,
        tenantId: tenant.id,
        name: l.name,
        company: l.company,
        email: l.email,
        phone: l.phone,
        source: l.source,
        vertical: l.vertical,
        country: l.country,
        status: l.status,
        score: l.score,
        ownerId: l.ownerId,
        notes: l.notes,
        tags: JSON.stringify(l.tags),
        followUpDate: l.followUpDate,
        createdAt: new Date(l.createdAt),
      },
    });
  }
  console.log(`✅ ${INITIAL_LEADS.length} Leads seeded.`);

  // 4. Seed Clients
  for (const c of INITIAL_CLIENTS) {
    await prisma.client.upsert({
      where: { id: c.id },
      update: {
        tenantId: tenant.id,
        monthlyRetainer: c.monthlyRetainer,
        healthScore: c.healthScore,
      },
      create: {
        id: c.id,
        tenantId: tenant.id,
        companyName: c.companyName,
        primaryContact: c.primaryContact,
        email: c.email,
        phone: c.phone,
        vertical: c.vertical,
        country: c.country,
        status: c.status,
        healthScore: c.healthScore,
        healthRisk: c.healthRisk,
        marginPercent: c.marginPercent,
        servicesSold: JSON.stringify(c.servicesSold),
        setupFee: c.setupFee,
        monthlyRetainer: c.monthlyRetainer,
        contractStartDate: c.contractStartDate,
        lifetimeRevenue: c.lifetimeRevenue,
        onboardingChecklist: JSON.stringify(c.onboardingChecklist),
        createdAt: new Date(c.createdAt),
      },
    });
  }
  console.log(`✅ ${INITIAL_CLIENTS.length} Clients seeded.`);

  // 5. Seed Projects
  for (const p of INITIAL_PROJECTS) {
    await prisma.project.upsert({
      where: { id: p.id },
      update: {
        tenantId: tenant.id,
        status: p.status,
      },
      create: {
        id: p.id,
        tenantId: tenant.id,
        clientId: p.clientId,
        name: p.name,
        serviceType: p.serviceType,
        status: p.status,
        targetDelivery: p.targetDelivery,
        expectedStartDate: p.expectedStartDate,
        completionDate: p.completionDate,
        finalInvoiceValue: p.finalInvoiceValue || 0,
        blockerNotes: p.blockerNotes,
        delayReason: p.delayReason,
        testimonialQuote: p.testimonialQuote,
        csatRating: p.csatRating,
        assignees: JSON.stringify(p.assignees),
        createdAt: new Date(p.createdAt),
      },
    });
  }
  console.log(`✅ ${INITIAL_PROJECTS.length} Projects seeded.`);

  // 6. Seed Tasks
  for (const t of INITIAL_TASKS) {
    await prisma.task.upsert({
      where: { id: t.id },
      update: {
        tenantId: tenant.id,
        status: t.status,
      },
      create: {
        id: t.id,
        tenantId: tenant.id,
        projectId: t.projectId,
        clientId: t.clientId,
        title: t.title,
        priority: t.priority,
        status: t.status,
        dueDate: t.dueDate,
        assignedTo: t.assignedTo,
        estimatedHours: t.estimatedHours,
        loggedHours: t.loggedHours,
      },
    });
  }
  console.log(`✅ ${INITIAL_TASKS.length} Tasks seeded.`);

  // 7. Seed Proposals
  for (const pr of INITIAL_PROPOSALS) {
    await prisma.proposal.upsert({
      where: { id: pr.id },
      update: {
        tenantId: tenant.id,
        status: pr.status,
      },
      create: {
        id: pr.id,
        tenantId: tenant.id,
        clientId: pr.clientId,
        title: pr.title,
        phases: JSON.stringify(pr.phases),
        version: pr.version,
        status: pr.status,
        totalValue: pr.totalValue,
        sentDate: pr.sentDate,
        eSigned: pr.eSigned,
        eSignatureData: pr.eSignatureData,
        createdAt: new Date(pr.createdAt),
      },
    });
  }
  console.log(`✅ ${INITIAL_PROPOSALS.length} Proposals seeded.`);

  // 8. Seed Invoices
  for (const inv of INITIAL_INVOICES) {
    await prisma.invoice.upsert({
      where: { id: inv.id },
      update: {
        tenantId: tenant.id,
        status: inv.status,
      },
      create: {
        id: inv.id,
        tenantId: tenant.id,
        invoiceNumber: inv.invoiceNumber,
        clientId: inv.clientId,
        amount: inv.amount,
        type: inv.type,
        issueDate: inv.issueDate,
        dueDate: inv.dueDate,
        status: inv.status,
        paidDate: inv.paidDate,
      },
    });
  }
  console.log(`✅ ${INITIAL_INVOICES.length} Invoices seeded.`);

  // 9. Seed Activities
  for (const act of INITIAL_ACTIVITIES) {
    await prisma.activity.upsert({
      where: { id: act.id },
      update: {
        tenantId: tenant.id,
      },
      create: {
        id: act.id,
        tenantId: tenant.id,
        leadId: act.leadId,
        clientId: act.clientId,
        employeeId: act.employeeId,
        type: act.type,
        title: act.title,
        description: act.description,
        loggedAt: new Date(act.loggedAt),
      },
    });
  }
  console.log(`✅ ${INITIAL_ACTIVITIES.length} Activities seeded.`);

  // 10. Seed Time Logs
  for (const tl of INITIAL_TIMELOGS) {
    await prisma.timeLog.upsert({
      where: { id: tl.id },
      update: {
        tenantId: tenant.id,
      },
      create: {
        id: tl.id,
        tenantId: tenant.id,
        employeeId: tl.employeeId,
        projectId: tl.projectId,
        clientId: tl.clientId,
        hours: tl.hours,
        billable: tl.billable,
        date: tl.date,
        description: tl.description,
      },
    });
  }
  console.log(`✅ ${INITIAL_TIMELOGS.length} Time Logs seeded.`);

  // 11. Seed Call Records
  for (const cr of INITIAL_CALL_RECORDS) {
    await prisma.callRecord.upsert({
      where: { id: cr.id },
      update: {
        tenantId: tenant.id,
      },
      create: {
        id: cr.id,
        tenantId: tenant.id,
        leadId: cr.leadId,
        clientId: cr.clientId,
        callerName: cr.callerName,
        callerPhone: cr.callerPhone,
        direction: cr.direction,
        durationSeconds: cr.durationSeconds,
        status: cr.status,
        recordingUrl: cr.recordingUrl,
        transcript: cr.transcript,
        summary: cr.summary,
        sentiment: cr.sentiment,
        actionItems: JSON.stringify(cr.actionItems),
        createdAt: new Date(cr.createdAt),
      },
    });
  }
  console.log(`✅ ${INITIAL_CALL_RECORDS.length} Call Records seeded.`);

  console.log('🎉 Supabase Postgres Database Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
