/**
 * Top Navigation Bar adhering to the Top Bar Contract:
 * [Brand title, one line] — [4-5 nav links, 1-2 word labels, single-line] — [1 primary action]
 */
import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  GraduationCap, 
  Users, 
  Trophy, 
  Moon, 
  Sun, 
  Cloud, 
  Bell, 
  Download,
  ShieldCheck
} from 'lucide-react';

export const TopNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    theme, 
    setTheme, 
    gamification,
    isOffline,
    cloudSyncStatus,
    setShowSyncModal,
    setShowReminderModal,
    setShowExportModal,
    fontSize,
    setFontSize
  } = useApp();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const cycleFontSize = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('huge');
    else setFontSize('normal');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, one line wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 font-bold text-lg">
            ح
          </div>
          <button 
            onClick={() => setActiveTab('tracker')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="text-base font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
              Hafidz Quran Islamicity
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block whitespace-nowrap">
              Sistem Hafal Quran · Kota Memori
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 nav links, single-line labels */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'tracker'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Pelacak Hafalan</span>
          </button>

          <button
            onClick={() => setActiveTab('palace')}
            className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'palace'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Kota Memori</span>
          </button>

          <button
            onClick={() => setActiveTab('tajweed')}
            className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'tajweed'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Volume2 className="w-4 h-4 text-sky-500" />
            <span>Tajwid AI</span>
          </button>

          <button
            onClick={() => setActiveTab('teacher')}
            className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'teacher'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-indigo-500" />
            <span>Dashboard Guru</span>
          </button>

          <button
            onClick={() => setActiveTab('gamification')}
            className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'gamification'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Gamifikasi ({gamification.streakDays}d)</span>
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'community'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-500" />
            <span>Komunitas</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action & utility controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick streak / XP badge */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <span className="text-amber-600 dark:text-amber-400 font-bold">⚡ {gamification.streakDays} Hari</span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{gamification.xp} XP</span>
          </div>

          {/* Sync status */}
          <button
            onClick={() => setShowSyncModal(true)}
            title={isOffline ? "Mode Offline Aktif" : `Status Cloud: ${cloudSyncStatus}`}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Cloud className={`w-4 h-4 ${isOffline ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'}`} />
          </button>

          {/* Reminder settings */}
          <button
            onClick={() => setShowReminderModal(true)}
            title="Pengingat Harian & Push Notifikasi"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Export Report */}
          <button
            onClick={() => setShowExportModal(true)}
            title="Ekspor Laporan PDF / Excel / CSV"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Font Scale toggle */}
          <button
            onClick={cycleFontSize}
            title={`Ukuran Huruf: ${fontSize}`}
            className="px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            A{fontSize === 'large' ? '+' : fontSize === 'huge' ? '++' : ''}
          </button>

          {/* Dark Mode toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => setActiveTab('tajweed')}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <span>Setor Tilawah</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Strip */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1.5 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('tracker')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${activeTab === 'tracker' ? 'font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Hafalan
        </button>
        <button
          onClick={() => setActiveTab('palace')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${activeTab === 'palace' ? 'font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Kota Memori
        </button>
        <button
          onClick={() => setActiveTab('tajweed')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${activeTab === 'tajweed' ? 'font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Tajwid AI
        </button>
        <button
          onClick={() => setActiveTab('teacher')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${activeTab === 'teacher' ? 'font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Guru
        </button>
        <button
          onClick={() => setActiveTab('gamification')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${activeTab === 'gamification' ? 'font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Gamifikasi
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${activeTab === 'community' ? 'font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Komunitas
        </button>
      </div>
    </header>
  );
};
