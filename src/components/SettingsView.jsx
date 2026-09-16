// Project LOOP - Settings & AI Model Configurations (React JavaScript)
import React, { useState } from 'react';
import { 
  Key, 
  Settings, 
  RotateCcw, 
  Server, 
  ShieldAlert, 
  CheckCircle2, 
  Database,
  Sliders
} from 'lucide-react';

export default function SettingsView({
  apiKey = '',
  onSaveApiKey,
  feedbackList = [],
  onResetSeedData,
  activeWorkspace
}) {
  const [key, setKey] = useState(apiKey);
  const [model, setModel] = useState('claude-3-5-sonnet-20241022');
  const [temperature, setTemperature] = useState(0.2);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800/80">
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <span>Workspace & AI Engine Settings</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Manage AI model keys, multi-tenant workspace credentials, and deterministic database fixtures.
        </p>
      </div>

      {/* Anthropic Claude API Configuration */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5 text-white font-extrabold text-sm">
          <Key className="w-4 h-4 text-indigo-400" />
          <span>Anthropic Claude API Integration</span>
        </div>
        <p className="text-xs text-gray-400">
          Provide your Anthropic API key to run live Claude 3.5 Sonnet analysis for classification (AI1), grounded Q&A (AI3), and VoC Digests (AI4). If unconfigured, Project LOOP seamlessly operates with its built-in high-accuracy deterministic semantic engine.
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1">
              Anthropic API Key (sk-ant-api03-...)
            </label>
            <input
              type="password"
              placeholder="sk-ant-api03-xxxxxxxxxxxxxxxxxxxx"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full bg-slate-800 text-white rounded-xl px-4 py-2.5 border border-slate-700 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Active Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 border border-slate-700 text-xs font-medium"
              >
                <option value="claude-3-5-sonnet-20241022">claude-3-5-sonnet-20241022 (Recommended)</option>
                <option value="claude-3-haiku-20240307">claude-3-haiku-20240307 (Fast)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Temperature ({temperature})</label>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 mt-2"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onSaveApiKey(key)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              Save API Configuration
            </button>
          </div>
        </div>
      </div>

      {/* Active Workspace Details */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5 text-white font-extrabold text-sm">
          <Server className="w-4 h-4 text-indigo-400" />
          <span>Active Tenant Scoping</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700">
            <div className="text-gray-400 text-[11px]">Workspace Name</div>
            <div className="text-white font-bold mt-1">{activeWorkspace.name}</div>
          </div>
          <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700">
            <div className="text-gray-400 text-[11px]">Domain Scoping</div>
            <div className="text-white font-bold mt-1">{activeWorkspace.domain}</div>
          </div>
          <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700">
            <div className="text-gray-400 text-[11px]">Subscription Plan</div>
            <div className="text-indigo-400 font-bold mt-1">{activeWorkspace.plan}</div>
          </div>
        </div>
      </div>

      {/* Database & Seed Reset Utility */}
      <div className="bg-slate-900/90 border border-red-950/40 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5 text-red-400 font-extrabold text-sm">
          <ShieldAlert className="w-4 h-4" />
          <span>Seed Fixtures & Data Management</span>
        </div>
        <p className="text-xs text-gray-400">
          Reset local storage and re-hydrate the workspace with a fresh 135+ customer feedback dataset spanning 5 channels, 6 themes, and realistic sentiment distributions.
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="text-xs text-gray-400">
            Currently loaded: <strong className="text-white">{feedbackList.length} feedback items</strong>
          </div>
          <button
            onClick={onResetSeedData}
            className="bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 hover:text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset 135+ Seed Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
