// Project LOOP - Multi-Channel & CSV Ingestion Modal (React JavaScript)
import React, { useState } from 'react';
import Papa from 'papaparse';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function IngestModal({
  themesList = [],
  onClose,
  onAddSingle,
  onAddBulk
}) {
  const [activeTab, setActiveTab] = useState('single'); // 'single' | 'bulk'

  // Single form state
  const [content, setContent] = useState('');
  const [channel, setChannel] = useState('SUPPORT_TICKET');
  const [customerLabel, setCustomerLabel] = useState('');

  // Bulk CSV state
  const [csvFile, setCsvFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState('');

  const handleSingleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAddSingle({
      content: content.trim(),
      channel,
      customerLabel: customerLabel.trim() || 'Direct Ingestion'
    });
  };

  const handleCsvChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    setIsParsing(true);
    setParseError('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsParsing(false);
        if (results.errors && results.errors.length > 0) {
          console.warn('PapaParse warnings:', results.errors);
        }

        const data = results.data;
        if (!data || data.length === 0) {
          setParseError('CSV file appears to be empty.');
          return;
        }

        // Map column variations
        const mapped = data.map((row, idx) => {
          const text = row.content || row.feedback || row.text || row.comment || row.message || Object.values(row)[0] || '';
          const chan = row.channel || row.source || 'SUPPORT_TICKET';
          const label = row.customer || row.user || row.email || row.account || `CSV_Row_${idx + 1}`;
          return {
            content: String(text).trim(),
            channel: String(chan).toUpperCase().replace(/\s+/g, '_'),
            customerLabel: String(label).trim()
          };
        }).filter(r => r.content.length > 0);

        setParsedRows(mapped);
      },
      error: (err) => {
        setIsParsing(false);
        setParseError(`Failed to parse CSV: ${err.message}`);
      }
    });
  };

  const handleBulkSubmit = () => {
    if (!parsedRows.length) return;
    onAddBulk(parsedRows);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-5 text-xs shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Ingest Customer Feedback</h3>
              <p className="text-gray-400 text-[11px]">Instant automated AI sentiment and theme classification.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('single')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'single' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Single Verbatim Entry
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'bulk' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Bulk CSV Ingest
          </button>
        </div>

        {/* Single Ingest Form */}
        {activeTab === 'single' && (
          <form onSubmit={handleSingleSubmit} className="space-y-3.5">
            <div>
              <label className="text-gray-300 font-bold block mb-1">
                Verbatim Feedback Content <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Paste customer support message, App Store review, or sales call transcript note..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-800 text-white rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-gray-300 font-bold block mb-1">Source Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 border border-slate-700 font-medium"
                >
                  <option value="SUPPORT_TICKET">Support Ticket</option>
                  <option value="APP_STORE">App Store</option>
                  <option value="NPS_SURVEY">NPS Survey</option>
                  <option value="SALES_CALL">Sales Call</option>
                  <option value="COMMUNITY_POST">Community Post</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Customer Identifier / Segment</label>
                <input
                  type="text"
                  placeholder="e.g. Enterprise / Fortune 500"
                  value={customerLabel}
                  onChange={(e) => setCustomerLabel(e.target.value)}
                  className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 border border-slate-700"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!content.trim()}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ingest & Run AI</span>
              </button>
            </div>
          </form>
        )}

        {/* Bulk CSV Ingest Form */}
        {activeTab === 'bulk' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-6 text-center space-y-2 cursor-pointer bg-slate-800/40 transition-colors">
              <input
                type="file"
                accept=".csv"
                id="csv-file-upload"
                onChange={handleCsvChange}
                className="hidden"
              />
              <label htmlFor="csv-file-upload" className="cursor-pointer block">
                <FileSpreadsheet className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <div className="text-white font-bold">
                  {csvFile ? csvFile.name : 'Click to select or drop a CSV file'}
                </div>
                <div className="text-[11px] text-gray-400 mt-1">
                  Accepts columns: <code>content</code>, <code>channel</code>, <code>customer</code>
                </div>
              </label>
            </div>

            {isParsing && (
              <div className="text-center text-indigo-400 font-medium py-2">
                Parsing CSV records...
              </div>
            )}

            {parseError && (
              <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{parseError}</span>
              </div>
            )}

            {parsedRows.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-300 font-bold">
                  <span>Preview ({parsedRows.length} feedback records found)</span>
                  <span className="text-emerald-400">Ready to Classify</span>
                </div>
                <div className="max-h-36 overflow-y-auto bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-2 custom-scrollbar">
                  {parsedRows.slice(0, 5).map((r, i) => (
                    <div key={i} className="text-[11px] text-gray-300 border-b border-slate-700/60 pb-1 last:border-0">
                      <span className="font-bold text-indigo-400">[{r.channel}]</span> "{r.content}"
                    </div>
                  ))}
                  {parsedRows.length > 5 && (
                    <div className="text-[10px] text-gray-400 text-center italic">
                      + {parsedRows.length - 5} more items...
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkSubmit}
                disabled={!parsedRows.length}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Import & Auto-Classify ({parsedRows.length})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
