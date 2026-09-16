// Project LOOP - Semantic Search & RAG Grounding Engine
// Embeddings generation, Cosine Vector Similarity, and Ask LOOP Retrieval-Grounded Q&A

import Anthropic from '@anthropic-ai/sdk';

/**
 * Computes cosine similarity between two numeric vectors
 */
export function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Lightweight deterministic vector generator for text based on semantic word hashing and term frequencies.
 * Produces a normalized 64-dimensional vector for fast client/server cosine search.
 */
export function generateSemanticVector(text) {
  const dim = 64;
  const vector = new Array(dim).fill(0);
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);

  if (words.length === 0) return vector;

  // Semantic term clusters to give meaningful vector geometry
  const keywordsCluster = {
    0: ['onboard', 'welcome', 'signup', 'invite', 'team', 'member', 'start', 'first'],
    1: ['bill', 'invoice', 'pricing', 'charge', 'cost', 'subscription', 'credit', 'payment', 'card'],
    2: ['slow', 'lag', 'speed', 'fast', 'performance', 'timeout', 'crash', 'freeze', 'latency'],
    3: ['sso', 'saml', 'okta', 'auth', 'security', '2fa', 'login', 'enterprise', 'compliance'],
    4: ['mobile', 'ios', 'android', 'phone', 'tablet', 'app', 'store', 'notification'],
    5: ['export', 'csv', 'pdf', 'download', 'api', 'webhook', 'zapier', 'integration', 'sync'],
    6: ['ui', 'ux', 'dashboard', 'interface', 'button', 'filter', 'search', 'navigation', 'theme'],
    7: ['support', 'help', 'ticket', 'customer', 'chat', 'response', 'sla', 'email'],
    8: ['bug', 'broken', 'error', 'failed', 'issue', 'glitch', 'problem', 'fix'],
    9: ['love', 'great', 'awesome', 'amazing', 'happy', 'smooth', 'delighted', 'good'],
  };

  words.forEach((word) => {
    // Hash word to index
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = (hash << 5) - hash + word.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % dim;
    vector[idx] += 1;

    // Add semantic cluster weights
    Object.entries(keywordsCluster).forEach(([clusterIdx, clusterWords]) => {
      if (clusterWords.some((kw) => word.includes(kw))) {
        vector[parseInt(clusterIdx, 10)] += 3.0;
      }
    });
  });

  // Normalize to unit vector
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return norm === 0 ? vector : vector.map((v) => Number((v / norm).toFixed(6)));
}

/**
 * Searches feedback corpus using Cosine Similarity against the query vector
 */
export function searchSimilarFeedback(query, corpus = [], topK = 5) {
  const queryVector = generateSemanticVector(query);
  const scored = corpus.map((item) => {
    let itemVector;
    if (item.vector && item.vector.length > 0) {
      itemVector = item.vector;
    } else if (item.rawVector) {
      try {
        itemVector = JSON.parse(item.rawVector);
      } catch {
        itemVector = generateSemanticVector(item.content);
      }
    } else {
      itemVector = generateSemanticVector(item.content);
    }

    const similarity = cosineSimilarity(queryVector, itemVector);
    return {
      id: item.id,
      content: item.content,
      channel: item.channel,
      customerLabel: item.customerLabel,
      sentiment: item.sentiment,
      similarity: Number(similarity.toFixed(4)),
      createdAt: item.createdAt,
    };
  });

  // Sort descending by similarity
  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.slice(0, topK);
}

/**
 * AI3: Grounded Q&A against retrieved customer feedback
 */
export async function askLoopGroundedQA(question, retrievedFeedback = []) {
  if (retrievedFeedback.length === 0 || retrievedFeedback[0].similarity < 0.05) {
    return {
      answer: `I could not find any customer feedback in your workspace relating to "${question}". Please try asking about onboarding, billing, speed, SSO, mobile, or exports.`,
      citedFeedback: [],
      totalGroundingItems: 0,
    };
  }

  const contextText = retrievedFeedback
    .map(
      (fb, idx) =>
        `[#${idx + 1} | ID: ${fb.id} | Channel: ${fb.channel} | Sentiment: ${fb.sentiment}]: "${fb.content}"`
    )
    .join('\n');

  const systemPrompt = `You are "Ask LOOP", an evidence-grounded AI intelligence assistant for product teams.
You must answer questions strictly and ONLY based on the provided customer feedback snippets below.
DO NOT hallucinate or invent customer feedback that is not present in the context.
Always cite the specific feedback IDs (e.g. [FB-1042] or [#1]) when making points or sharing customer quotes.
If the provided context does not contain enough information to answer, state clearly that no relevant customer feedback was found on that specific detail.`;

  const userPrompt = `Context customer feedback retrieved for this query:
${contextText}

Question: ${question}

Provide a concise, direct, product-actionable answer quoting and citing specific feedback items.`;

  try {
    if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'mock-key') {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 800,
        temperature: 0.1,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });

      const text = message.content[0].type === 'text' ? message.content[0].text : '';
      return {
        answer: text,
        citedFeedback: retrievedFeedback.map((fb) => ({
          id: fb.id,
          snippet: fb.content.length > 80 ? fb.content.substring(0, 80) + '...' : fb.content,
          channel: fb.channel,
          sentiment: fb.sentiment,
          similarity: fb.similarity,
        })),
        totalGroundingItems: retrievedFeedback.length,
      };
    }
  } catch (err) {
    console.warn('Anthropic API call in Ask LOOP failed, using grounded answer synthesizer:', err);
  }

  // High-fidelity grounded answer generator
  const negativeItems = retrievedFeedback.filter((f) => f.sentiment === 'NEG');
  const positiveItems = retrievedFeedback.filter((f) => f.sentiment === 'POS');

  let answer = `Based on **${retrievedFeedback.length} retrieved feedback items** regarding your query:\n\n`;

  if (negativeItems.length > 0) {
    answer += `### ⚠️ Key Friction Points & Complaints:\n`;
    negativeItems.slice(0, 3).forEach((item) => {
      answer += `- **[${item.id}]** (${item.channel}): "${item.content}"\n`;
    });
    answer += `\n`;
  }

  if (positiveItems.length > 0) {
    answer += `### ✨ Positive Validation & Highlights:\n`;
    positiveItems.slice(0, 2).forEach((item) => {
      answer += `- **[${item.id}]** (${item.channel}): "${item.content}"\n`;
    });
    answer += `\n`;
  }

  answer += `**Summary**: Customers are actively discussing this area with ${Math.round(
    (positiveItems.length / retrievedFeedback.length) * 100
  )}% positive vs ${Math.round(
    (negativeItems.length / retrievedFeedback.length) * 100
  )}% critical remarks. Grounded evidence was retrieved from ${[
    ...new Set(retrievedFeedback.map((f) => f.channel)),
  ].join(', ')}.`;

  return {
    answer,
    citedFeedback: retrievedFeedback.map((fb) => ({
      id: fb.id,
      snippet: fb.content.length > 80 ? fb.content.substring(0, 80) + '...' : fb.content,
      channel: fb.channel,
      sentiment: fb.sentiment,
      similarity: fb.similarity,
    })),
    totalGroundingItems: retrievedFeedback.length,
  };
}
