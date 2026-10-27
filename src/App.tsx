/**
 * Main Application Component for Hafidz Quran Islamicity
 * Super-Application Infrastructure Platform
 */
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopNav } from './components/TopNav';
import { HeroSection } from './components/HeroSection';
import { QuranTracker } from './components/QuranTracker';
import { MemoryPalaceViewer } from './components/MemoryPalaceViewer';
import { TajweedAnalyzer } from './components/TajweedAnalyzer';
import { TeacherDashboard } from './components/TeacherDashboard';
import { GamificationCenter } from './components/GamificationCenter';
import { CommunityForum } from './components/CommunityForum';
import { ExportReportsModal } from './components/ExportReportsModal';
import { SyncBackupModal } from './components/SyncBackupModal';
import { ReminderModal } from './components/ReminderModal';
import { CheckCircle2, X, ShieldCheck, Heart } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, notificationBanner, dismissNotificationBanner, isFocusMode } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Bar */}
      <TopNav />

      {/* Dynamic Notification Toast - Silenced during Focus Mode */}
      {!isFocusMode && notificationBanner && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-slate-900 text-white dark:bg-emerald-950 dark:border-emerald-800 border border-slate-800 p-3.5 rounded-xl shadow-xl flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notificationBanner}</span>
          </div>
          <button
            onClick={dismissNotificationBanner}
            className="p-1 text-slate-400 hover:text-white rounded-md cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'tracker' && (
          <div className="space-y-6">
            {!isFocusMode && <HeroSection />}
            <QuranTracker />
          </div>
        )}

        {activeTab === 'palace' && <MemoryPalaceViewer />}
        {activeTab === 'tajweed' && <TajweedAnalyzer />}
        {activeTab === 'teacher' && <TeacherDashboard />}
        {activeTab === 'gamification' && <GamificationCenter />}
        {activeTab === 'community' && <CommunityForum />}
      </main>

      {/* Clean Footer - Hidden during Focus Mode for pure focus */}
      {!isFocusMode && (
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-12 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Hafidz Quran Islamicity
              </span>
              <span aria-hidden="true">·</span>
              <span>Berdasarkan Blueprint Kota Memori & Sistem Hafal Quran (SHQ)</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Bebas Iklan & Terenkripsi Lokal</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>Didukung Model Gemini AI 3.8</span>
            </div>
          </div>
        </footer>
      )}

      {/* Modals */}
      <ExportReportsModal />
      <SyncBackupModal />
      <ReminderModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
