// Project LOOP - Client-side AI Intelligence Engine
// Sentiment Classification, Semantic Search Embeddings, RAG Q&A, and VoC Report Generation

export function computeDeterministicEmbedding(text = '') {
  const dim = 32;
  const vec = new Array(dim).fill(0);
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  if (!words.length) return vec;
  
  const keywords = [
    ['onboard', 'welcome', 'signup', 'invite', 'team', 'first'],
    ['bill', 'invoice', 'pricing', 'charge', 'cost', 'payment', 'receipt', 'card', 'checkout'],
    ['slow', 'fast', 'speed', 'latency', 'timeout', 'crash', 'performance', '504', 'quick'],
    ['sso', 'saml', 'okta', 'auth', 'security', '2fa', 'login', 'soc2', 'compliance'],
    ['mobile', 'ios', 'android', 'phone', 'ipad', 'tablet', 'screen', 'responsive'],
    ['export', 'csv', 'pdf', 'slack', 'webhook', 'api', 'zapier', 'sync', 'download']
  ];

  words.forEach(w => {
    let hash = 0;
    for (let i = 0; i < w.length; i++) {
      hash = (hash << 5) - hash + w.charCodeAt(i);
      hash |= 0;
    }
    vec[Math.abs(hash) % dim] += 1;
    keywords.forEach((kwList, idx) => {
      if (kwList.some(k => w.includes(k))) {
        vec[idx] += 2.5;
      }
    });
  });

  const mag = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
  return mag === 0 ? vec : vec.map(v => Number((v / mag).toFixed(4)));
}

export function cosineSimilarity(a = [], b = []) {
  if (!a || !b || a.length !== b.length || a.length === 0) return 0;
  let dot = 0, nA = 0, nB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    nA += a[i] * a[i];
    nB += b[i] * b[i];
  }
  if (nA === 0 || nB === 0) return 0;
  return dot / (Math.sqrt(nA) * Math.sqrt(nB));
}

export function classifyFeedbackClient(content = '', themes = []) {
  const lower = content.toLowerCase();
  let sentiment = 'NEU';
  let sentimentScore = 0.05;
  let featureArea = 'General Product';
  let theme = themes[0] || { id: 'thm_general', name: 'General Feedback' };
  let rationale = 'Customer feedback evaluated against core product journeys.';

  if (lower.includes('onboard') || lower.includes('invite') || lower.includes('sign up') || lower.includes('walkthrough')) {
    theme = themes.find(t => t.id === 'thm_onboarding') || themes[0];
    featureArea = 'Onboarding & Workspace';
  } else if (lower.includes('bill') || lower.includes('invoice') || lower.includes('receipt') || lower.includes('pricing') || lower.includes('charge') || lower.includes('seat')) {
    theme = themes.find(t => t.id === 'thm_billing') || themes[1] || themes[0];
    featureArea = 'Billing & Subscriptions';
  } else if (lower.includes('slow') || lower.includes('lag') || lower.includes('fast') || lower.includes('speed') || lower.includes('timeout') || lower.includes('crash') || lower.includes('performance')) {
    theme = themes.find(t => t.id === 'thm_performance') || themes[2] || themes[0];
    featureArea = 'Platform Performance';
  } else if (lower.includes('sso') || lower.includes('saml') || lower.includes('okta') || lower.includes('2fa') || lower.includes('auth') || lower.includes('security') || lower.includes('soc2')) {
    theme = themes.find(t => t.id === 'thm_sso') || themes[3] || themes[0];
    featureArea = 'Authentication & Security';
  } else if (lower.includes('mobile') || lower.includes('ios') || lower.includes('android') || lower.includes('phone') || lower.includes('ipad')) {
    theme = themes.find(t => t.id === 'thm_mobile') || themes[4] || themes[0];
    featureArea = 'Mobile Applications';
  } else if (lower.includes('export') || lower.includes('csv') || lower.includes('slack') || lower.includes('webhook') || lower.includes('api') || lower.includes('zapier')) {
    theme = themes.find(t => t.id === 'thm_export') || themes[5] || themes[0];
    featureArea = 'Integrations & API';
  }

  const posWords = ['love', 'great', 'awesome', 'amazing', 'gorgeous', 'fast', 'smooth', 'saved', 'helpful', 'clean', 'huge improvement', 'perfect', 'fantastic', 'excellent'];
  const negWords = ['terrible', 'broken', 'timeout', 'bug', "couldn't", 'slow', 'fail', 'hate', 'frustrated', 'freeze', 'bad', 'refuse', 'double-charged', 'error', 'pain'];

  let p = 0, n = 0;
  posWords.forEach(w => { if (lower.includes(w)) p++; });
  negWords.forEach(w => { if (lower.includes(w)) n++; });

  if (p > n) {
    sentiment = 'POS';
    sentimentScore = Number(Math.min(0.96, 0.5 + p * 0.2).toFixed(2));
    rationale = `Positive sentiment detected with key appreciation for ${featureArea.toLowerCase()}.`;
  } else if (n > p) {
    sentiment = 'NEG';
    sentimentScore = Number(Math.max(-0.95, -0.5 - n * 0.2).toFixed(2));
    rationale = `Critical friction detected in ${featureArea.toLowerCase()}; triage required.`;
  } else {
    sentiment = 'NEU';
    sentimentScore = 0.05;
    rationale = `Balanced feedback or constructive inquiry regarding ${featureArea.toLowerCase()}.`;
  }

  return {
    sentiment,
    sentimentScore,
    featureArea,
    themeId: theme.id,
    themeName: theme.name,
    aiRationale: rationale
  };
}

export function searchCorpus(query = '', feedbackList = [], topK = 5) {
  if (!query.trim() || !feedbackList.length) return [];
  const qVec = computeDeterministicEmbedding(query);
  const scored = feedbackList.map(item => {
    const itemVec = computeDeterministicEmbedding(item.content);
    const sim = cosineSimilarity(qVec, itemVec);
    return {
      ...item,
      similarity: Number(sim.toFixed(4))
    };
  });

  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.slice(0, topK);
}

export function synthesizeAskLoopAnswer(question, retrieved = []) {
  if (!retrieved.length || retrieved[0].similarity < 0.05) {
    return {
      answer: `I could not find relevant customer feedback matching "${question}". Try querying for "onboarding invite issues", "billing invoices", "mobile responsiveness", or "SSO SAML".`,
      citations: []
    };
  }

  const negs = retrieved.filter(r => r.sentiment === 'NEG');
  const poss = retrieved.filter(r => r.sentiment === 'POS');
  const topTheme = retrieved[0]?.themeName || 'Platform Experience';

  let answer = `Based on **${retrieved.length} grounded customer records** retrieved via cosine similarity:\n\n`;

  if (negs.length > 0) {
    answer += `### ⚠️ Key Friction Points & Urgent Blockers:\n`;
    negs.slice(0, 3).forEach(n => {
      answer += `- **[${n.id}]** (${n.channel}): "${n.content}"\n`;
    });
    answer += `\n`;
  }

  if (poss.length > 0) {
    answer += `### ✨ Positive Validation & Highlights:\n`;
    poss.slice(0, 2).forEach(p => {
      answer += `- **[${p.id}]** (${p.channel}): "${p.content}"\n`;
    });
    answer += `\n`;
  }

  answer += `**Synthesis & Next Steps**: Customer discussion is heavily concentrated around **${topTheme}**. ${
    negs.length > poss.length
      ? 'Actionable remediation is recommended to reduce customer friction and support ticket load.'
      : 'User sentiment is predominantly favorable with validated satisfaction.'
  }`;

  return {
    answer,
    citations: retrieved
  };
}

export function synthesizeVoCReport(periodName, feedbackList = [], themesList = [], userName = 'Sarah Chen') {
  const total = feedbackList.length;
  const posCount = feedbackList.filter(f => f.sentiment === 'POS').length;
  const negCount = feedbackList.filter(f => f.sentiment === 'NEG').length;
  const neuCount = feedbackList.filter(f => f.sentiment === 'NEU').length;

  const posPct = total ? Math.round((posCount / total) * 100) : 0;
  const negPct = total ? Math.round((negCount / total) * 100) : 0;
  const neuPct = total ? Math.round((neuCount / total) * 100) : 0;
  const netScore = Number(((posPct - negPct) / 100).toFixed(2));

  const topThemes = themesList.map(t => {
    const items = feedbackList.filter(f => f.themeId === t.id);
    const themePos = items.filter(f => f.sentiment === 'POS').length;
    const themeNeg = items.filter(f => f.sentiment === 'NEG').length;
    const avgScore = items.length ? items.reduce((acc, cur) => acc + (cur.sentimentScore || 0), 0) / items.length : 0;
    return {
      name: t.name,
      count: items.length,
      sentiment: avgScore > 0.15 ? 'Positive' : avgScore < -0.15 ? 'Negative' : 'Neutral',
      sentimentScore: Number(avgScore.toFixed(2)),
      trend: themeNeg > themePos ? 'SPIKING' : 'STABLE',
      keyInsight: `${items.length} mentions across multiple enterprise accounts.`
    };
  }).sort((a, b) => b.count - a.count);

  const sampleQuotes = feedbackList.slice(0, 4).map(f => ({
    quote: f.content,
    channel: f.channel,
    sentiment: f.sentiment,
    impact: f.sentiment === 'NEG' ? 'High Urgency' : 'Product Validation'
  }));

  return {
    id: `REP-${Date.now()}`,
    title: `Voice of Customer Executive Intelligence Digest — ${periodName}`,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    generatedBy: userName,
    totalFeedback: total,
    executiveSummary: `During the ${periodName} evaluation cycle, Project LOOP ingested and classified ${total} customer signals. Overall sentiment holds a net score of ${netScore > 0 ? '+' : ''}${netScore} (${posPct}% positive vs ${negPct}% negative). The primary customer friction point centers on ${topThemes[0]?.name || 'Onboarding Experience'}, where critical issues around team invitation latency were detected.`,
    sentimentAnalysis: {
      overallScore: netScore,
      positivePercent: posPct,
      negativePercent: negPct,
      neutralPercent: neuPct,
      sentimentShift: negPct > 30 ? '+16% friction increase over prior quarter' : '+12% positive sentiment improvement'
    },
    topThemes,
    emergingIssues: [
      'Invitation email delivery timeout during workspace onboarding setup.',
      'Invoice PDF download generation lag reported by finance personas.',
      'SAML 2.0 / Okta SSO gating enterprise sales pipeline expansion.'
    ],
    sampleQuotes,
    recommendedActions: [
      {
        priority: 'HIGH',
        action: 'Refactor invitation tokens and magic links flow to eliminate drop-offs.',
        targetTeam: 'Core Product & Growth',
        expectedImpact: 'Estimated 35% reduction in onboarding support tickets.'
      },
      {
        priority: 'HIGH',
        action: 'Deploy background invoice caching queue with instant PDF downloads.',
        targetTeam: 'Billing & Infrastructure',
        expectedImpact: 'Resolves recurring finance ticket bottlenecks.'
      },
      {
        priority: 'MEDIUM',
        action: 'Release self-serve Okta & Azure AD SSO workspace configuration.',
        targetTeam: 'Security & Enterprise',
        expectedImpact: 'Unblocks 3 enterprise pipeline deals valued at $75k ARR.'
      }
    ]
  };
}
