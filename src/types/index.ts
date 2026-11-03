/**
 * Types and interfaces for Hafidz Quran Islamicity
 */

export type MemorizationStatus = 'unlearned' | 'memorizing' | 'reviewing' | 'mutqin';

export interface Ayah {
  numberInSurah: number;
  juz: number;
  textArabic: string;
  transliteration: string;
  translationId: string;
  translationEn: string;
  audioUrl?: string;
  tajweedRule?: string;
  memoryHint?: string;
}

export interface Surah {
  number: number;
  nameArabic: string;
  nameLatin: string;
  englishNameTranslation: string;
  indonesianNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  juzStart: number;
  juzEnd: number;
  ayahs?: Ayah[];
}

export interface UserAyahProgress {
  surahNumber: number;
  ayahNumber: number;
  status: MemorizationStatus;
  lastReviewedAt: string;
  reviewCount: number;
  nextSpacedReview: string;
  tajweedScore?: number;
  notes?: string;
}

export interface LocusPoint {
  id: string;
  locusNumber: number;
  title: string;
  description: string;
  ayahTarget: number;
  visualAnchor: string;
  mnemonicStory: string;
  coordinates?: { x: number; y: number };
}

export interface MemoryPalaceRoom {
  id: string;
  surahNumber: number;
  surahName: string;
  roomName: string;
  theme: string;
  description: string;
  loci: LocusPoint[];
}

export interface WordPronunciationGuide {
  wordArabic: string;
  transliteration: string;
  translation: string;
  makhraj: string;
  tajweedRule: string;
  commonMistakes: string;
  pronunciationTip: string;
}

export interface TajweedAnalysisResult {
  score: number;
  accuracy: number;
  fluency: number;
  makhrajScore: number;
  feedback: string;
  detectedRules: {
    rule: string;
    status: 'good' | 'needs_improvement' | 'warning';
    detail: string;
  }[];
  recommendation: string;
  timestamp: string;
}

export interface StudentProgress {
  id: string;
  name: string;
  avatar: string;
  level: string;
  dailyTargetAyah: number;
  memorizedAyahs: number;
  totalAyahsTarget: number;
  lastSetoranDate: string;
  lastSetoranSurah: string;
  lastSetoranAyahRange: string;
  tajweedScore: number;
  status: 'active' | 'review_needed' | 'completed';
  teacherNotes: string;
}

export interface ForumPost {
  id: string;
  author: string;
  authorAvatar: string;
  role: 'Santri' | 'Ustadz' | 'Alumni' | 'Wali Murid';
  surahTag: string;
  title: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies: {
    id: string;
    author: string;
    role: string;
    content: string;
    createdAt: string;
  }[];
}

export interface DailyReminderConfig {
  enabled: boolean;
  timeSlot: string; // e.g. "05:15"
  name: string;
  frequency: 'daily' | 'workdays' | 'custom';
  soundEnabled: boolean;
  reminderType: 'subuh' | 'qailulah' | 'maghrib' | 'isya' | 'custom';
  message: string;
}

export interface GamificationState {
  xp: number;
  level: number;
  levelTitle: string;
  streakDays: number;
  lastActiveDate: string;
  dailyGoalAyahs: number;
  todayCompletedAyahs: number;
  badges: {
    id: string;
    title: string;
    description: string;
    unlocked: boolean;
    unlockedAt?: string;
    icon: string;
  }[];
}

export interface QuranReflectionItem {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  ayahArabic: string;
  transliteration: string;
  translation: string;
  theme: 'Ketenangan & Kecemasan' | 'Tujuan Hidup & Karir' | 'Keluarga & Relasi' | 'Kesulitan & Ujian' | 'Syukur & Berkah' | 'Dosa & Harapan';
  divineMessage: string;
  dailyLifeContext: string;
  soulReflectionPrompt: string;
  actionableStep: string;
  heartfeltPrayer: string;
  tags: string[];
}

export interface UserPersonalReflection {
  id: string;
  ayahRef: string;
  surahNumber: number;
  ayahNumber: number;
  userLifeSituation: string;
  reflectionNote: string;
  actionCommitment: string;
  createdAt: string;
  moodTag?: 'tenang' | 'tersentuh' | 'bersemangat' | 'insyaf' | 'bersyukur';
  isFavorite?: boolean;
}

export type DailyTargetType = 'ayah_count' | 'page' | 'surah';
export type DailyTargetUnit = 'ayat' | 'page';

export interface DailyMemorizationTarget {
  targetType: DailyTargetType;
  targetUnit: DailyTargetUnit;
  targetAyahCount: number;
  targetPageCount?: number;
  targetSurahNumber?: number;
  targetSurahName?: string;
  targetSurahAyahRange?: { from: number; to: number };
  dailyGoalMode: 'all' | 'memorizing' | 'mutqin';
  lastTargetDate: string; // YYYY-MM-DD
  completedAyahKeys: string[]; // format "surah_ayah", e.g. ["67_1", "67_2"]
  completedGoalDates?: string[]; // Array of YYYY-MM-DD when daily target was 100% completed
  goalStreak?: number; // Current calculated consecutive days completing the daily goal
}

export type AppLanguage = 'id' | 'en' | 'ar';
export type AppTheme = 'light' | 'dark' | 'system';

export type MemorizationMood = 'lancar' | 'berjuang' | 'khusyuk' | 'syukur' | 'evaluasi';

export interface MemorizationVoiceJournal {
  id: string;
  date: string; // YYYY-MM-DD
  surahNumber: number;
  surahName: string;
  ayahNumber?: number;
  targetProgressSummary: string;
  streakDays: number;
  transcript: string;
  mood: MemorizationMood;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}
