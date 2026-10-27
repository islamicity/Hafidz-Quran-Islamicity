/**
 * Gamification & Motivation Center
 * Tailored for busy working adults with daily streaks, levels, badges, and healthy encouragement
 */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Heart, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Target,
  Smile
} from 'lucide-react';

export const GamificationCenter: React.FC = () => {
  const { gamification, addXP } = useApp();
  const [selectedPace, setSelectedPace] = useState<'super-busy' | 'moderate' | 'intensive'>('moderate');
  const [leaderboardUsers, setLeaderboardUsers] = useState([
    { rank: 1, name: 'Nurul Hidayati', level: 'Faris At-Tartil', xp: 1420, streak: 18, prayers: 42, isCurrentUser: false },
    { rank: 2, name: 'Anda (Santri)', level: gamification.levelTitle, xp: gamification.xp, streak: gamification.streakDays, prayers: 26, isCurrentUser: true },
    { rank: 3, name: 'Ahmad Faisal, S.T.', level: 'Mutsaqqaf Al-Quran', xp: 890, streak: 9, prayers: 31, isCurrentUser: false },
    { rank: 4, name: 'dr. Sarah Nabila', level: 'Thalib Istana Memori', xp: 620, streak: 6, prayers: 19, isCurrentUser: false },
    { rank: 5, name: 'Bambang Trianto', level: 'Thalib Pemula', xp: 480, streak: 4, prayers: 15, isCurrentUser: false },
  ]);

  const handleSendPrayer = (name: string, index: number) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    setLeaderboardUsers(prev => prev.map((u, i) => {
      if (i === index) {
        return { ...u, prayers: u.prayers + 1 };
      }
      return u;
    }));
    addXP(10, `Mengirim doa Baraka untuk ${name}`);
  };

  const nextLevelXP = gamification.level * 200;
  const currentLevelBaseXP = (gamification.level - 1) * 200;
  const xpInCurrentLevel = gamification.xp - currentLevelBaseXP;
  const xpNeeded = 200;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpNeeded) * 100)));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-800 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-200">
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>Sistem Motivasi & Istiqomah Harian</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pusat Gamifikasi Hafalan Al-Quran
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 max-w-xl leading-relaxed">
              Didesain khusus untuk para profesional dan orang dewasa. Menjaga semangat belajar tanpa rasa terbebani, 
              dengan perlindungan konsistensi harian dan pencapaian bertahap.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shrink-0">
            <div className="text-center px-2">
              <div className="text-xs text-amber-200">Level Anda</div>
              <div className="text-2xl font-bold font-mono text-white">
                {gamification.level}
              </div>
              <div className="text-[10px] text-amber-100 truncate max-w-[120px]">
                {gamification.levelTitle}
              </div>
            </div>

            <div className="w-px h-10 bg-white/20" />

            <div className="text-center px-2">
              <div className="text-xs text-amber-200">Streak Harian</div>
              <div className="text-2xl font-bold font-mono text-amber-300 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>{gamification.streakDays}</span>
              </div>
              <div className="text-[10px] text-amber-100">Hari Berturut</div>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/15">
          <div className="flex items-center justify-between text-xs text-amber-100 mb-1.5">
            <span>Menuju Level {gamification.level + 1}</span>
            <span className="font-mono">{xpInCurrentLevel} / {xpNeeded} XP ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-black/25 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-amber-300 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Adult Learning Presets Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Pilihan Ritme Belajar Khusus Orang Dewasa</span>
          </div>
          <span className="text-xs text-slate-400">Dapat diubah kapan saja</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setSelectedPace('super-busy')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              selectedPace === 'super-busy'
                ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold">Ritme Super Sibuk</span>
              <span className="text-[10px] text-slate-400">5-10 mnt/hari</span>
            </div>
            <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              1-2 Ayat / Hari
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Ideal untuk eksekutif, dokter, atau pekerja shift. Cukup 1 titik Istana Memori sebelum tidur atau ba'da Subuh.
            </p>
          </button>

          <button
            onClick={() => setSelectedPace('moderate')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              selectedPace === 'moderate'
                ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold">Ritme Moderat (Rekomendasi)</span>
              <span className="text-[10px] text-slate-400">15-20 mnt/hari</span>
            </div>
            <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              3-5 Ayat / Hari
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Menuntaskan 1 surat mulia (seperti Surah Al-Mulk) dalam tempo 6-8 hari dengan hafalan kokoh di LTM.
            </p>
          </button>

          <button
            onClick={() => setSelectedPace('intensive')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              selectedPace === 'intensive'
                ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold">Ritme Intensif Akhir Pekan</span>
              <span className="text-[10px] text-slate-400">30-40 mnt/hari</span>
            </div>
            <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              1 Halaman / Hari
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Memanfaatkan waktu luang Sabtu-Ahad untuk mental walk dan tasmi' rekaman tajwid penuh.
            </p>
          </button>
        </div>
      </div>

      {/* Badges & Achievements Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Lencana & Medali Prestasi
            </div>
            <div className="text-xs text-slate-500">
              Apresiasi atas setiap langkah istiqomah Anda
            </div>
          </div>
          <span className="text-xs text-emerald-600 font-semibold">
            {gamification.badges.filter(b => b.unlocked).length} / {gamification.badges.length} Terbuka
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {gamification.badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                badge.unlocked
                  ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50 dark:bg-slate-800/40'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                badge.unlocked
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
              }`}>
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{badge.title}</span>
                  {badge.unlocked && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {badge.description}
                </p>
                {badge.unlockedAt && (
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">
                    Diraih: {badge.unlockedAt}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Baraka Leaderboard */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Papan Semangat & Saling Mendoakan (Baraka Leaderboard)
            </div>
            <div className="text-xs text-slate-500">
              Bukan ajang riya', melainkan kompetisi dalam kebaikan (Fastabiqul Khairat)
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {leaderboardUsers.map((user, idx) => (
            <div
              key={user.name}
              className={`py-3 px-2 flex items-center justify-between gap-3 rounded-lg ${
                user.isCurrentUser ? 'bg-emerald-50/80 dark:bg-emerald-950/40 font-semibold' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                  idx === 0 ? 'bg-amber-400 text-amber-950' : idx === 1 ? 'bg-slate-300 text-slate-800' : idx === 2 ? 'bg-amber-600 text-white' : 'text-slate-500'
                }`}>
                  {user.rank}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{user.name}</span>
                    {user.isCurrentUser && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-600 text-white">Anda</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {user.level} · {user.streak} Hari Streak
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {user.xp} XP
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {user.prayers} Baraka
                  </div>
                </div>

                {!user.isCurrentUser && (
                  <button
                    onClick={() => handleSendPrayer(user.name, idx)}
                    className="p-1.5 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    title="Kirim Doa & Baraka"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    <span className="hidden sm:inline text-[11px]">Kirim Doa</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
