/**
 * Gamification & Motivation Center
 * Features a Visual 'Consistency Streak' Counter, 7-Day Rolling Heatmap,
 * Reward Badges showcase, Adult Pace Presets, and Healthy Community Leaderboard
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
  Calendar, 
  Shield, 
  Star, 
  ChevronRight, 
  Sunrise, 
  Check 
} from 'lucide-react';

export const GamificationCenter: React.FC = () => {
  const { gamification, addXP, checkInDailyStreak } = useApp();
  const [selectedPace, setSelectedPace] = useState<'super-busy' | 'moderate' | 'intensive'>('moderate');
  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(false);
  const [selectedRewardBadgeId, setSelectedRewardBadgeId] = useState<string>('b-streak-7');

  const [leaderboardUsers, setLeaderboardUsers] = useState([
    { rank: 1, name: 'Nurul Hidayati', level: 'Faris At-Tartil', xp: 1420, streak: 18, prayers: 42, isCurrentUser: false },
    { rank: 2, name: 'Anda (Santri)', level: gamification.levelTitle, xp: gamification.xp, streak: gamification.streakDays, prayers: 26, isCurrentUser: true },
    { rank: 3, name: 'Ahmad Faisal, S.T.', level: 'Mutsaqqaf Al-Quran', xp: 890, streak: 9, prayers: 31, isCurrentUser: false },
    { rank: 4, name: 'dr. Sarah Nabila', level: 'Thalib Kota Memori', xp: 620, streak: 6, prayers: 19, isCurrentUser: false },
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

  const handleManualCheckIn = () => {
    checkInDailyStreak();
    setHasCheckedInToday(true);
  };

  const handleCelebrateBadge = (badgeTitle: string) => {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.55 }
    });
    addXP(15, `Merayakan ${badgeTitle}`);
  };

  const nextLevelXP = gamification.level * 200;
  const currentLevelBaseXP = (gamification.level - 1) * 200;
  const xpInCurrentLevel = gamification.xp - currentLevelBaseXP;
  const xpNeeded = 200;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpNeeded) * 100)));

  // 7-Day Rolling Streak Week View
  const daysOfWeek = [
    { dayName: 'Sen', dayNumber: 1, label: 'Senin', ayahsDone: 3, isDone: gamification.streakDays >= 4 },
    { dayName: 'Sel', dayNumber: 2, label: 'Selasa', ayahsDone: 3, isDone: gamification.streakDays >= 3 },
    { dayName: 'Rab', dayNumber: 3, label: 'Rabu', ayahsDone: 2, isDone: gamification.streakDays >= 2 },
    { dayName: 'Kam', dayNumber: 4, label: 'Kamis', ayahsDone: 4, isDone: gamification.streakDays >= 1 },
    { dayName: 'Jum', dayNumber: 5, label: 'Jumat (Hari Ini)', ayahsDone: 2, isToday: true, isDone: true },
    { dayName: 'Sab', dayNumber: 6, label: 'Sabtu', ayahsDone: 0, isFuture: true },
    { dayName: 'Ahd', dayNumber: 7, label: 'Ahad', ayahsDone: 0, isFuture: true },
  ];

  // Consistency Streak Badges
  const streakMilestoneBadges = [
    {
      id: 'b3',
      title: 'Penjaga Subuh',
      daysTarget: 3,
      tier: 'Tingkat 1',
      description: 'Konsisten setoran ba\'da subuh 3 hari berturut-turut',
      rewardXP: 100,
      isUnlocked: gamification.streakDays >= 3,
      unlockedAt: '26 Okt 2026',
      iconName: 'Sunrise'
    },
    {
      id: 'b-streak-7',
      title: 'Lencana Istiqomah Sepekan',
      daysTarget: 7,
      tier: 'Tingkat 2',
      description: 'Konsisten hafalan 7 hari penuh tanpa memutus rantai memori',
      rewardXP: 250,
      isUnlocked: gamification.streakDays >= 7,
      unlockedAt: gamification.streakDays >= 7 ? 'Baru saja' : undefined,
      iconName: 'Flame'
    },
    {
      id: 'b-streak-14',
      title: 'Faris Al-Istiqomah',
      daysTarget: 14,
      tier: 'Tingkat 3',
      description: 'Menjaga hafalan 14 hari berturut-turut di sela kesibukan kerja',
      rewardXP: 500,
      isUnlocked: gamification.streakDays >= 14,
      unlockedAt: gamification.streakDays >= 14 ? 'Baru saja' : undefined,
      iconName: 'Shield'
    },
    {
      id: 'b-streak-30',
      title: 'Penjaga Wahyu Bulanan',
      daysTarget: 30,
      tier: 'Tingkat Emas',
      description: 'Mahkota konsistensi 30 hari penuh di Kota Memori Al-Quran',
      rewardXP: 1000,
      isUnlocked: gamification.streakDays >= 30,
      unlockedAt: gamification.streakDays >= 30 ? 'Baru saja' : undefined,
      iconName: 'Trophy'
    }
  ];

  const activeRewardBadge = streakMilestoneBadges.find(b => b.id === selectedRewardBadgeId) || streakMilestoneBadges[1];

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
              dengan pelacak konsistensi beruntun harian dan pencapaian bertahap.
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
                <Flame className="w-5 h-5 fill-amber-400 text-amber-400 animate-pulse" />
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

      {/* ------------------------------------------------------------------ */}
      {/* FEATURED: VISUAL CONSISTENCY STREAK COUNTER & REWARD BADGE HUB */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Header of Consistency Streak */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold relative shadow-xs">
              <Flame className="w-6 h-6 fill-amber-500" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                <span>Pelacak Konsistensi Menghafal</span>
                <span aria-hidden="true">·</span>
                <span>Consistency Streak</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
                <span>{gamification.streakDays} Hari Berturut-turut</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold">
                  Aktif
                </span>
              </h2>
            </div>
          </div>

          {/* Action: Check-in / Perpanjang Streak Hari Ini */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleManualCheckIn}
              disabled={hasCheckedInToday}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                hasCheckedInToday
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-emerald-500/20'
              }`}
            >
              {hasCheckedInToday ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Check-in Hari Ini Berhasil!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Check-in Hari Ini (+50 XP)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 7-Day Visual Week Streak Heatmap */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Kalender Mingguan Konsistensi (Target: 3 Ayat/Hari)</span>
            </div>
            <div className="text-slate-500 dark:text-slate-400">
              Pelindung Hari Sibuk (Streak Freeze): <strong className="text-emerald-600 dark:text-emerald-400">2/2 Siap</strong>
            </div>
          </div>

          {/* 7 Day Blocks Grid */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {daysOfWeek.map((day, idx) => {
              return (
                <div
                  key={day.dayName}
                  className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-between min-h-[92px] ${
                    day.isToday
                      ? 'border-amber-400 dark:border-amber-500 bg-amber-500/10 dark:bg-amber-950/30 ring-2 ring-amber-400/30 shadow-xs'
                      : day.isDone
                      ? 'border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 opacity-60'
                  }`}
                >
                  <span className={`text-[11px] font-bold ${
                    day.isToday ? 'text-amber-800 dark:text-amber-300' : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {day.dayName}
                  </span>

                  <div className="my-1">
                    {day.isDone ? (
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] text-slate-400">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                    {day.isDone ? `${day.ayahsDone} Ayat` : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Featured Consistency Reward Badge Showcase */}
        <div className="pt-2">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Lencana Penghargaan Konsistensi (Consistency Reward Badge)</span>
            </div>
            <span className="text-xs text-slate-500 font-normal">
              Target berikutnya: {7 - Math.min(7, gamification.streakDays)} hari lagi menuju Lencana Sepekan
            </span>
          </div>

          {/* Active Featured Badge Spotlight Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-slate-50 dark:from-amber-950/30 dark:via-emerald-950/20 dark:to-slate-850 border border-amber-300 dark:border-amber-700/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Grand Badge Insignia */}
              <div className="relative">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${
                  activeRewardBadge.isUnlocked
                    ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-amber-500/30 ring-4 ring-amber-300/40'
                    : 'bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 text-slate-400 ring-4 ring-slate-200 dark:ring-slate-700'
                }`}>
                  {activeRewardBadge.iconName === 'Sunrise' ? (
                    <Sunrise className="w-10 h-10 text-white drop-shadow-md" />
                  ) : activeRewardBadge.iconName === 'Flame' ? (
                    <Flame className="w-10 h-10 fill-amber-100 text-white drop-shadow-md" />
                  ) : activeRewardBadge.iconName === 'Shield' ? (
                    <Shield className="w-10 h-10 text-white drop-shadow-md" />
                  ) : (
                    <Trophy className="w-10 h-10 text-white drop-shadow-md" />
                  )}
                </div>
                {activeRewardBadge.isUnlocked && (
                  <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full shadow-xs flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> Diraih
                  </span>
                )}
              </div>

              {/* Badge Details */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    {activeRewardBadge.tier} · Target {activeRewardBadge.daysTarget} Hari
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    +{activeRewardBadge.rewardXP} XP Bonus
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeRewardBadge.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
                  {activeRewardBadge.description}
                </p>
                {activeRewardBadge.unlockedAt && (
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-0.5">
                    ✓ Dibuka pada: {activeRewardBadge.unlockedAt}
                  </div>
                )}
              </div>
            </div>

            {/* Celebrate or Progress Trigger */}
            <div className="flex items-center gap-2 shrink-0">
              {activeRewardBadge.isUnlocked ? (
                <button
                  onClick={() => handleCelebrateBadge(activeRewardBadge.title)}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Rayakan Lencana Ini!</span>
                </button>
              ) : (
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Progres: {gamification.streakDays}/{activeRewardBadge.daysTarget} Hari
                  </div>
                  <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1.5 overflow-hidden">
                    <div 
                      className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round((gamification.streakDays / activeRewardBadge.daysTarget) * 100))}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Badge Milestone Selector Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
            {streakMilestoneBadges.map((badge) => {
              const isSelected = selectedRewardBadgeId === badge.id;
              return (
                <button
                  key={badge.id}
                  onClick={() => setSelectedRewardBadgeId(badge.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 shadow-xs ring-1 ring-amber-500/40'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{badge.tier}</span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {badge.daysTarget} Hari
                    </span>
                  </div>
                  <div className="text-xs font-bold truncate">
                    {badge.title}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {badge.isUnlocked ? '✓ Terbuka' : `Kurang ${Math.max(0, badge.daysTarget - gamification.streakDays)} hari`}
                  </div>
                </button>
              );
            })}
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
              Ideal untuk eksekutif, dokter, atau pekerja shift. Cukup 1 titik Kota Memori sebelum tidur atau ba'da Subuh.
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
              Koleksi Seluruh Lencana & Medali Prestasi
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
