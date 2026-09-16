// Project LOOP - Database Seed Script (Pure JavaScript)
// Generates 130+ realistic multi-channel customer feedback items with themes, embeddings, and 3 RBAC users

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const Role = {
  ADMIN: 'ADMIN',
  ANALYST: 'ANALYST',
  VIEWER: 'VIEWER',
};

const Sentiment = {
  POS: 'POS',
  NEU: 'NEU',
  NEG: 'NEG',
};

const FeedbackStatus = {
  NEW: 'NEW',
  REVIEWED: 'REVIEWED',
  ACTIONED: 'ACTIONED',
};

const ChannelType = {
  SUPPORT_TICKET: 'SUPPORT_TICKET',
  APP_STORE: 'APP_STORE',
  NPS_SURVEY: 'NPS_SURVEY',
  SALES_CALL: 'SALES_CALL',
  COMMUNITY_POST: 'COMMUNITY_POST',
  INTERCOM_CHAT: 'INTERCOM_CHAT',
  OTHER: 'OTHER',
};

const SAMPLE_RAW_DATA = [
  // Onboarding & Invites
  {
    content: "Onboarding took forever — I couldn’t figure out how to invite my team members without contacting support.",
    channel: ChannelType.SUPPORT_TICKET,
    customerLabel: "Enterprise / Acme Corp",
    sentiment: Sentiment.NEG,
    sentimentScore: -0.75,
    featureArea: "Onboarding & Workspace",
    themeName: "Onboarding Experience",
    daysAgo: 2,
  },
  {
    content: "The initial setup wizard was confusing. The invite links sent to my colleagues expired after 10 minutes.",
    channel: ChannelType.SUPPORT_TICKET,
    customerLabel: "Mid-Market / Fintech",
    sentiment: Sentiment.NEG,
    sentimentScore: -0.65,
    featureArea: "Onboarding & Workspace",
    themeName: "Onboarding Experience",
    daysAgo: 4,
  },
  {
    content: "Loved the new interactive walkthrough when signing up! My team was up and running in under 5 minutes.",
    channel: ChannelType.COMMUNITY_POST,
    customerLabel: "Startup / Beta Tester",
    sentiment: Sentiment.POS,
    sentimentScore: 0.90,
    featureArea: "Onboarding & Workspace",
    themeName: "Onboarding Experience",
    daysAgo: 5,
  },
  {
    content: "Sign up is super fast, but when inviting 20+ members via CSV, the parser failed with no error description.",
    channel: ChannelType.NPS_SURVEY,
    customerLabel: "Growth / Logistics",
    sentiment: Sentiment.NEU,
    sentimentScore: -0.20,
    featureArea: "Onboarding & Workspace",
    themeName: "Onboarding Experience",
    daysAgo: 6,
  },
  {
    content: "Where do I add new workspace admins? The permissions UI is hidden under profile rather than organization settings.",
    channel: ChannelType.SUPPORT_TICKET,
    customerLabel: "Enterprise / HealthTech",
    sentiment: Sentiment.NEG,
    sentimentScore: -0.50,
    featureArea: "Onboarding & Workspace",
    themeName: "Onboarding Experience",
    daysAgo: 8,
  },
  {
    content: "Awesome onboarding checklist! Really guided me step-by-step through database connection.",
    channel: ChannelType.APP_STORE,
    customerLabel: "Developer / Individual",
    sentiment: Sentiment.POS,
    sentimentScore: 0.85,
    featureArea: "Onboarding & Workspace",
    themeName: "Onboarding Experience",
    daysAgo: 11,
  },

  // Billing & Invoicing
  {
    content: "Billing page keeps timing out when I try to download an invoice PDF for my accounting department.",
    channel: ChannelType.SUPPORT_TICKET,
    customerLabel: "Finance Lead / Tier 1",
    sentiment: Sentiment.NEG,
    sentimentScore: -0.85,
    featureArea: "Billing & Subscriptions",
    themeName: "Billing & Invoicing",
    daysAgo: 1,
  },
  {
    content: "We were double-charged for our extra seats this billing cycle. Need an immediate credit note issued.",
    channel: ChannelType.SUPPORT_TICKET,
    customerLabel: "Finance / Enterprise",
    sentiment: Sentiment.NEG,
    sentimentScore: -0.92,
    featureArea: "Billing & Subscriptions",
    themeName: "Billing & Invoicing",
    daysAgo: 3,
  },
  {
    content: "Upgrading our plan from Pro to Enterprise was completely seamless with Stripe checkout. Great experience.",
    channel: ChannelType.COMMUNITY_POST,
    customerLabel: "Founder / Series A",
    sentiment: Sentiment.POS,
    sentimentScore: 0.88,
    featureArea: "Billing & Subscriptions",
    themeName: "Billing & Invoicing",
    daysAgo: 7,
  },
  {
    content: "Would love annual invoice payment terms via ACH or Wire rather than forced credit card recurring charges.",
    channel: ChannelType.SALES_CALL,
    customerLabel: "VP Finance / Global Retail",
    sentiment: Sentiment.NEU,
    sentimentScore: 0.05,
    featureArea: "Billing & Subscriptions",
    themeName: "Billing & Invoicing",
    daysAgo: 9,
  },
  {
    content: "VAT invoice calculation is missing our European tax ID on the receipt header.",
    channel: ChannelType.SUPPORT_TICKET,
    customerLabel: "Operations / EU Client",
    sentiment: Sentiment.NEG,
    sentimentScore: -0.60,
    featureArea: "Billing & Subscriptions",
    themeName: "Billing & Invoicing",
    daysAgo: 12,
  },

  // Performance & Speed
  {
    content: "The new dashboard is gorgeous and finally fast. Huge improvement over last month's release.",
    channel: ChannelType.APP_STORE,
    customerLabel: "Daily Power User",
    sentiment: Sentiment.POS,
    sentimentScore: 0.95,
    featureArea: "Platform Performance",
    themeName: "Platform Performance",
    daysAgo: 2,
  },
  {
    content: "Reports take over 45 seconds to generate when selecting a date range greater than 30 days.",
    channel: ChannelType.SUPPORT_TICKET,
    customerLabel: "Analytics Lead",
    sentiment: Sentiment.NEG,
    sentimentScore: -0.70,
    featureArea: "Platform Performance",
    themeName: "Platform Performance",
    daysAgo: 4,
  },
  {
    content: "Search queries in the inbox feel instantaneous now. Great engineering work on indexing!",
    channel: ChannelType.COMMUNITY_POST,
    customerLabel: "Dev Advocate",
    sentiment: Sentiment.POS,
    sentimentScore: 0.92,
    featureArea: "Platform Performance",
    themeName: "Platform Performance",
    daysAgo: 6,
  },
  {
    content: "Occasional 504 gateway timeout when querying more than 10,000 records in table view.",
    channel: ChannelType.SUPPORT_TICKET,
    customerLabel: "Enterprise Admin",
    sentiment: Sentiment.NEG,
    sentimentScore: -0.78,
    featureArea: "Platform Performance",
    themeName: "Platform Performance",
    daysAgo: 10,
  },

  // Enterprise SSO & Auth
  {
    content: "Prospect wants SAML SSO / Okta before they will sign — third time this month we lost a deal over this.",
    channel: ChannelType.SALES_CALL,
    customerLabel: "Strategic Enterprise Deal",
    sentiment: Sentiment.NEG,
    sentimentScore: -0.80,
    featureArea: "Authentication & Security",
    themeName: "Enterprise SSO & Auth",
    daysAgo: 1,
  },
  {
    content: "Our IT security compliance audit requires 2FA enforcement for all workspace members. Is this roadmap?",
    channel: ChannelType.SALES_CALL,
    customerLabel: "CISO / Banking",
    sentiment: Sentiment.NEU,
    sentimentScore: -0.10,
    featureArea: "Authentication & Security",
    themeName: "Enterprise SSO & Auth",
    daysAgo: 3,
  },
  {
    content: "Google Workspace single sign-on works like a charm. Very clean authentication flow.",
    channel: ChannelType.APP_STORE,
    customerLabel: "Google Workspace Org",
    sentiment: Sentiment.POS,
    sentimentScore: 0.85,
    featureArea: "Authentication & Security",
    themeName: "Enterprise SSO & Auth",
    daysAgo: 8,
  },
  {
    content: "Need custom session timeout configurations for SOC2 Type II compliance.",
    channel: ChannelType.SUPPORT_TICKET,
    customerLabel: "Compliance Officer",
    sentiment: Sentiment.NEU,
    sentimentScore: 0.00,
    featureArea: "Authentication & Security",
    themeName: "Enterprise SSO & Auth",
    daysAgo: 15,
  },

  // Mobile Experience
  {
    content: "It does the job, but the mobile experience needs work. Filters overflow the screen on iPhone 15.",
    channel: ChannelType.NPS_SURVEY,
    customerLabel: "Mobile Exec",
    sentiment: Sentiment.NEU,
    sentimentScore: -0.30,
    featureArea: "Mobile Applications",
    themeName: "Mobile Experience",
    daysAgo: 2,
  },
  {
    content: "App crashes when opening the analytics charts tab on iPad OS 17.",
    channel: ChannelType.APP_STORE,
    customerLabel: "Tablet User",
    sentiment: Sentiment.NEG,
    sentimentScore: -0.88,
    featureArea: "Mobile Applications",
    themeName: "Mobile Experience",
    daysAgo: 5,
  },
  {
    content: "Push notifications for high-priority negative feedback alerts are super handy on iOS.",
    channel: ChannelType.APP_STORE,
    customerLabel: "Product Manager",
    sentiment: Sentiment.POS,
    sentimentScore: 0.80,
    featureArea: "Mobile Applications",
    themeName: "Mobile Experience",
    daysAgo: 9,
  },

  // Data Export & Integrations
  {
    content: "Love the new CSV export feature, saved me an hour of spreadsheet wrangling today.",
    channel: ChannelType.COMMUNITY_POST,
    customerLabel: "Operations Manager",
    sentiment: Sentiment.POS,
    sentimentScore: 0.95,
    featureArea: "Integrations & API",
    themeName: "Data Export & Integrations",
    daysAgo: 3,
  },
  {
    content: "Can we get a native webhook to pipe classified feedback directly into our Slack #product-feedback channel?",
    channel: ChannelType.COMMUNITY_POST,
    customerLabel: "Product Ops",
    sentiment: Sentiment.POS,
    sentimentScore: 0.70,
    featureArea: "Integrations & API",
    themeName: "Data Export & Integrations",
    daysAgo: 7,
  },
  {
    content: "Zendesk sync stopped updating ticket tags after yesterday's maintenance window.",
    channel: ChannelType.SUPPORT_TICKET,
    customerLabel: "Support Lead",
    sentiment: Sentiment.NEG,
    sentimentScore: -0.82,
    featureArea: "Integrations & API",
    themeName: "Data Export & Integrations",
    daysAgo: 12,
  },
];

// Generate variations to reach 130+ rich records
function generateExtendedFeedback() {
  const items = [...SAMPLE_RAW_DATA];
  const templates = [
    { text: "Filtering by date in the inbox is super smooth, but I wish I could save custom filter presets.", ch: ChannelType.COMMUNITY_POST, s: Sentiment.POS, score: 0.65, fa: "UI & Filtering", th: "Onboarding Experience" },
    { text: "Invoice generated has incorrect company billing address even though we updated it in settings.", ch: ChannelType.SUPPORT_TICKET, s: Sentiment.NEG, score: -0.75, fa: "Billing & Subscriptions", th: "Billing & Invoicing" },
    { text: "Our sales team needs an automated digest of what customers mentioned during demo calls.", ch: ChannelType.SALES_CALL, s: Sentiment.POS, score: 0.60, fa: "AI Insights", th: "Data Export & Integrations" },
    { text: "The Claude AI summaries are shockingly accurate. Identified 3 recurring bugs in 10 minutes.", ch: ChannelType.COMMUNITY_POST, s: Sentiment.POS, score: 0.98, fa: "AI Intelligence", th: "Platform Performance" },
    { text: "CSV import failed silently when a row had an unescaped quote mark.", ch: ChannelType.SUPPORT_TICKET, s: Sentiment.NEG, score: -0.65, fa: "Data Ingestion", th: "Data Export & Integrations" },
    { text: "Need role-based permissions so interns can view feedback without being able to delete customer records.", ch: ChannelType.NPS_SURVEY, s: Sentiment.NEU, score: 0.10, fa: "Authentication & Security", th: "Enterprise SSO & Auth" },
    { text: "Dark mode looks incredible on OLED screens. Great job on the contrast levels!", ch: ChannelType.APP_STORE, s: Sentiment.POS, score: 0.90, fa: "UI & Design", th: "Platform Performance" },
    { text: "Mobile responsiveness in the triage inbox needs improvement on small screens.", ch: ChannelType.NPS_SURVEY, s: Sentiment.NEG, score: -0.55, fa: "Mobile Applications", th: "Mobile Experience" },
    { text: "We need webhook support for when sentiment drops below -0.8 on any enterprise account.", ch: ChannelType.COMMUNITY_POST, s: Sentiment.POS, score: 0.75, fa: "Integrations & API", th: "Data Export & Integrations" },
    { text: "Credit card billing retry logic failed without sending us a notification email.", ch: ChannelType.SUPPORT_TICKET, s: Sentiment.NEG, score: -0.85, fa: "Billing & Subscriptions", th: "Billing & Invoicing" },
  ];

  for (let i = 0; i < 110; i++) {
    const tmpl = templates[i % templates.length];
    const daysAgo = Math.floor(Math.random() * 55) + 1;
    const channels = [ChannelType.SUPPORT_TICKET, ChannelType.APP_STORE, ChannelType.NPS_SURVEY, ChannelType.SALES_CALL, ChannelType.COMMUNITY_POST];
    const channel = channels[i % channels.length];
    const sentiments = [Sentiment.POS, Sentiment.NEG, Sentiment.NEU, Sentiment.POS, Sentiment.NEG];
    const sentiment = sentiments[i % sentiments.length];
    const score = sentiment === Sentiment.POS ? Number((0.5 + Math.random() * 0.48).toFixed(2)) : sentiment === Sentiment.NEG ? Number((-0.5 - Math.random() * 0.45).toFixed(2)) : Number(((Math.random() - 0.5) * 0.3).toFixed(2));
    const statuses = [FeedbackStatus.NEW, FeedbackStatus.REVIEWED, FeedbackStatus.ACTIONED];
    const status = statuses[i % statuses.length];

    items.push({
      content: `[#${i + 1}] ${tmpl.text} (Customer Ref: Batch-${Math.floor(i / 10) + 1})`,
      channel,
      customerLabel: `Client_${i + 101}@saas-enterprise.com`,
      sentiment,
      sentimentScore: score,
      featureArea: tmpl.fa,
      themeName: tmpl.th,
      status,
      daysAgo,
    });
  }

  return items;
}

export async function main() {
  console.log('🌱 Starting database seed for Project LOOP...');

  // 1. Create Demo Workspace
  const workspace = await prisma.workspace.upsert({
    where: { id: 'ws_demo_acme' },
    update: {},
    create: {
      id: 'ws_demo_acme',
      name: 'Acme Cloud Platform',
      domain: 'acme.com',
    },
  });
  console.log('✅ Created Workspace:', workspace.name);

  // 2. Create 3 RBAC Users
  const usersData = [
    {
      id: 'usr_sarah_admin',
      name: 'Sarah Chen (VP Product)',
      email: 'sarah@acme.com',
      passwordHash: '$2b$10$demoHashedPasswordSarah123',
      role: Role.ADMIN,
      workspaceId: workspace.id,
    },
    {
      id: 'usr_alex_analyst',
      name: 'Alex Rivera (Product Analyst)',
      email: 'alex@acme.com',
      passwordHash: '$2b$10$demoHashedPasswordAlex123',
      role: Role.ANALYST,
      workspaceId: workspace.id,
    },
    {
      id: 'usr_maya_viewer',
      name: 'Maya Patel (Executive Stakeholder)',
      email: 'maya@acme.com',
      passwordHash: '$2b$10$demoHashedPasswordMaya123',
      role: Role.VIEWER,
      workspaceId: workspace.id,
    },
  ];

  for (const u of usersData) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }
  console.log('✅ Created 3 RBAC Demo Users (Admin, Analyst, Viewer)');

  // 3. Create Themes
  const themesDef = [
    { name: 'Onboarding Experience', color: '#6366f1', description: 'Signup, invitation flows, first-time user experience' },
    { name: 'Billing & Invoicing', color: '#ec4899', description: 'Invoices, checkout, seat add-ons, pricing plans' },
    { name: 'Platform Performance', color: '#10b981', description: 'Latency, page load speeds, search queries, uptime' },
    { name: 'Enterprise SSO & Auth', color: '#8b5cf6', description: 'SAML 2.0, Okta integration, 2FA, session security' },
    { name: 'Mobile Experience', color: '#f59e0b', description: 'iOS and Android app responsive layouts, notifications' },
    { name: 'Data Export & Integrations', color: '#06b6d4', description: 'CSV/PDF exports, Slack webhooks, REST APIs' },
  ];

  const createdThemes = {};
  for (const t of themesDef) {
    const theme = await prisma.theme.upsert({
      where: {
        workspaceId_name: {
          workspaceId: workspace.id,
          name: t.name,
        },
      },
      update: {},
      create: {
        workspaceId: workspace.id,
        name: t.name,
        color: t.color,
        description: t.description,
      },
    });
    createdThemes[t.name] = theme;
  }
  console.log('✅ Created 6 Core Themes');

  // 4. Ingest 130+ Feedback items
  const allFeedback = generateExtendedFeedback();
  let count = 0;

  for (const item of allFeedback) {
    const createdAt = new Date(Date.now() - item.daysAgo * 24 * 60 * 60 * 1000);
    const assignedTheme = createdThemes[item.themeName] || Object.values(createdThemes)[0];

    await prisma.feedback.create({
      data: {
        content: item.content,
        channel: item.channel,
        customerLabel: item.customerLabel,
        sentiment: item.sentiment,
        sentimentScore: item.sentimentScore,
        featureArea: item.featureArea,
        status: item.status || FeedbackStatus.NEW,
        aiRationale: `Automatically classified based on ${item.sentiment} sentiment indicators in ${item.featureArea}.`,
        createdAt,
        workspaceId: workspace.id,
        themes: {
          create: {
            themeId: assignedTheme.id,
            confidence: 0.94,
          },
        },
      },
    });
    count++;
  }

  console.log(`✅ Seeded ${count} realistic customer feedback items with themes and relations!`);
  console.log('🎉 Project LOOP Database Seeding Complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
