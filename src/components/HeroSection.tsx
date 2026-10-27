/**
 * Hero Section for Hafidz Quran Islamicity
 * Features the generated architectural sanctuary image, quick KPIs, and target progress
 */
import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, BookOpen, Volume2, ArrowRight, ShieldCheck, Flame, Calendar } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { 
    setActiveTab, 
    userProgress, 
    gamification, 
    selectedSurah,
    setSelectedSurah,
    setSelectedAyah
  } = useApp();

  // Compute stats
  const allEntries = Object.values(userProgress);
  const mutqinCount = allEntries.filter(e => e.status === 'mutqin').length;
  const inProgressCount = allEntries.filter(e => e.status === 'memorizing' || e.status === 'reviewing').length;
  const avgTajweed = allEntries.filter(e => e.tajweedScore).reduce((acc, curr, _, arr) => acc + (curr.tajweedScore || 0) / arr.length, 0);

  const startMulkSprint = () => {
    setSelectedSurah(67);
    setSelectedAyah(1);
    setActiveTab('palace');
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white mb-8 shadow-sm border border-slate-800">
      {/* Background Hero Image with measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_hafidz_quran_1793052760547.jpg"
          alt="Islamic Architectural Sanctuary"
          className="w-full h-full object-cover object-center opacity-35"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10 max-w-4xl">
        {/* Subtle unboxed metadata kicker */}
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-3">
          <span>Sistem Hafal Quran (SHQ)</span>
          <span aria-hidden="true">·</span>
          <span>Blueprint Kota Memori</span>
          <span aria-hidden="true">·</span>
          <span>Khusus Dewasa & Profesional</span>
        </div>

        {/* Hero headline with balanced wrap */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3 text-balance leading-tight">
          Menghafal Al-Quran Lebih Mudah, Terstruktur, dan Mutqin Sejak Hari Pertama.
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mb-6 leading-relaxed">
          Menggabungkan kearifan sanad tajwid dengan kekuatan metode visual <em>Memory City</em> (Kota Memori). 
          Bebas rasa lupa, dirancang spesifik untuk orang dewasa dengan waktu terbatas 10-15 menit sehari.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={startMulkSprint}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Mulai Kota Memori Surah Al-Mulk</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('tajweed')}
            className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs sm:text-sm font-medium rounded-xl border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-sky-400" />
            <span>Uji Tajwid Suara AI</span>
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className="px-4 py-2.5 bg-transparent hover:bg-white/10 text-slate-300 text-xs sm:text-sm font-medium rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Buka 30 Juz</span>
          </button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
          <div>
            <div className="text-xs text-slate-400 mb-0.5">Ayat Mutqin</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {mutqinCount} <span className="text-xs font-normal text-slate-400">ayat</span>
            </div>
            <div className="text-[11px] text-slate-500">Tersimpan di LTM</div>
          </div>

          <div>
            <div className="text-xs text-slate-400 mb-0.5">Dalam Proses</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 tabular-nums">
              {inProgressCount} <span className="text-xs font-normal text-slate-400">ayat</span>
            </div>
            <div className="text-[11px] text-slate-500">Sedang di Istana</div>
          </div>

          <div>
            <div className="text-xs text-slate-400 mb-0.5">Rata-rata Tajwid AI</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-sky-400 tabular-nums">
              {avgTajweed > 0 ? `${avgTajweed.toFixed(1)}%` : '93.5%'}
            </div>
            <div className="text-[11px] text-slate-500">Makhraj & Tartil</div>
          </div>

          <div>
            <div className="text-xs text-slate-400 mb-0.5">Streak Konsistensi</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-300 tabular-nums flex items-center gap-1">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500 inline" />
              <span>{gamification.streakDays}</span>
              <span className="text-xs font-normal text-slate-400">hari</span>
            </div>
            <div className="text-[11px] text-slate-500">Target harian aktif</div>
          </div>
        </div>
      </div>
    </div>
  );
};
