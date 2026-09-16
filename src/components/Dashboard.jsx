// Project LOOP - Executive Dashboard Component (React JavaScript)
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  Sparkles, 
  ArrowUpRight, 
  Layers, 
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Dashboard({
  feedbackList = [],
  themesList = [],
  onNavigate,
  onSelectFeedback,
  onOpenIngest
}) {
  const total = feedbackList.length;
  const posCount = feedbackList.filter((f) => f.sentiment === 'POS').length;
  const negCount = feedbackList.filter((f) => f.sentiment === 'NEG').length;
  const neuCount = feedbackList.filter((f) => f.sentiment === 'NEU').length;
  const posPercent = total ? Math.round((posCount / total) * 100) : 0;
  const negPercent = total ? Math.round((negCount / total) * 100) : 0;
  const neuPercent = total ? Math.round((neuCount / total) * 100) : 0;
  const netScore = total ? Math.round(((posCount - negCount) / total) * 100) : 0;
  const newThisWeek = feedbackList.filter((f) => f.daysAgo <= 7).length;

  const volumeCanvas = useRef(null);
  const donutCanvas = useRef(null);
  const themesCanvas = useRef(null);

  useEffect(() => {
    let vChart, dChart, tChart;

    if (volumeCanvas.current) {
      vChart = new Chart(volumeCanvas.current, {
        type: 'bar',
        data: {
          labels: ['4 Wks Ago', '3 Wks Ago', '2 Wks Ago', 'This Week'],
          datasets: [
            { 
              label: 'Positive', 
              data: [14, 22, 19, posCount], 
              backgroundColor: '#10b981', 
              borderRadius: 6,
              barPercentage: 0.6
            },
            { 
              label: 'Neutral', 
              data: [9, 12, 10, neuCount], 
              backgroundColor: '#64748b', 
              borderRadius: 6,
              barPercentage: 0.6
            },
            { 
              label: 'Negative', 
              data: [16, 18, 14, negCount], 
              backgroundColor: '#ef4444', 
              borderRadius: 6,
              barPercentage: 0.6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { 
              position: 'top',
              labels: { color: '#94a3b8', font: { size: 11, weight: 'bold' }, boxWidth: 12, usePointStyle: true } 
            }
          },
          scales: {
            x: { 
              stacked: true, 
              grid: { color: '#1e293b' }, 
              ticks: { color: '#94a3b8', font: { size: 11 } } 
            },
            y: { 
              stacked: true, 
              grid: { color: '#1e293b' }, 
              ticks: { color: '#94a3b8', font: { size: 11 } } 
            }
          }
        }
      });
    }

    if (donutCanvas.current) {
      dChart = new Chart(donutCanvas.current, {
        type: 'doughnut',
        data: {
          labels: ['Positive', 'Neutral', 'Negative'],
          datasets: [{ 
            data: [posCount, neuCount, negCount], 
            backgroundColor: ['#10b981', '#64748b', '#ef4444'], 
            borderWidth: 0,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { 
            legend: { 
              position: 'bottom', 
              labels: { color: '#94a3b8', font: { size: 11, weight: 'bold' }, boxWidth: 12, usePointStyle: true } 
            } 
          },
          cutout: '72%'
        }
      });
    }

    if (themesCanvas.current) {
      tChart = new Chart(themesCanvas.current, {
        type: 'bar',
        data: {
          labels: themesList.map((t) => t.name.slice(0, 18)),
          datasets: [{
            label: 'Mentions',
            data: themesList.map((t) => feedbackList.filter((f) => f.themeId === t.id).length),
            backgroundColor: themesList.map((t) => t.color || '#6366f1'),
            borderRadius: 6,
            barPercentage: 0.7
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8', font: { size: 11 } } },
            y: { grid: { display: false }, ticks: { color: '#e2e8f0', font: { size: 11, weight: 'bold' } } }
          }
        }
      });
    }

    return () => {
      if (vChart) vChart.destroy();
      if (dChart) dChart.destroy();
      if (tChart) tChart.destroy();
    };
  }, [feedbackList, themesList]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner / Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Executive Feedback Intelligence</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              Live AI Pipeline
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time aggregated synthesis across {total} multi-channel customer records with automated sentiment classification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('ask')}
            className="bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-300 hover:text-white px-3.5 py-2 rounded-xl border border-indigo-700/50 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Ask LOOP AI</span>
          </button>
          <button
            onClick={onOpenIngest}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
          >
            <span>+ Ingest Feedback</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Total Ingested</span>
            <MessageSquare className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5">{total}</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            ↑ {newThisWeek} new this week
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Net Sentiment</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className={`text-2xl font-black mt-1.5 ${netScore >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {netScore > 0 ? `+${netScore}` : netScore}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">Scale: -100 to +100</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Positive Feedback</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1.5">{posPercent}%</div>
          <div className="text-[11px] text-gray-400 mt-1">{posCount} customer mentions</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Negative Friction</span>
            <TrendingDown className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400 mt-1.5">{negPercent}%</div>
          <div className="text-[11px] text-red-400/80 mt-1">{negCount} urgent complaints</div>
        </div>
      </div>

      {/* Primary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Volume & Sentiment Trend</h3>
              <p className="text-[11px] text-gray-400">Weekly breakdown of incoming customer feedback.</p>
            </div>
            <span className="text-[10px] font-bold bg-slate-800 px-2 py-1 rounded-lg text-gray-300">
              Last 4 Weeks
            </span>
          </div>
          <div className="h-64">
            <canvas ref={volumeCanvas}></canvas>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Sentiment Ratio</h3>
              <p className="text-[11px] text-gray-400">Distribution across active corpus.</p>
            </div>
          </div>
          <div className="h-64">
            <canvas ref={donutCanvas}></canvas>
          </div>
        </div>
      </div>

      {/* Secondary Grid: Top Themes & Recent Feedback Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Top Theme Categories</h3>
              <p className="text-[11px] text-gray-400">Volume indexed by AI topic clustering.</p>
            </div>
            <button 
              onClick={() => onNavigate('themes')} 
              className="text-xs text-indigo-400 font-bold hover:text-indigo-300 flex items-center gap-0.5"
            >
              <span>Explore</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-64">
            <canvas ref={themesCanvas}></canvas>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <h3 className="text-sm font-bold text-white">Recent Customer Signals</h3>
              <p className="text-[11px] text-gray-400">Latest verbatim incoming feedback items.</p>
            </div>
            <button
              onClick={() => onNavigate('inbox')}
              className="text-xs text-indigo-400 font-bold hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View All Inbox ({feedbackList.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {feedbackList.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectFeedback(item)}
                className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/60 cursor-pointer flex flex-wrap items-center justify-between gap-3 text-xs transition-all group hover:border-indigo-500/50"
              >
                <div className="flex-1 min-w-[240px]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-indigo-400 group-hover:underline">
                      {item.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.sentiment === 'POS'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : item.sentiment === 'NEG'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-slate-700 text-gray-300'
                      }`}
                    >
                      {item.sentiment} ({item.sentimentScore > 0 ? `+${item.sentimentScore}` : item.sentimentScore})
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold bg-slate-800 px-2 py-0.5 rounded">
                      {item.themeName}
                    </span>
                  </div>
                  <p className="text-gray-200 line-clamp-1 font-medium">"{item.content}"</p>
                </div>

                <div className="flex items-center gap-3 text-gray-400 text-[11px]">
                  <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700 font-semibold">
                    {item.channel}
                  </span>
                  <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
