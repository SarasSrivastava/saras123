// Project LOOP - Team & Multi-Tenant RBAC Management (React JavaScript)
import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  CheckCircle, 
  XCircle, 
  Mail, 
  Briefcase 
} from 'lucide-react';

export default function TeamRbac({
  teamMembers = [],
  currentUser,
  checkPermission,
  onInviteMember,
  onUpdateRole
}) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('ANALYST');
  const [title, setTitle] = useState('');

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    if (!checkPermission('invite new workspace members', ['ADMIN'])) return;

    const newMember = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      title: title.trim() || 'Product Member',
      avatar: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 50000000)}?w=150&auto=format&fit=crop&q=80`
    };

    onInviteMember(newMember);
    setName('');
    setEmail('');
    setTitle('');
    setIsInviteModalOpen(false);
  };

  const permissionMatrix = [
    { action: 'View Dashboard & Aggregated Insights', admin: true, analyst: true, viewer: true },
    { action: 'Search Feedback & Ask LOOP AI', admin: true, analyst: true, viewer: true },
    { action: 'Ingest Single Feedback & CSV Datasets', admin: true, analyst: true, viewer: false },
    { action: 'Update Triage Status & Trigger Reclassification', admin: true, analyst: true, viewer: false },
    { action: 'Generate Executive VoC Intelligence Reports', admin: true, analyst: true, viewer: false },
    { action: 'Manage Team Members & Role Assignments', admin: true, analyst: false, viewer: false },
    { action: 'Delete Feedback Records & Workspace Config', admin: true, analyst: false, viewer: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Team & Role-Based Access Control (RBAC)</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              {teamMembers.length} Members
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Enterprise role hierarchy enforcing workspace data boundaries across Admin, Analyst, and Viewer permissions.
          </p>
        </div>

        <button
          onClick={() => {
            if (checkPermission('invite new workspace members', ['ADMIN'])) {
              setIsInviteModalOpen(true);
            }
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Team Members List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-2">Workspace Member Directory</h3>
        <div className="space-y-3">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="p-4 bg-slate-800/50 hover:bg-slate-800 rounded-2xl border border-slate-700/60 flex flex-wrap items-center justify-between gap-4 text-xs transition-all"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full border-2 border-indigo-500 object-cover shadow-sm"
                />
                <div>
                  <div className="font-extrabold text-white text-sm flex items-center gap-2">
                    <span>{member.name}</span>
                    {currentUser.id === member.id && (
                      <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.2 rounded-full border border-indigo-500/30">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-gray-400 text-xs mt-0.5">{member.email} • {member.title}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {currentUser.role === 'ADMIN' ? (
                  <select
                    value={member.role}
                    onChange={(e) => onUpdateRole(member.id, e.target.value)}
                    className="bg-slate-900 text-white rounded-xl px-3 py-1.5 border border-slate-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="ANALYST">ANALYST</option>
                    <option value="VIEWER">VIEWER</option>
                  </select>
                ) : (
                  <span className="font-mono font-bold text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-xl border border-indigo-800">
                    {member.role}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RBAC Permission Matrix Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">RBAC Hierarchy & Permission Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-slate-800/80 uppercase font-bold text-gray-400 border-b border-slate-700">
              <tr>
                <th className="p-3.5">Platform Capability</th>
                <th className="p-3.5 text-center">ADMIN</th>
                <th className="p-3.5 text-center">ANALYST</th>
                <th className="p-3.5 text-center">VIEWER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {permissionMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-medium text-gray-200">{row.action}</td>
                  <td className="p-3.5 text-center">
                    {row.admin ? (
                      <span className="text-emerald-400 font-bold inline-flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Allowed
                      </span>
                    ) : (
                      <span className="text-red-400 font-bold inline-flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Restricted
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    {row.analyst ? (
                      <span className="text-emerald-400 font-bold inline-flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Allowed
                      </span>
                    ) : (
                      <span className="text-red-400 font-bold inline-flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Restricted
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    {row.viewer ? (
                      <span className="text-emerald-400 font-bold inline-flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Allowed
                      </span>
                    ) : (
                      <span className="text-red-400 font-bold inline-flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Restricted
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs shadow-2xl">
            <h3 className="text-base font-extrabold text-white">Invite Workspace Member</h3>
            <form onSubmit={handleInviteSubmit} className="space-y-3">
              <div>
                <label className="text-gray-300 font-bold block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Lee"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 border border-slate-700"
                />
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="jordan@acme.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 border border-slate-700"
                />
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Product Manager"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 border border-slate-700"
                />
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Assigned Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 border border-slate-700 font-bold"
                >
                  <option value="ADMIN">ADMIN (Full Workspace & Member Controls)</option>
                  <option value="ANALYST">ANALYST (Ingest, Triage, Reports, AI)</option>
                  <option value="VIEWER">VIEWER (Read-Only Dashboard & Q&A)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-gray-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
