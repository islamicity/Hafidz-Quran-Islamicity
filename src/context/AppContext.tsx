/**
 * Central State & Offline-First Persistence for Hafidz Quran Islamicity
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  UserAyahProgress, 
  MemorizationStatus, 
  GamificationState, 
  StudentProgress, 
  ForumPost, 
  DailyReminderConfig, 
  AppLanguage, 
  AppTheme 
} from '../types';

interface AppContextType {
  activeTab: 'tracker' | 'palace' | 'tajweed' | 'teacher' | 'gamification' | 'community';
  setActiveTab: (tab: 'tracker' | 'palace' | 'tajweed' | 'teacher' | 'gamification' | 'community') => void;
  selectedSurah: number;
  setSelectedSurah: (surahNumber: number) => void;
  selectedAyah: number;
  setSelectedAyah: (ayahNumber: number) => void;
  userProgress: Record<string, UserAyahProgress>;
  updateAyahStatus: (surah: number, ayah: number, status: MemorizationStatus, tajweedScore?: number) => void;
  getAyahStatus: (surah: number, ayah: number) => MemorizationStatus;
  gamification: GamificationState;
  addXP: (amount: number, reason?: string) => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  fontSize: 'normal' | 'large' | 'huge';
  setFontSize: (size: 'normal' | 'large' | 'huge') => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  isOffline: boolean;
  cloudSyncStatus: 'synced' | 'syncing' | 'offline' | 'pending';
  lastSyncedTime: string;
  syncToken: string;
  triggerManualSync: () => Promise<void>;
  reminders: DailyReminderConfig[];
  updateReminders: (newReminders: DailyReminderConfig[]) => void;
  students: StudentProgress[];
  updateStudentNote: (studentId: string, note: string, newStatus?: StudentProgress['status']) => void;
  forumPosts: ForumPost[];
  addForumPost: (title: string, content: string, surahTag: string) => void;
  likeForumPost: (postId: string) => void;
  addForumReply: (postId: string, content: string) => void;
  notificationBanner: string | null;
  dismissNotificationBanner: () => void;
  showExportModal: boolean;
  setShowExportModal: (val: boolean) => void;
  showSyncModal: boolean;
  setShowSyncModal: (val: boolean) => void;
  showReminderModal: boolean;
  setShowReminderModal: (val: boolean) => void;
  isFocusMode: boolean;
  setIsFocusMode: (val: boolean) => void;
  checkInDailyStreak: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  PROGRESS: 'hafidz_user_progress_v2',
  GAMIFICATION: 'hafidz_gamification_v2',
  STUDENTS: 'hafidz_students_v2',
  FORUM: 'hafidz_forum_v2',
  REMINDERS: 'hafidz_reminders_v2',
  SETTINGS: 'hafidz_settings_v2',
  SYNC_TOKEN: 'hafidz_sync_token_v2'
};

const DEFAULT_GAMIFICATION: GamificationState = {
  xp: 340,
  level: 2,
  levelTitle: "Thalib Kota Memori",
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  dailyGoalAyahs: 3,
  todayCompletedAyahs: 2,
  badges: [
    { id: 'b1', title: 'Langkah Pertama', description: 'Menghafal ayat pertama dengan metode Kota Memori', unlocked: true, unlockedAt: '2026-10-23', icon: 'Sparkles' },
    { id: 'b2', title: 'Fasahah Al-Lisan', description: 'Mencapai skor tajwid AI di atas 90%', unlocked: true, unlockedAt: '2026-10-25', icon: 'Mic' },
    { id: 'b3', title: 'Penjaga Subuh', description: 'Konsisten setoran ba\'da subuh 3 hari berturut-turut', unlocked: true, unlockedAt: '2026-10-26', icon: 'Sunrise' },
    { id: 'b-streak-7', title: 'Lencana Istiqomah Sepekan', description: 'Konsisten hafalan 7 hari berturut-turut tanpa putus', unlocked: false, icon: 'Flame' },
    { id: 'b-streak-14', title: 'Faris Al-Istiqomah', description: 'Menjaga hafalan 14 hari berturut-turut', unlocked: false, icon: 'Shield' },
    { id: 'b-streak-30', title: 'Penjaga Wahyu Bulanan', description: 'Konsistensi emas 30 hari penuh di Kota Memori', unlocked: false, icon: 'Trophy' },
    { id: 'b4', title: 'Arsitek Kota Mulk', description: 'Menuntaskan pemetaan 10 Loci Surah Al-Mulk', unlocked: false, icon: 'Castle' },
    { id: 'b5', title: 'Khatam Juz 30', description: 'Menyelesaikan seluruh surat di Juz \'Amma', unlocked: false, icon: 'Award' }
  ]
};

const DEFAULT_STUDENTS: StudentProgress[] = [
  {
    id: 'std-1',
    name: 'Ahmad Faisal, S.T.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    level: 'Kelas Pekerja Sibuk (Executive)',
    dailyTargetAyah: 3,
    memorizedAyahs: 28,
    totalAyahsTarget: 30,
    lastSetoranDate: 'Hari ini, 06:15',
    lastSetoranSurah: 'Al-Mulk',
    lastSetoranAyahRange: 'Ayat 7-10',
    tajweedScore: 92,
    status: 'active',
    teacherNotes: 'Makhraj huruf Shad dan Dhad semakin matang. Asosiasi kota memori di perapian sangat kokoh.'
  },
  {
    id: 'std-2',
    name: 'dr. Sarah Nabila',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    level: 'Kelas Dokter & Tenaga Medis',
    dailyTargetAyah: 2,
    memorizedAyahs: 19,
    totalAyahsTarget: 30,
    lastSetoranDate: 'Kemarin, 21:00',
    lastSetoranSurah: 'Al-Mulk',
    lastSetoranAyahRange: 'Ayat 4-6',
    tajweedScore: 88,
    status: 'active',
    teacherNotes: 'Perhatikan kadar mad thabi\'i 2 harakat di kata Al-Bashar. Semangat muraja\'ah saat jadwal jaga.'
  },
  {
    id: 'std-3',
    name: 'Bambang Trianto',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    level: 'Kelas Senior & Pensiunan',
    dailyTargetAyah: 2,
    memorizedAyahs: 12,
    totalAyahsTarget: 40,
    lastSetoranDate: '2 hari lalu',
    lastSetoranSurah: 'An-Naba',
    lastSetoranAyahRange: 'Ayat 1-5',
    tajweedScore: 85,
    status: 'review_needed',
    teacherNotes: 'Butuh penguatan mental walk dari titik 3 ke 5. Ghunnah sudah jelas.'
  },
  {
    id: 'std-4',
    name: 'Nurul Hidayati',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    level: 'Ibu Rumah Tangga & Wirausaha',
    dailyTargetAyah: 3,
    memorizedAyahs: 30,
    totalAyahsTarget: 30,
    lastSetoranDate: 'Hari ini, 09:30',
    lastSetoranSurah: 'Al-Mulk',
    lastSetoranAyahRange: 'Ayat 1-30 (Tasmi\')',
    tajweedScore: 96,
    status: 'completed',
    teacherNotes: 'Mumtaz! Khatam tasmi\' 30 ayat Al-Mulk dalam sekali duduk dengan mutqin.'
  }
];

const DEFAULT_FORUM: ForumPost[] = [
  {
    id: 'fp-1',
    author: 'dr. Sarah Nabila',
    authorAvatar: 'SN',
    role: 'Santri',
    surahTag: 'Surah Al-Mulk',
    title: 'Bagaimana cara menaruh jangkar visual untuk ayat yang mirip?',
    content: 'Assalamu\'alaikum ustadz dan rekan-rekan. Saat menghafal ayat 3 dan 4 Al-Mulk yang sama-sama menyebut "Farji\'il-bashar" dan "Tsummarji\'il-bashar", bagaimana trik kota memorinya agar tidak tertukar saat shalat subuh?',
    createdAt: '2 jam yang lalu',
    likes: 14,
    isLiked: false,
    replies: [
      {
        id: 'r1',
        author: 'Ustadz Ridwan Al-Hafidz',
        role: 'Ustadz Pembimbing',
        content: 'Wa\'alaikumsalam dr. Sarah. Di Ayat 3 (Farji\'il-bashar), taruh visual Anda sedang menatap langsung dengan mata telanjang ke langit kubah kaca. Di Ayat 4 (Tsummarji\'), taruh Teropong Bintang Kuningan ganda. "Tsumma" berarti kelanjutan dengan alat pembesar!',
        createdAt: '1 jam yang lalu'
      }
    ]
  },
  {
    id: 'fp-2',
    author: 'Ahmad Faisal, S.T.',
    authorAvatar: 'AF',
    role: 'Santri',
    surahTag: 'Tips Orang Dewasa',
    title: 'Pengalaman 4 hari pertama: 10 menit commute kereta jadi produktif',
    content: 'Dulu saya selalu merasa otak sudah berumur 40-an susah menghafal Al-Quran. Ternyata setelah pakai metode Blueprint Kota Memori, saya tidak lagi menghafal huruf per huruf, tapi membayangkan ruangan rumah. 10 menit di KRL Commuter Line bisa muraja\'ah 5 ayat lancar tanpa buka hp terus-menerus. Barakallahu fiikum!',
    createdAt: '5 jam yang lalu',
    likes: 29,
    isLiked: true,
    replies: []
  }
];

const DEFAULT_REMINDERS: DailyReminderConfig[] = [
  {
    enabled: true,
    timeSlot: '05:15',
    name: 'Ba\'da Subuh Berkah',
    frequency: 'daily',
    soundEnabled: true,
    reminderType: 'subuh',
    message: 'Waktu terbaik saat pikiran masih jernih. Mulai 2 ayat baru di Kota Memori Anda.'
  },
  {
    enabled: true,
    timeSlot: '12:45',
    name: 'Istirahat Siang & Qailulah',
    frequency: 'workdays',
    soundEnabled: true,
    reminderType: 'qailulah',
    message: 'Recharge energi ruhiyah dengan mental walk 5 menit sebelum kembali bekerja.'
  },
  {
    enabled: true,
    timeSlot: '20:30',
    name: 'Muraja\'ah Malam Pengunci LTM',
    frequency: 'daily',
    soundEnabled: true,
    reminderType: 'isya',
    message: 'Kunci hafalan hari ini ke long-term memory sebelum tidur nyenyak.'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'tracker' | 'palace' | 'tajweed' | 'teacher' | 'gamification' | 'community'>('tracker');
  const [selectedSurah, setSelectedSurah] = useState<number>(67); // Default to Al-Mulk
  const [selectedAyah, setSelectedAyah] = useState<number>(1);
  const [theme, setTheme] = useState<AppTheme>('light');
  const [language, setLanguage] = useState<AppLanguage>('id');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'pending'>('synced');
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Baru saja');
  const [syncToken, setSyncToken] = useState<string>('HQ-ISLAMICITY-SYNC-' + Math.random().toString(36).substring(2, 8).toUpperCase());
  
  // Modals state
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showSyncModal, setShowSyncModal] = useState<boolean>(false);
  const [showReminderModal, setShowReminderModal] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  // User Ayah Progress Map
  const [userProgress, setUserProgress] = useState<Record<string, UserAyahProgress>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    // Pre-populate with inspiring starter progress for Al-Mulk
    const initial: Record<string, UserAyahProgress> = {
      '67_1': { surahNumber: 67, ayahNumber: 1, status: 'mutqin', lastReviewedAt: '2026-10-26', reviewCount: 4, nextSpacedReview: '2026-10-28', tajweedScore: 95 },
      '67_2': { surahNumber: 67, ayahNumber: 2, status: 'mutqin', lastReviewedAt: '2026-10-26', reviewCount: 3, nextSpacedReview: '2026-10-27', tajweedScore: 92 },
      '67_3': { surahNumber: 67, ayahNumber: 3, status: 'reviewing', lastReviewedAt: '2026-10-25', reviewCount: 2, nextSpacedReview: '2026-10-26', tajweedScore: 89 },
      '67_4': { surahNumber: 67, ayahNumber: 4, status: 'memorizing', lastReviewedAt: '2026-10-26', reviewCount: 1, nextSpacedReview: '2026-10-27', tajweedScore: 86 },
      '1_1': { surahNumber: 1, ayahNumber: 1, status: 'mutqin', lastReviewedAt: '2026-10-26', reviewCount: 15, nextSpacedReview: '2026-11-01', tajweedScore: 98 },
      '1_2': { surahNumber: 1, ayahNumber: 2, status: 'mutqin', lastReviewedAt: '2026-10-26', reviewCount: 15, nextSpacedReview: '2026-11-01', tajweedScore: 97 },
      '1_3': { surahNumber: 1, ayahNumber: 3, status: 'mutqin', lastReviewedAt: '2026-10-26', reviewCount: 15, nextSpacedReview: '2026-11-01', tajweedScore: 98 },
      '1_4': { surahNumber: 1, ayahNumber: 4, status: 'mutqin', lastReviewedAt: '2026-10-26', reviewCount: 15, nextSpacedReview: '2026-11-01', tajweedScore: 96 },
      '1_5': { surahNumber: 1, ayahNumber: 5, status: 'mutqin', lastReviewedAt: '2026-10-26', reviewCount: 15, nextSpacedReview: '2026-11-01', tajweedScore: 95 },
      '1_6': { surahNumber: 1, ayahNumber: 6, status: 'mutqin', lastReviewedAt: '2026-10-26', reviewCount: 15, nextSpacedReview: '2026-11-01', tajweedScore: 94 },
      '1_7': { surahNumber: 1, ayahNumber: 7, status: 'mutqin', lastReviewedAt: '2026-10-26', reviewCount: 15, nextSpacedReview: '2026-11-01', tajweedScore: 94 }
    };
    return initial;
  });

  // Gamification state
  const [gamification, setGamification] = useState<GamificationState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GAMIFICATION);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_GAMIFICATION;
  });

  // Students roster
  const [students, setStudents] = useState<StudentProgress[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_STUDENTS;
  });

  // Forum posts
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FORUM);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_FORUM;
  });

  // Reminders
  const [reminders, setReminders] = useState<DailyReminderConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_REMINDERS;
  });

  // Network offline listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setCloudSyncStatus('synced');
      setLastSyncedTime('Baru saja (Otomatis)');
    };
    const handleOffline = () => {
      setIsOffline(true);
      setCloudSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(userProgress));
    } catch (e) {
      console.warn(e);
    }
  }, [userProgress]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GAMIFICATION, JSON.stringify(gamification));
    } catch (e) {
      console.warn(e);
    }
  }, [gamification]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.warn(e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FORUM, JSON.stringify(forumPosts));
    } catch (e) {
      console.warn(e);
    }
  }, [forumPosts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    } catch (e) {
      console.warn(e);
    }
  }, [reminders]);

  // Apply dark mode class to html element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isSystemDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }
  }, [theme]);

  // Add XP and level-up logic
  const addXP = (amount: number, reason?: string) => {
    setGamification(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 200) + 1;
      let newLevelTitle = prev.levelTitle;
      if (newLevel === 1) newLevelTitle = "Thalib Pemula";
      else if (newLevel === 2) newLevelTitle = "Thalib Kota Memori";
      else if (newLevel === 3) newLevelTitle = "Mutsaqqaf Al-Quran";
      else if (newLevel === 4) newLevelTitle = "Faris At-Tartil";
      else newLevelTitle = "Hafidz Berdaya";

      if (newLevel > prev.level) {
        // Trigger celebratory confetti on level up!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        if (!isFocusMode) {
          setNotificationBanner(`Mabruk! Anda naik ke Level ${newLevel}: ${newLevelTitle}! (+${amount} XP)`);
        }
      } else if (reason && !isFocusMode) {
        setNotificationBanner(`+${amount} XP: ${reason}`);
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        levelTitle: newLevelTitle
      };
    });
  };

  // Check in daily streak to record consecutive memorization days
  const checkInDailyStreak = () => {
    setGamification(prev => {
      const newStreak = prev.streakDays + 1;
      const today = new Date().toISOString().split('T')[0];

      // Auto unlock consistency streak badges
      const updatedBadges = prev.badges.map(b => {
        if (b.id === 'b3' && newStreak >= 3 && !b.unlocked) {
          return { ...b, unlocked: true, unlockedAt: today };
        }
        if (b.id === 'b-streak-7' && newStreak >= 7 && !b.unlocked) {
          return { ...b, unlocked: true, unlockedAt: today };
        }
        if (b.id === 'b-streak-14' && newStreak >= 14 && !b.unlocked) {
          return { ...b, unlocked: true, unlockedAt: today };
        }
        if (b.id === 'b-streak-30' && newStreak >= 30 && !b.unlocked) {
          return { ...b, unlocked: true, unlockedAt: today };
        }
        return b;
      });

      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (!isFocusMode) {
        setNotificationBanner(`Barakallah! Streak bertambah menjadi ${newStreak} Hari Berturut-turut! (+50 XP)`);
      }

      return {
        ...prev,
        streakDays: newStreak,
        lastActiveDate: today,
        badges: updatedBadges
      };
    });
    addXP(50, 'Check-in Konsistensi Menghafal');
  };

  // Update Ayah memorization status
  const updateAyahStatus = (surah: number, ayah: number, status: MemorizationStatus, tajweedScore?: number) => {
    const key = `${surah}_${ayah}`;
    setUserProgress(prev => {
      const current = prev[key] || {
        surahNumber: surah,
        ayahNumber: ayah,
        status: 'unlearned',
        lastReviewedAt: new Date().toISOString().split('T')[0],
        reviewCount: 0,
        nextSpacedReview: new Date().toISOString().split('T')[0]
      };

      const updatedReviewCount = status === 'mutqin' ? current.reviewCount + 1 : current.reviewCount;
      const today = new Date();
      // Calculate next spaced review according to Ebbinghaus protocol
      const intervals = [1, 3, 7, 14, 30];
      const daysToAdd = intervals[Math.min(updatedReviewCount, intervals.length - 1)];
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + daysToAdd);

      return {
        ...prev,
        [key]: {
          ...current,
          status,
          lastReviewedAt: today.toISOString().split('T')[0],
          reviewCount: updatedReviewCount,
          nextSpacedReview: nextDate.toISOString().split('T')[0],
          tajweedScore: tajweedScore !== undefined ? tajweedScore : current.tajweedScore
        }
      };
    });

    // Reward XP
    if (status === 'mutqin') {
      addXP(50, `Ayat ${ayah} ditandai Mutqin`);
      setGamification(g => ({
        ...g,
        todayCompletedAyahs: g.todayCompletedAyahs + 1
      }));
    } else if (status === 'memorizing') {
      addXP(20, `Memulai hafalan Ayat ${ayah}`);
    } else if (status === 'reviewing') {
      addXP(30, `Muraja'ah Ayat ${ayah}`);
    }
  };

  const getAyahStatus = (surah: number, ayah: number): MemorizationStatus => {
    const key = `${surah}_${ayah}`;
    return userProgress[key]?.status || 'unlearned';
  };

  // Cloud sync trigger
  const triggerManualSync = async () => {
    setCloudSyncStatus('syncing');
    await new Promise(res => setTimeout(res, 1200));
    setCloudSyncStatus('synced');
    setLastSyncedTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    setNotificationBanner('Sinkronisasi cloud berhasil: Semua progres tersimpan aman.');
  };

  const updateReminders = (newReminders: DailyReminderConfig[]) => {
    setReminders(newReminders);
  };

  const updateStudentNote = (studentId: string, note: string, newStatus?: StudentProgress['status']) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          teacherNotes: note,
          status: newStatus || s.status
        };
      }
      return s;
    }));
    setNotificationBanner('Catatan pembimbing & evaluasi santri berhasil diperbarui.');
  };

  const addForumPost = (title: string, content: string, surahTag: string) => {
    const newPost: ForumPost = {
      id: 'fp-' + Date.now(),
      author: 'Anda (Santri)',
      authorAvatar: 'ME',
      role: 'Santri',
      surahTag,
      title,
      content,
      createdAt: 'Baru saja',
      likes: 1,
      isLiked: true,
      replies: []
    };
    setForumPosts(prev => [newPost, ...prev]);
    addXP(25, 'Berbagi di Forum Komunitas');
    setNotificationBanner('Diskusi baru berhasil diterbitkan di komunitas.');
  };

  const likeForumPost = (postId: string) => {
    setForumPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1)
        };
      }
      return p;
    }));
  };

  const addForumReply = (postId: string, content: string) => {
    setForumPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          replies: [
            ...p.replies,
            {
              id: 'rep-' + Date.now(),
              author: 'Anda (Santri)',
              role: 'Santri',
              content,
              createdAt: 'Baru saja'
            }
          ]
        };
      }
      return p;
    }));
    addXP(15, 'Menjawab diskusi santri');
  };

  const dismissNotificationBanner = () => {
    setNotificationBanner(null);
  };

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      selectedSurah,
      setSelectedSurah,
      selectedAyah,
      setSelectedAyah,
      userProgress,
      updateAyahStatus,
      getAyahStatus,
      gamification,
      addXP,
      theme,
      setTheme,
      language,
      setLanguage,
      fontSize,
      setFontSize,
      highContrast,
      setHighContrast,
      isOffline,
      cloudSyncStatus,
      lastSyncedTime,
      syncToken,
      triggerManualSync,
      reminders,
      updateReminders,
      students,
      updateStudentNote,
      forumPosts,
      addForumPost,
      likeForumPost,
      addForumReply,
      notificationBanner,
      dismissNotificationBanner,
      showExportModal,
      setShowExportModal,
      showSyncModal,
      setShowSyncModal,
      showReminderModal,
      setShowReminderModal,
      isFocusMode,
      setIsFocusMode,
      checkInDailyStreak
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
