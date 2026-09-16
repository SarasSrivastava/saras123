// Project LOOP - Initial Mock Workspaces, Users, Themes & Dataset Generator

export const INITIAL_WORKSPACES = [
  { id: 'ws_demo_acme', name: 'Acme Cloud Platform', domain: 'acme.com', plan: 'Enterprise Tier', seats: 45, region: 'us-east-1' },
  { id: 'ws_saasify', name: 'SaaSify Growth Inc.', domain: 'saasify.io', plan: 'Pro Scale', seats: 12, region: 'eu-west-1' },
  { id: 'ws_retailpulse', name: 'RetailPulse Omnichannel', domain: 'retailpulse.com', plan: 'Enterprise Tier', seats: 90, region: 'us-west-2' }
];

export const DEMO_USERS = [
  {
    id: 'usr_sarah',
    name: 'Sarah Chen',
    email: 'sarah@acme.com',
    role: 'ADMIN',
    title: 'VP of Product',
    department: 'Product Strategy',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_alex',
    name: 'Alex Rivera',
    email: 'alex@acme.com',
    role: 'ANALYST',
    title: 'Lead Product Ops',
    department: 'Customer Intelligence',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_maya',
    name: 'Maya Patel',
    email: 'maya@acme.com',
    role: 'VIEWER',
    title: 'Executive Stakeholder',
    department: 'Leadership & Board',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_THEMES = [
  {
    id: 'thm_onboarding',
    name: 'Onboarding Experience',
    color: '#6366f1',
    description: 'Signup wizard, team invitation flows, and initial product time-to-value.'
  },
  {
    id: 'thm_billing',
    name: 'Billing & Invoicing',
    color: '#ec4899',
    description: 'Invoices, checkout checkout, seat upgrades, receipts, and pricing.'
  },
  {
    id: 'thm_performance',
    name: 'Platform Performance',
    color: '#10b981',
    description: 'Dashboard latency, query execution speed, timeout bugs, and uptime.'
  },
  {
    id: 'thm_sso',
    name: 'Enterprise SSO & Auth',
    color: '#8b5cf6',
    description: 'SAML 2.0, Okta, Azure AD integration, 2FA, and session security.'
  },
  {
    id: 'thm_mobile',
    name: 'Mobile Experience',
    color: '#f59e0b',
    description: 'iOS and Android responsive layout, mobile charts, and push alerts.'
  },
  {
    id: 'thm_export',
    name: 'Data Export & Integrations',
    color: '#06b6d4',
    description: 'CSV/PDF exports, Slack webhooks, Zapier integrations, and REST API.'
  }
];

export function generateInitialFeedback() {
  const baseItems = [
    {
      id: 'FB-1001',
      content: 'Onboarding took forever — I couldn’t figure out how to invite my team members without opening a support ticket.',
      channel: 'SUPPORT_TICKET',
      customerLabel: 'Enterprise / Fortune 500',
      sentiment: 'NEG',
      sentimentScore: -0.78,
      featureArea: 'Onboarding & Workspace',
      themeId: 'thm_onboarding',
      themeName: 'Onboarding Experience',
      aiRationale: 'Strong negative friction regarding team invitations blocking workspace setup.',
      status: 'NEW',
      daysAgo: 1,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'FB-1002',
      content: 'The new dashboard is gorgeous and finally fast. Huge improvement over last quarter release!',
      channel: 'APP_STORE',
      customerLabel: 'Daily Power User',
      sentiment: 'POS',
      sentimentScore: 0.94,
      featureArea: 'Platform Performance',
      themeId: 'thm_performance',
      themeName: 'Platform Performance',
      aiRationale: 'High positive appreciation for dashboard visual overhaul and page speed.',
      status: 'REVIEWED',
      daysAgo: 2,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'FB-1003',
      content: 'It does the job, but the mobile experience needs work. Filters overflow the screen on iPhone 15.',
      channel: 'NPS_SURVEY',
      customerLabel: 'Mobile Exec / Tier 2',
      sentiment: 'NEU',
      sentimentScore: -0.25,
      featureArea: 'Mobile Applications',
      themeId: 'thm_mobile',
      themeName: 'Mobile Experience',
      aiRationale: 'Constructive mobile feedback regarding layout truncation on smaller viewport devices.',
      status: 'NEW',
      daysAgo: 2,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'FB-1004',
      content: 'Prospect wants SAML SSO / Okta before they’ll sign — third time this month we lost a deal over this.',
      channel: 'SALES_CALL',
      customerLabel: 'Strategic Enterprise Deal ($90k ARR)',
      sentiment: 'NEG',
      sentimentScore: -0.85,
      featureArea: 'Authentication & Security',
      themeId: 'thm_sso',
      themeName: 'Enterprise SSO & Auth',
      aiRationale: 'Urgent revenue blocker: Enterprise deal qualification halted pending SAML support.',
      status: 'ACTIONED',
      daysAgo: 3,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'FB-1005',
      content: 'Love the new export feature, saved me an hour of manual spreadsheet formatting today.',
      channel: 'COMMUNITY_POST',
      customerLabel: 'Operations Manager',
      sentiment: 'POS',
      sentimentScore: 0.92,
      featureArea: 'Integrations & API',
      themeId: 'thm_export',
      themeName: 'Data Export & Integrations',
      aiRationale: 'Time savings and efficiency praise directly attributed to the CSV/PDF export upgrade.',
      status: 'REVIEWED',
      daysAgo: 4,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'FB-1006',
      content: 'Billing page keeps timing out when I try to download an invoice PDF for accounting reconciliation.',
      channel: 'SUPPORT_TICKET',
      customerLabel: 'Finance Director / Growth Tier',
      sentiment: 'NEG',
      sentimentScore: -0.82,
      featureArea: 'Billing & Subscriptions',
      themeId: 'thm_billing',
      themeName: 'Billing & Invoicing',
      aiRationale: 'Critical failure on invoice PDF retrieval causing accounting friction.',
      status: 'NEW',
      daysAgo: 4,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'FB-1007',
      content: 'The Ask LOOP AI feature answered my questions about customer onboarding trends in seconds. Mind blown.',
      channel: 'COMMUNITY_POST',
      customerLabel: 'Product Lead @ TechCorp',
      sentiment: 'POS',
      sentimentScore: 0.96,
      featureArea: 'AI Intelligence',
      themeId: 'thm_performance',
      themeName: 'Platform Performance',
      aiRationale: 'Enthusiastic validation of the RAG Q&A retrieval accuracy and speed.',
      status: 'ACTIONED',
      daysAgo: 5,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const channels = ['SUPPORT_TICKET', 'APP_STORE', 'NPS_SURVEY', 'SALES_CALL', 'COMMUNITY_POST'];
  const themes = INITIAL_THEMES;

  const templates = [
    { text: 'Invitation links sent via email expire too fast before team members can click them.', s: 'NEG', score: -0.65, th: themes[0], fa: 'Onboarding & Workspace' },
    { text: 'Checkout page errored when adding 5 extra seat licenses during annual renewal.', s: 'NEG', score: -0.88, th: themes[1], fa: 'Billing & Subscriptions' },
    { text: 'Search query latency in the triage inbox dropped from 3s to 80ms! Super responsive.', s: 'POS', score: 0.91, th: themes[2], fa: 'Platform Performance' },
    { text: 'Our CISO mandates 2-Factor Authentication enforcement for all enterprise workspace users.', s: 'NEU', score: -0.15, th: themes[3], fa: 'Authentication & Security' },
    { text: 'Tablet iPad view is responsive now, but chart tooltips are difficult to tap accurately.', s: 'NEU', score: -0.20, th: themes[4], fa: 'Mobile Experience' },
    { text: 'Automated Slack webhook notification for negative customer feedback alerts saved our CS team.', s: 'POS', score: 0.89, th: themes[5], fa: 'Integrations & API' },
    { text: 'VAT and tax calculation numbers were missing our European company ID on the receipt header.', s: 'NEG', score: -0.70, th: themes[1], fa: 'Billing & Subscriptions' },
    { text: 'The interactive walkthrough video when setting up the workspace was exceptionally clear.', s: 'POS', score: 0.87, th: themes[0], fa: 'Onboarding & Workspace' },
    { text: 'Encountered a 504 gateway timeout when running bulk query across 20,000 historical rows.', s: 'NEG', score: -0.75, th: themes[2], fa: 'Platform Performance' },
    { text: 'Can we configure custom session timeouts for SOC2 compliance audits?', s: 'NEU', score: 0.05, th: themes[3], fa: 'Authentication & Security' },
    { text: 'Push notifications for critical priority issues work reliably across our distributed team.', s: 'POS', score: 0.83, th: themes[4], fa: 'Mobile Experience' },
    { text: 'Need a native Zapier and Make connector to sync inbound customer reviews automatically.', s: 'POS', score: 0.72, th: themes[5], fa: 'Integrations & API' }
  ];

  const items = [...baseItems];
  for (let i = 8; i <= 135; i++) {
    const tmpl = templates[(i - 8) % templates.length];
    const channel = channels[i % channels.length];
    const daysAgo = Math.floor(Math.random() * 58) + 1;
    const status = i % 4 === 0 ? 'ACTIONED' : i % 2 === 0 ? 'REVIEWED' : 'NEW';
    const scoreJitter = (Math.random() * 0.1 - 0.05);
    const finalScore = Number(Math.max(-1, Math.min(1, tmpl.score + scoreJitter)).toFixed(2));
    const sentiment = finalScore > 0.2 ? 'POS' : finalScore < -0.2 ? 'NEG' : 'NEU';

    items.push({
      id: `FB-${1000 + i}`,
      content: `[#${i}] ${tmpl.text}`,
      channel: channel,
      customerLabel: `Account_${(i * 13) % 400 + 100}@customer-domain.com`,
      sentiment: sentiment,
      sentimentScore: finalScore,
      featureArea: tmpl.fa,
      themeId: tmpl.th.id,
      themeName: tmpl.th.name,
      aiRationale: `Classified as ${sentiment} (${finalScore}) based on semantic topic vectors for ${tmpl.fa}.`,
      status: status,
      daysAgo: daysAgo,
      createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  return items;
}
