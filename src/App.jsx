// ============================================================================
// Project LOOP - Main App Component
// ============================================================================
// Description: Main root component for the AI Feedback Intelligence Platform.
// Manages global state (active tab, feedback items, team members, reports, toast)
// Written in pure React & JavaScript with clear, easy-to-debug state management.
// ============================================================================

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

// Import initial sample data
import {
  INITIAL_WORKSPACES,
  DEMO_USERS,
  INITIAL_THEMES,
  generateInitialFeedback
} from './data/mockData';

// Import AI helper functions
import { classifyFeedbackClient } from './utils/aiEngine';

// Import UI Components
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import FeedbackInbox from './components/FeedbackInbox';
import ThemesView from './components/ThemesView';
import AskLoop from './components/AskLoop';
import VocReports from './components/VocReports';
import TeamRbac from './components/TeamRbac';
import SettingsView from './components/SettingsView';
import IngestModal from './components/IngestModal';
import DetailDrawer from './components/DetailDrawer';
import Toast from './components/Toast';

export default function App() {
  // --------------------------------------------------------------------------
  // 1. Navigation & Workspace State
  // --------------------------------------------------------------------------
  const [currentTab, setCurrentTab] = useState('dashboard'); // 'dashboard', 'inbox', 'themes', 'ask', 'reports', 'team', 'settings'
  const [activeWorkspace, setActiveWorkspace] = useState(INITIAL_WORKSPACES[0]);
  const [currentUser, setCurrentUser] = useState(DEMO_USERS[0]); // Sarah Chen (ADMIN)

  // --------------------------------------------------------------------------
  // 2. Modals, Drawers & Notification State
  // --------------------------------------------------------------------------
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null); // Feedback item opened in right drawer
  const [toastMessage, setToastMessage] = useState(null); // { message: '...', type: 'success' | 'error' | 'info' }

  // --------------------------------------------------------------------------
  // 3. Persistent Data State (Saved to localStorage)
  // --------------------------------------------------------------------------

  // List of all feedback items
  const [feedbackList, setFeedbackList] = useState(() => {
    try {
      const saved = localStorage.getItem('loop_feedback_items');
      return saved ? JSON.parse(saved) : generateInitialFeedback();
    } catch (error) {
      console.error('Error loading feedback from storage:', error);
      return generateInitialFeedback();
    }
  });

  // List of themes (categories)
  const [themesList, setThemesList] = useState(() => {
    try {
      const saved = localStorage.getItem('loop_themes');
      return saved ? JSON.parse(saved) : INITIAL_THEMES;
    } catch (error) {
      console.error('Error loading themes from storage:', error);
      return INITIAL_THEMES;
    }
  });

  // List of team members
  const [teamMembers, setTeamMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('loop_team_members');
      return saved ? JSON.parse(saved) : DEMO_USERS;
    } catch (error) {
      console.error('Error loading team from storage:', error);
      return DEMO_USERS;
    }
  });

  // List of generated Voice of Customer (VoC) reports
  const [reportsList, setReportsList] = useState(() => {
    try {
      const saved = localStorage.getItem('loop_voc_reports');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading reports from storage:', error);
      return [];
    }
  });

  // Claude API Key for optional live Anthropic calls
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('loop_api_key') || '';
  });

  // --------------------------------------------------------------------------
  // 4. Save to localStorage whenever data changes
  // --------------------------------------------------------------------------
  useEffect(() => {
    localStorage.setItem('loop_feedback_items', JSON.stringify(feedbackList));
  }, [feedbackList]);

  useEffect(() => {
    localStorage.setItem('loop_themes', JSON.stringify(themesList));
  }, [themesList]);

  useEffect(() => {
    localStorage.setItem('loop_team_members', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('loop_voc_reports', JSON.stringify(reportsList));
  }, [reportsList]);

  // --------------------------------------------------------------------------
  // 5. Helper Functions (Toast notifications, Permissions, Reset Data)
  // --------------------------------------------------------------------------

  // Show a popup toast notification
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Check if current user has permission for an action (RBAC)
  const checkPermission = (actionName, allowedRoles = ['ADMIN', 'ANALYST']) => {
    if (!allowedRoles.includes(currentUser.role)) {
      showToast(`Permission Denied (403): Role '${currentUser.role}' cannot ${actionName}. Requires ${allowedRoles.join(' or ')}.`, 'error');
      return false;
    }
    return true;
  };

  // Reset database back to fresh 135+ seeded feedback items
  const handleResetSeedData = () => {
    const freshData = generateInitialFeedback();
    setFeedbackList(freshData);
    setThemesList(INITIAL_THEMES);
    setTeamMembers(DEMO_USERS);
    showToast('Database reset to fresh 135+ feedback items!', 'success');
    
    // Trigger confetti celebration
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.3 } });
    } catch (err) {
      // ignore confetti errors if library not ready
    }
  };

  // --------------------------------------------------------------------------
  // 6. Action Handlers (Feedback CRUD, Themes, Members, Reports)
  // --------------------------------------------------------------------------

  // Ingest a single feedback item
  const handleAddSingleFeedback = (newItem) => {
    // Run AI classification on the new text
    const aiResult = classifyFeedbackClient(newItem.content, themesList);

    const fullFeedbackItem = {
      id: `FB-${1000 + feedbackList.length + 1}`,
      content: newItem.content,
      channel: newItem.channel,
      customerLabel: newItem.customerLabel || 'Direct Ingestion',
      sentiment: aiResult.sentiment,
      sentimentScore: aiResult.sentimentScore,
      featureArea: aiResult.featureArea,
      themeId: aiResult.themeId,
      themeName: aiResult.themeName,
      aiRationale: aiResult.aiRationale,
      status: 'NEW',
      daysAgo: 0,
      createdAt: new Date().toISOString()
    };

    // Add to top of list
    setFeedbackList((prevList) => [fullFeedbackItem, ...prevList]);
    setIsIngestModalOpen(false);
    showToast('Feedback ingested and auto-classified with AI!', 'success');

    try {
      confetti({ particleCount: 40, spread: 50 });
    } catch (e) {}
  };

  // Ingest multiple items from CSV upload
  const handleAddBulkFeedback = (itemsArray) => {
    const newProcessedItems = itemsArray.map((item, index) => {
      const aiResult = classifyFeedbackClient(item.content, themesList);
      return {
        id: `FB-${1000 + feedbackList.length + index + 1}`,
        content: item.content,
        channel: item.channel || 'SUPPORT_TICKET',
        customerLabel: item.customerLabel || `CSV_Row_${index + 1}`,
        sentiment: aiResult.sentiment,
        sentimentScore: aiResult.sentimentScore,
        featureArea: aiResult.featureArea,
        themeId: aiResult.themeId,
        themeName: aiResult.themeName,
        aiRationale: aiResult.aiRationale,
        status: 'NEW',
        daysAgo: 0,
        createdAt: new Date().toISOString()
      };
    });

    setFeedbackList((prevList) => [...newProcessedItems, ...prevList]);
    setIsIngestModalOpen(false);
    showToast(`Successfully imported & classified ${newProcessedItems.length} items from CSV!`, 'success');

    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch (e) {}
  };

  // Update triage status (NEW -> REVIEWED -> ACTIONED)
  const handleUpdateStatus = (id, newStatus) => {
    if (!checkPermission('update triage status', ['ADMIN', 'ANALYST'])) return;

    setFeedbackList((prevList) =>
      prevList.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    // Update drawer item if currently open
    if (selectedFeedback && selectedFeedback.id === id) {
      setSelectedFeedback((prev) => ({ ...prev, status: newStatus }));
    }

    showToast(`Updated status for ${id} to ${newStatus}`, 'success');
  };

  // Delete feedback item (Admin only)
  const handleDeleteFeedback = (id) => {
    if (!checkPermission('delete feedback items', ['ADMIN'])) return;

    setFeedbackList((prevList) => prevList.filter((item) => item.id !== id));
    if (selectedFeedback && selectedFeedback.id === id) {
      setSelectedFeedback(null);
    }
    showToast(`Deleted feedback item ${id}`, 'info');
  };

  // Re-run AI classification on a single feedback item
  const handleReclassifyFeedback = (id) => {
    if (!checkPermission('re-classify feedback with AI', ['ADMIN', 'ANALYST'])) return;

    const targetItem = feedbackList.find((item) => item.id === id);
    if (!targetItem) return;

    const aiResult = classifyFeedbackClient(targetItem.content, themesList);

    setFeedbackList((prevList) =>
      prevList.map((item) => (item.id === id ? { ...item, ...aiResult } : item))
    );

    if (selectedFeedback && selectedFeedback.id === id) {
      setSelectedFeedback((prev) => ({ ...prev, ...aiResult }));
    }

    showToast(`Re-classified item ${id} with AI!`, 'success');
  };

  // Add new theme
  const handleCreateTheme = (newTheme) => {
    if (!checkPermission('create themes', ['ADMIN', 'ANALYST'])) return;
    setThemesList((prevList) => [...prevList, newTheme]);
    showToast(`Created theme category: ${newTheme.name}`, 'success');
  };

  // Save generated VoC report
  const handleSaveReport = (newReport) => {
    setReportsList((prevList) => [newReport, ...prevList]);
    showToast('Voice of Customer report generated and saved!', 'success');
  };

  // Invite team member
  const handleInviteMember = (newMember) => {
    if (!checkPermission('invite members', ['ADMIN'])) return;
    setTeamMembers((prevList) => [...prevList, newMember]);
    showToast(`Invited ${newMember.name} as ${newMember.role}!`, 'success');
  };

  // Change user role
  const handleUpdateRole = (userId, newRole) => {
    if (!checkPermission('change user roles', ['ADMIN'])) return;
    setTeamMembers((prevList) =>
      prevList.map((member) => (member.id === userId ? { ...member, role: newRole } : member))
    );
    showToast(`Updated user role to ${newRole}`, 'success');
  };

  // Save API key
  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('loop_api_key', key);
    showToast('Anthropic Claude API Key saved!', 'success');
  };

  // --------------------------------------------------------------------------
  // 7. Render JSX
  // --------------------------------------------------------------------------
  const newItemsCount = feedbackList.filter((f) => f.status === 'NEW').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-gray-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeWorkspace={activeWorkspace}
        setActiveWorkspace={setActiveWorkspace}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        feedbackCount={feedbackList.length}
        newFeedbackCount={newItemsCount}
        onOpenIngest={() => {
          if (checkPermission('ingest new feedback', ['ADMIN', 'ANALYST'])) {
            setIsIngestModalOpen(true);
          }
        }}
        onResetSeedData={handleResetSeedData}
        showToast={showToast}
      />

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 1: Dashboard */}
        {currentTab === 'dashboard' && (
          <Dashboard
            feedbackList={feedbackList}
            themesList={themesList}
            onNavigate={(tab) => setCurrentTab(tab)}
            onSelectFeedback={(item) => setSelectedFeedback(item)}
            onOpenIngest={() => {
              if (checkPermission('ingest feedback', ['ADMIN', 'ANALYST'])) {
                setIsIngestModalOpen(true);
              }
            }}
          />
        )}

        {/* Tab 2: Feedback Inbox */}
        {currentTab === 'inbox' && (
          <FeedbackInbox
            feedbackList={feedbackList}
            themesList={themesList}
            currentUser={currentUser}
            checkPermission={checkPermission}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteFeedback}
            onReclassify={handleReclassifyFeedback}
            onSelectDetail={(item) => setSelectedFeedback(item)}
            onOpenIngest={() => {
              if (checkPermission('ingest feedback', ['ADMIN', 'ANALYST'])) {
                setIsIngestModalOpen(true);
              }
            }}
          />
        )}

        {/* Tab 3: Themes & Trends */}
        {currentTab === 'themes' && (
          <ThemesView
            feedbackList={feedbackList}
            themesList={themesList}
            currentUser={currentUser}
            checkPermission={checkPermission}
            onSelectFeedback={(item) => setSelectedFeedback(item)}
            onCreateTheme={handleCreateTheme}
          />
        )}

        {/* Tab 4: Ask LOOP (RAG Copilot) */}
        {currentTab === 'ask' && (
          <AskLoop
            feedbackList={feedbackList}
            onSelectFeedback={(item) => setSelectedFeedback(item)}
          />
        )}

        {/* Tab 5: VoC Reports */}
        {currentTab === 'reports' && (
          <VocReports
            feedbackList={feedbackList}
            themesList={themesList}
            reportsList={reportsList}
            currentUser={currentUser}
            checkPermission={checkPermission}
            onSaveReport={handleSaveReport}
          />
        )}

        {/* Tab 6: Team & RBAC */}
        {currentTab === 'team' && (
          <TeamRbac
            teamMembers={teamMembers}
            currentUser={currentUser}
            checkPermission={checkPermission}
            onInviteMember={handleInviteMember}
            onUpdateRole={handleUpdateRole}
          />
        )}

        {/* Tab 7: Settings */}
        {currentTab === 'settings' && (
          <SettingsView
            apiKey={apiKey}
            onSaveApiKey={handleSaveApiKey}
            feedbackList={feedbackList}
            onResetSeedData={handleResetSeedData}
            activeWorkspace={activeWorkspace}
          />
        )}
      </main>

      {/* Ingest Feedback Modal */}
      {isIngestModalOpen && (
        <IngestModal
          themesList={themesList}
          onClose={() => setIsIngestModalOpen(false)}
          onAddSingle={handleAddSingleFeedback}
          onAddBulk={handleAddBulkFeedback}
        />
      )}

      {/* Detail Slide-Over Drawer */}
      {selectedFeedback && (
        <DetailDrawer
          item={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
          onUpdateStatus={handleUpdateStatus}
          onReclassify={handleReclassifyFeedback}
        />
      )}

      {/* Toast Notification Alert */}
      <Toast toast={toastMessage} />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-gray-500 flex flex-wrap items-center justify-between gap-3 no-print">
        <div>
          Project LOOP · Corporate-Grade AI Customer-Feedback Intelligence Platform · Pure React JS
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Vite 5 + React 18 + Chart.js + Tailwind CSS</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            System Ready & Scoped
          </span>
        </div>
      </footer>
    </div>
  );
}
