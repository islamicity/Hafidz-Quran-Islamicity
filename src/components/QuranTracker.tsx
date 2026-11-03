/**
 * Quran Memorization Tracker Component
 * Covers 114 Surahs, 30 Juz, Audio Recitations, Status updates, Fast Search,
 * and Immersive 'Mode Fokus' (Zen Single-Ayah view with per-ayah audio looping and silenced notifications)
 */
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { SURAH_LIST, getAyahsForSurah } from '../data/quranData';
import { Ayah, MemorizationStatus, WordPronunciationGuide, DailyTargetType, DailyTargetUnit } from '../types';
import { playWordSpeech, getWordPronunciationGuide } from '../services/geminiService';
import { VoiceMemorizationJournal } from './VoiceMemorizationJournal';
import { 
  Search, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Mic, 
  Volume2, 
  Volume1,
  Bookmark, 
  Check, 
  HelpCircle, 
  Clock, 
  Filter, 
  Maximize2, 
  Minimize2, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  BellOff, 
  Repeat, 
  ArrowRight, 
  Lightbulb,
  X,
  Headphones,
  Compass,
  Target,
  Settings2,
  Award,
  Zap,
  Calendar,
  Flame,
  TrendingUp,
  Layers,
  FileText,
  Trophy
} from 'lucide-react';

export const QuranTracker: React.FC = () => {
  const { 
    selectedSurah, 
    setSelectedSurah, 
    selectedAyah, 
    setSelectedAyah, 
    updateAyahStatus, 
    getAyahStatus, 
    dailyTarget,
    updateDailyTarget,
    resetDailyTargetProgress,
    userProgress, 
    setActiveTab, 
    fontSize,
    isFocusMode,
    setIsFocusMode,
    openReflectionForAyah,
    simulateGoalStreak,
    memorizationJournals
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterJuz, setFilterJuz] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null);
  const [audioPlaybackRate, setAudioPlaybackRate] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Daily Memorization Target Configuration Modal States
  const [showTargetModal, setShowTargetModal] = useState<boolean>(false);
  const [showVoiceJournalModal, setShowVoiceJournalModal] = useState<boolean>(false);
  const [showInlineVoiceJournal, setShowInlineVoiceJournal] = useState<boolean>(false);
  const [tempTargetUnit, setTempTargetUnit] = useState<DailyTargetUnit>(dailyTarget.targetUnit || 'ayat');
  const [tempTargetType, setTempTargetType] = useState<DailyTargetType>(dailyTarget.targetType || 'ayah_count');
  const [tempTargetAyahCount, setTempTargetAyahCount] = useState<number>(dailyTarget.targetAyahCount || 5);
  const [tempTargetPageCount, setTempTargetPageCount] = useState<number>(dailyTarget.targetPageCount || 1);
  const [tempTargetSurahNumber, setTempTargetSurahNumber] = useState<number>(dailyTarget.targetSurahNumber || 67);
  const [tempGoalMode, setTempGoalMode] = useState<'all' | 'memorizing' | 'mutqin'>(dailyTarget.dailyGoalMode || 'all');
  const [customAyahInput, setCustomAyahInput] = useState<string>(String(dailyTarget.targetAyahCount || 5));
  const [customPageInput, setCustomPageInput] = useState<string>(String(dailyTarget.targetPageCount || 1));

  // Focus Mode Specific States
  const [focusRepeatLimit, setFocusRepeatLimit] = useState<number | 'infinite'>(3);
  const [focusCurrentLoop, setFocusCurrentLoop] = useState<number>(1);
  const [focusAutoAdvance, setFocusAutoAdvance] = useState<boolean>(true);
  const [focusHideArabic, setFocusHideArabic] = useState<boolean>(false);
  const [focusShowDetails, setFocusShowDetails] = useState<boolean>(true);

  // AI-Powered Ayah Pronunciation Guide per-word States
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
  const [wordGuide, setWordGuide] = useState<WordPronunciationGuide | null>(null);
  const [isLoadingWordGuide, setIsLoadingWordGuide] = useState<boolean>(false);
  const [isPlayingWordAudio, setIsPlayingWordAudio] = useState<boolean>(false);
  const [wordSpeechRate, setWordSpeechRate] = useState<number>(0.82);

  // Filter surahs
  const filteredSurahs = useMemo(() => {
    return SURAH_LIST.filter(s => {
      const matchSearch = s.nameLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.indonesianNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.nameArabic.includes(searchQuery) ||
                          s.number.toString() === searchQuery.trim();
      const matchJuz = filterJuz === 'all' || (s.juzStart <= parseInt(filterJuz) && s.juzEnd >= parseInt(filterJuz));
      return matchSearch && matchJuz;
    });
  }, [searchQuery, filterJuz]);

  const activeSurahMeta = useMemo(() => {
    return SURAH_LIST.find(s => s.number === selectedSurah) || SURAH_LIST[0];
  }, [selectedSurah]);

  const ayahs = useMemo(() => {
    return getAyahsForSurah(selectedSurah);
  }, [selectedSurah]);

  // Current focused Ayah
  const focusedAyah = useMemo(() => {
    return ayahs.find(a => a.numberInSurah === selectedAyah) || ayahs[0];
  }, [ayahs, selectedAyah]);

  // Tokenize focused Ayah into words for clickable Tajweed Pronunciation Guide
  const verseWords = useMemo(() => {
    if (!focusedAyah?.textArabic) return [];
    return focusedAyah.textArabic.trim().split(/\s+/).filter(Boolean);
  }, [focusedAyah?.textArabic]);

  // Reset selected word when verse changes
  useEffect(() => {
    setSelectedWord(null);
    setSelectedWordIndex(null);
    setWordGuide(null);
  }, [selectedAyah, selectedSurah]);

  // Handle clicking any word in the verse to play recitation and fetch Tajweed guide
  const handleWordClick = async (word: string, index: number) => {
    setSelectedWord(word);
    setSelectedWordIndex(index);
    setIsPlayingWordAudio(true);

    // Speak word immediately using Tajweed audio
    playWordSpeech(word, wordSpeechRate);
    setTimeout(() => setIsPlayingWordAudio(false), 1400);

    setIsLoadingWordGuide(true);
    try {
      const guide = await getWordPronunciationGuide(
        word,
        focusedAyah.textArabic,
        activeSurahMeta.nameLatin
      );
      setWordGuide(guide);
    } catch (e) {
      console.warn('Word guide error:', e);
    } finally {
      setIsLoadingWordGuide(false);
    }
  };

  // Replay word recitation at specific speed
  const replayWord = (rate: number = wordSpeechRate) => {
    if (!selectedWord) return;
    setIsPlayingWordAudio(true);
    playWordSpeech(selectedWord, rate);
    setTimeout(() => setIsPlayingWordAudio(false), 1400);
  };

  // Navigate to previous word in the verse
  const handlePrevWord = () => {
    if (selectedWordIndex !== null && selectedWordIndex > 0) {
      const prevIdx = selectedWordIndex - 1;
      handleWordClick(verseWords[prevIdx], prevIdx);
    }
  };

  // Navigate to next word in the verse
  const handleNextWord = () => {
    if (selectedWordIndex !== null && selectedWordIndex < verseWords.length - 1) {
      const nextIdx = selectedWordIndex + 1;
      handleWordClick(verseWords[nextIdx], nextIdx);
    }
  };

  // Audio control
  const togglePlayAudio = useCallback((url: string) => {
    if (playingAudioUrl === url) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingAudioUrl(null);
    } else {
      setPlayingAudioUrl(url);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.playbackRate = audioPlaybackRate;
        audioRef.current.play().catch(e => console.warn('Audio play error:', e));
      }
    }
  }, [playingAudioUrl, audioPlaybackRate]);

  // Handle Audio Ended with per-ayah repeat & auto-advance
  const handleAudioEnded = () => {
    if (!isFocusMode) {
      setPlayingAudioUrl(null);
      return;
    }

    // In Focus Mode: handle loop repetitions
    if (focusRepeatLimit === 'infinite') {
      setFocusCurrentLoop(prev => prev + 1);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.warn);
      }
      return;
    }

    if (focusCurrentLoop < (focusRepeatLimit as number)) {
      setFocusCurrentLoop(prev => prev + 1);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.warn);
      }
    } else {
      // Loop finished for current ayah
      setFocusCurrentLoop(1);
      if (focusAutoAdvance && selectedAyah < ayahs.length) {
        // Advance to next ayah
        const nextAyahNum = selectedAyah + 1;
        setSelectedAyah(nextAyahNum);
        const nextAyahObj = ayahs.find(a => a.numberInSurah === nextAyahNum);
        if (nextAyahObj?.audioUrl && audioRef.current) {
          setPlayingAudioUrl(nextAyahObj.audioUrl);
          audioRef.current.src = nextAyahObj.audioUrl;
          audioRef.current.play().catch(console.warn);
        } else {
          setPlayingAudioUrl(null);
        }
      } else {
        setPlayingAudioUrl(null);
      }
    }
  };

  const handleRateChange = (newRate: number) => {
    setAudioPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  // Keyboard navigation for Focus Mode
  useEffect(() => {
    if (!isFocusMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFocusMode(false);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (selectedAyah < ayahs.length) {
          setSelectedAyah(selectedAyah + 1);
          setFocusCurrentLoop(1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (selectedAyah > 1) {
          setSelectedAyah(selectedAyah - 1);
          setFocusCurrentLoop(1);
        }
      } else if (e.key === ' ') {
        e.preventDefault();
        if (focusedAyah?.audioUrl) {
          togglePlayAudio(focusedAyah.audioUrl);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode, selectedAyah, ayahs.length, focusedAyah, togglePlayAudio, setIsFocusMode, setSelectedAyah]);

  // When selectedAyah changes in focus mode and audio is currently playing, switch track
  useEffect(() => {
    if (isFocusMode && playingAudioUrl && focusedAyah?.audioUrl && playingAudioUrl !== focusedAyah.audioUrl) {
      if (audioRef.current) {
        audioRef.current.src = focusedAyah.audioUrl;
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.warn);
        setPlayingAudioUrl(focusedAyah.audioUrl);
        setFocusCurrentLoop(1);
      }
    }
  }, [selectedAyah, isFocusMode, focusedAyah, playingAudioUrl]);

  // Surah completion stats
  const surahMutqinCount = ayahs.filter(a => getAyahStatus(selectedSurah, a.numberInSurah) === 'mutqin').length;
  const surahProgressPct = Math.round((surahMutqinCount / (ayahs.length || 1)) * 100);

  // Daily Memorization Target calculations (Supports both 'ayat' and 'page' completion goals)
  const targetUnit: DailyTargetUnit = dailyTarget.targetUnit || (dailyTarget.targetType === 'page' ? 'page' : 'ayat');
  const targetPageCount = dailyTarget.targetPageCount || (dailyTarget.targetAyahCount ? +(dailyTarget.targetAyahCount / 15).toFixed(1) : 1);
  const targetCount = targetUnit === 'page' 
    ? Math.max(1, Math.round(targetPageCount * 15)) 
    : (dailyTarget.targetAyahCount || 5);

  const completedKeys = dailyTarget.completedAyahKeys || [];
  const completedCount = completedKeys.length;
  const targetProgressPct = Math.min(100, Math.round((completedCount / Math.max(1, targetCount)) * 100));
  const isTargetAchieved = completedCount >= targetCount;
  const remainingTargetCount = Math.max(0, targetCount - completedCount);

  // Page-specific conversions (1 standard Madinah Mushaf page = 15 verses)
  const completedPages = +(completedCount / 15).toFixed(1);
  const remainingPages = targetUnit === 'page' 
    ? Math.max(0, +(targetPageCount - completedPages).toFixed(1))
    : +(remainingTargetCount / 15).toFixed(1);

  // Quick unit switch
  const handleToggleUnit = (newUnit: DailyTargetUnit) => {
    if (newUnit === targetUnit) return;
    if (newUnit === 'page') {
      const pages = Math.max(0.5, +(targetCount / 15).toFixed(1));
      updateDailyTarget({
        targetUnit: 'page',
        targetType: 'page',
        targetPageCount: pages,
        targetAyahCount: Math.round(pages * 15)
      });
    } else {
      updateDailyTarget({
        targetUnit: 'ayat',
        targetType: 'ayah_count',
        targetAyahCount: Math.max(1, targetCount)
      });
    }
  };

  // Status breakdown of today's target completions
  const todayProgressStats = useMemo(() => {
    let memorizingCount = 0;
    let reviewingCount = 0;
    let mutqinCount = 0;

    completedKeys.forEach(k => {
      const status = userProgress[k]?.status;
      if (status === 'mutqin') mutqinCount++;
      else if (status === 'reviewing') reviewingCount++;
      else if (status === 'memorizing') memorizingCount++;
      else mutqinCount++; // default completed
    });

    return { memorizingCount, reviewingCount, mutqinCount };
  }, [completedKeys, userProgress]);

  // Helper to format date YYYY-MM-DD
  const formatYMD = useCallback((d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Calculate current streak of consecutive days completing the daily goal
  const calculateGoalStreak = useCallback((completedDates: string[] = [], isGoalAchievedToday: boolean = false): number => {
    const dates = new Set(completedDates);
    const today = new Date();
    const todayStr = formatYMD(today);

    if (isGoalAchievedToday) {
      dates.add(todayStr);
    }

    const todayCompleted = dates.has(todayStr);
    let checkDate = new Date(today);
    let streak = 0;

    if (todayCompleted) {
      streak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // If today is not yet completed, check if yesterday was completed to keep the active streak alive
      checkDate.setDate(checkDate.getDate() - 1);
      if (!dates.has(formatYMD(checkDate))) {
        return 0; // Streak broken
      }
    }

    // Count backwards day by day as long as consecutive dates are in the set
    while (dates.has(formatYMD(checkDate))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
  }, [formatYMD]);

  // Current calculated streak of consecutive days completing the daily goal
  const currentGoalStreak = useMemo(() => {
    return calculateGoalStreak(dailyTarget.completedGoalDates || [], isTargetAchieved);
  }, [calculateGoalStreak, dailyTarget.completedGoalDates, isTargetAchieved]);

  // Trophy icon is displayed when the streak exceeds 7 days (> 7)
  const isStreakExceeds7Days = currentGoalStreak > 7;

  // Recent 7 days for the visual streak day tracker
  const recentStreakDays = useMemo(() => {
    const list = [];
    const today = new Date();
    const todayStr = formatYMD(today);
    const completedSet = new Set(dailyTarget.completedGoalDates || []);
    if (isTargetAchieved) {
      completedSet.add(todayStr);
    }

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = formatYMD(d);
      const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const dayName = dayNames[d.getDay()];
      const isToday = i === 0;
      const isCompleted = completedSet.has(dateStr);

      list.push({
        dateStr,
        dayName,
        dayOfMonth: d.getDate(),
        isToday,
        isCompleted
      });
    }
    return list;
  }, [formatYMD, dailyTarget.completedGoalDates, isTargetAchieved]);

  const openTargetModal = () => {
    const curUnit = dailyTarget.targetUnit || (dailyTarget.targetType === 'page' ? 'page' : 'ayat');
    setTempTargetUnit(curUnit);
    setTempTargetType(dailyTarget.targetType || 'ayah_count');
    setTempTargetAyahCount(dailyTarget.targetAyahCount || 5);
    setTempTargetPageCount(dailyTarget.targetPageCount || 1);
    setTempTargetSurahNumber(dailyTarget.targetSurahNumber || selectedSurah || 67);
    setTempGoalMode(dailyTarget.dailyGoalMode || 'all');
    setCustomAyahInput(String(dailyTarget.targetAyahCount || 5));
    setCustomPageInput(String(dailyTarget.targetPageCount || 1));
    setShowTargetModal(true);
  };

  const handleSaveTarget = () => {
    let finalAyahCount = tempTargetAyahCount;
    let finalPageCount = tempTargetPageCount;

    if (tempTargetUnit === 'page') {
      const parsedPage = parseFloat(customPageInput);
      finalPageCount = (!isNaN(parsedPage) && parsedPage > 0) ? parsedPage : tempTargetPageCount;
      finalAyahCount = Math.max(1, Math.round(finalPageCount * 15));
    } else {
      const parsedCustom = parseInt(customAyahInput);
      finalAyahCount = (!isNaN(parsedCustom) && parsedCustom > 0) ? parsedCustom : tempTargetAyahCount;
      finalPageCount = +(finalAyahCount / 15).toFixed(1);
    }

    const targetSurahMeta = SURAH_LIST.find(s => s.number === tempTargetSurahNumber);

    updateDailyTarget({
      targetType: tempTargetType,
      targetUnit: tempTargetUnit,
      targetAyahCount: finalAyahCount,
      targetPageCount: finalPageCount,
      targetSurahNumber: tempTargetSurahNumber,
      targetSurahName: targetSurahMeta?.nameLatin,
      dailyGoalMode: tempGoalMode
    });
    setShowTargetModal(false);
  };

  // Font class mapping
  const arabicTextSizeClass = fontSize === 'huge' ? 'text-4xl' : fontSize === 'large' ? 'text-3xl' : 'text-2xl';

  /* -------------------------------------------------------------
     RENDER: MODE FOKUS (ZEN SINGLE AYAH VIEW)
  ------------------------------------------------------------- */
  if (isFocusMode) {
    const isPlayingCurrent = playingAudioUrl === focusedAyah.audioUrl;
    const currentStatus = getAyahStatus(selectedSurah, focusedAyah.numberInSurah);

    return (
      <div className="space-y-6 animate-fade-in">
        <audio ref={audioRef} onEnded={handleAudioEnded} className="hidden" />

        {/* Top Control Bar of Focus Mode */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Maximize2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Mode Fokus Aktif
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <BellOff className="w-3.5 h-3.5 text-amber-500" />
                  Notifikasi Lain Dinonaktifkan
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {activeSurahMeta.nameLatin} · Ayat {focusedAyah.numberInSurah} dari {ayahs.length}
              </h2>
            </div>
          </div>

          {/* Compact Daily Target Indicator in Focus Mode Header with Mini Progress Ring */}
          <div className="hidden lg:flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
            {/* Mini SVG Progress Ring */}
            <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
              <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  className="stroke-slate-200 dark:stroke-slate-700"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeDasharray={2 * Math.PI * 14}
                  strokeDashoffset={2 * Math.PI * 14 * (1 - targetProgressPct / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <Target className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 absolute" />
            </div>

            <div className="flex flex-col min-w-[125px]">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                <span>Target {targetUnit === 'page' ? 'Halaman' : 'Ayat'}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                  {targetUnit === 'page' ? `${completedPages}/${targetPageCount} Hal` : `${completedCount}/${targetCount} Ayat`}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span>Sisa:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {isTargetAchieved 
                    ? '0 (Tuntas 🎉)' 
                    : targetUnit === 'page' 
                    ? `${remainingPages} Hal (${remainingTargetCount} Ayat)`
                    : `${remainingTargetCount} Ayat`}
                </span>
              </div>
            </div>

            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              isTargetAchieved 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' 
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
            }`}>
              {targetProgressPct}%
            </span>

            {/* Mode Fokus Streak Indicator */}
            <div 
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                isStreakExceeds7Days
                  ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700 shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title={isStreakExceeds7Days ? `Streak target ${currentGoalStreak} hari (Trofi Istiqomah Emas Terbuka)` : `Streak target ${currentGoalStreak} hari`}
            >
              {isStreakExceeds7Days ? (
                <>
                  <Trophy className="w-3 h-3 text-amber-500 fill-amber-400 shrink-0" />
                  <span>{currentGoalStreak} Hari 🏆</span>
                </>
              ) : (
                <>
                  <Flame className="w-3 h-3 text-orange-500 fill-orange-400 shrink-0" />
                  <span>{currentGoalStreak} Hari</span>
                </>
              )}
            </div>
          </div>

          {/* Surah Switcher & Exit Focus Button */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <select
              value={selectedSurah}
              onChange={(e) => {
                setSelectedSurah(parseInt(e.target.value));
                setSelectedAyah(1);
                setFocusCurrentLoop(1);
                setPlayingAudioUrl(null);
              }}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {SURAH_LIST.map(s => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.nameLatin} ({s.indonesianNameTranslation})
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowVoiceJournalModal(true)}
              className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-2xs"
              title="Dikte refleksi hafalan suara untuk ayat ini"
            >
              <Mic className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span className="hidden sm:inline">Dikte Suara</span>
            </button>

            <button
              onClick={() => {
                setIsFocusMode(false);
                setPlayingAudioUrl(null);
              }}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              title="Keluar dari Mode Fokus (Esc)"
            >
              <Minimize2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Keluar Fokus (Esc)</span>
            </button>
          </div>
        </div>

        {/* Central Zen Stage: Single Large Ayah Display */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 lg:p-14 relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[460px]">
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-radial from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

          {/* Ayah Badge & Memory Testing Toggle */}
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold rounded-lg">
              Ayat #{focusedAyah.numberInSurah}
            </span>

            <button
              onClick={() => setFocusHideArabic(!focusHideArabic)}
              className={`px-3 py-1 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                focusHideArabic
                  ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Tutup teks Arab untuk menguji hafalan aktif"
            >
              {focusHideArabic ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{focusHideArabic ? 'Tampilkan Teks' : 'Uji Ingatan (Tutup Teks)'}</span>
            </button>

            <button
              onClick={() => setFocusShowDetails(!focusShowDetails)}
              className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {focusShowDetails ? 'Sembunyikan Catatan' : 'Tampilkan Catatan'}
            </button>
          </div>

          {/* Main Large Ayah Arabic Calligraphy with Interactive Clickable Words */}
          <div className="w-full max-w-4xl py-4 sm:py-6 relative z-10">
            {focusHideArabic ? (
              <div className="py-12 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-dashed border-amber-300 dark:border-amber-700 text-center space-y-2">
                <div className="text-amber-600 dark:text-amber-400 font-bold text-sm">
                  [Teks Arab Ditutup untuk Uji Ingatan]
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Bayangkan titik Kota Memori dan lafalkan ayat ini dari ingatan visual Anda, 
                  kemudian putar audio untuk mencocokkan kelancaran.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Click Word Instruction Banner */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-full text-xs text-emerald-800 dark:text-emerald-300 font-medium shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Klik kata apa pun untuk mendengarkan lafaz Tajwid AI & makhraj per-kata</span>
                </div>

                {/* Interactive Word Tokens */}
                <div
                  dir="rtl"
                  className="flex flex-wrap justify-center items-center gap-x-2.5 sm:gap-x-4 gap-y-3 py-2 leading-relaxed"
                >
                  {verseWords.map((word, idx) => {
                    const isSelected = selectedWordIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleWordClick(word, idx)}
                        className={`font-quran text-3xl sm:text-5xl md:text-6xl px-2.5 py-1.5 rounded-2xl transition-all cursor-pointer select-none leading-normal relative group ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 ring-4 ring-emerald-400/50 scale-105'
                            : 'text-slate-900 dark:text-amber-50 hover:bg-emerald-500/15 hover:text-emerald-700 dark:hover:text-emerald-300 hover:scale-102'
                        }`}
                        title={`Klik untuk mendengar lafaz tajwid kata: ${word}`}
                      >
                        <span>{word}</span>
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-slate-900 text-white dark:bg-slate-800 px-2 py-0.5 rounded font-sans pointer-events-none whitespace-nowrap z-20 shadow-xs">
                          Dengar Tajwid
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* AI-Powered Ayah Pronunciation Guide Card */}
          {selectedWord && (
            <div className="w-full max-w-3xl mt-4 mb-2 p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-emerald-500/30 dark:border-emerald-500/40 shadow-lg text-left relative z-20 space-y-4 animate-fade-in">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <span>AI Ayah Pronunciation Guide</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-normal text-slate-500 dark:text-slate-400">Kata #{selectedWordIndex !== null ? selectedWordIndex + 1 : 1}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      Panduan Pelafalan & Makhraj Kata Terpilih
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Word Navigation */}
                  <button
                    onClick={handlePrevWord}
                    disabled={selectedWordIndex === 0}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Kata Sebelumnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextWord}
                    disabled={selectedWordIndex === verseWords.length - 1}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Kata Selanjutnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedWord(null);
                      setSelectedWordIndex(null);
                      setWordGuide(null);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                    title="Tutup Panduan Kata"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Word Spotlight & Audio Playback Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center gap-4">
                  <div className="font-quran text-3xl sm:text-4xl text-emerald-800 dark:text-emerald-300 font-bold px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    {selectedWord}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white italic">
                      "{wordGuide?.transliteration || selectedWord}"
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      {wordGuide?.translation || 'Lafaz Al-Quran'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => replayWord(0.7)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isPlayingWordAudio && wordSpeechRate < 0.8
                        ? 'bg-amber-600 text-white animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                    title="Dengarkan dengan tempo tartil lambat untuk memperjelas makhraj"
                  >
                    <Volume1 className="w-4 h-4 text-amber-500" />
                    <span>0.7x Tartil Lambat</span>
                  </button>

                  <button
                    onClick={() => replayWord(0.85)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all flex items-center gap-1.5 cursor-pointer ${
                      isPlayingWordAudio && wordSpeechRate >= 0.8
                        ? 'bg-emerald-700 ring-2 ring-emerald-400 animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-500'
                    }`}
                    title="Dengarkan pelafalan tajwid normal"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Putar Tajwid</span>
                  </button>
                </div>
              </div>

              {/* Phonetic Breakdown Grid */}
              {isLoadingWordGuide ? (
                <div className="py-6 text-center space-y-2">
                  <div className="inline-block w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Menganalisis makharijul huruf & kaidah tajwid kata...
                  </p>
                </div>
              ) : wordGuide ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Makharijul Huruf */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                    <div className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Makharijul Huruf (Titik Artikulasi)</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {wordGuide.makhraj}
                    </p>
                  </div>

                  {/* Kaidah Tajwid */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                    <div className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5 text-sky-700 dark:text-sky-400">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Kaidah Tajwid yang Berlaku</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {wordGuide.tajweedRule}
                    </p>
                  </div>

                  {/* Kesalahan Umum yang Harus Dihindari */}
                  <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 space-y-1">
                    <div className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                      <span>⚠️ Kesalahan Umum (Lahn) yang Harus Dihindari</span>
                    </div>
                    <p className="text-rose-800 dark:text-rose-200/90 leading-relaxed">
                      {wordGuide.commonMistakes}
                    </p>
                  </div>

                  {/* Tips Praktis Pelafalan AI */}
                  <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 space-y-1">
                    <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Tips Praktis Lidah & Bibir</span>
                    </div>
                    <p className="text-amber-800 dark:text-amber-200/90 leading-relaxed">
                      {wordGuide.pronunciationTip}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Transliteration & Translation in Focus Mode */}
          {focusShowDetails && (
            <div className="w-full max-w-3xl mt-4 space-y-2 text-center relative z-10">
              <p className="text-sm sm:text-base font-medium text-emerald-800 dark:text-emerald-400 italic">
                "{focusedAyah.transliteration}"
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {focusedAyah.translationId}
              </p>

              {/* Memory Palace & Tajweed hint card */}
              {(focusedAyah.tajweedRule || focusedAyah.memoryHint) && (
                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-left max-w-2xl mx-auto space-y-1">
                  {focusedAyah.memoryHint && (
                    <div className="text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <strong>Kota Memori:</strong> {focusedAyah.memoryHint}
                      </div>
                    </div>
                  )}
                  {focusedAyah.tajweedRule && (
                    <div className="text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <strong>Kaidah Tajwid:</strong> {focusedAyah.tajweedRule}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Ayat Navigation Strip (Previous / Next) */}
          <div className="w-full max-w-xl flex items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 relative z-10">
            <button
              onClick={() => {
                if (selectedAyah > 1) {
                  setSelectedAyah(selectedAyah - 1);
                  setFocusCurrentLoop(1);
                }
              }}
              disabled={selectedAyah <= 1}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors disabled:opacity-30 flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Ayat Sebelumnya</span>
            </button>

            {/* Ayah Slider or Step Indicator */}
            <div className="text-xs font-mono text-slate-500">
              {focusedAyah.numberInSurah} / {ayahs.length}
            </div>

            <button
              onClick={() => {
                if (selectedAyah < ayahs.length) {
                  setSelectedAyah(selectedAyah + 1);
                  setFocusCurrentLoop(1);
                }
              }}
              disabled={selectedAyah >= ayahs.length}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors disabled:opacity-30 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Ayat Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Audio Controls Console for Current Ayah */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              {/* Big Play/Pause Button */}
              {focusedAyah.audioUrl && (
                <button
                  onClick={() => togglePlayAudio(focusedAyah.audioUrl!)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-all cursor-pointer ${
                    isPlayingCurrent
                      ? 'bg-amber-600 hover:bg-amber-500 active:scale-95'
                      : 'bg-emerald-600 hover:bg-emerald-500 active:scale-95'
                  }`}
                  title={isPlayingCurrent ? 'Jeda Audio' : 'Putar Audio Ayat'}
                >
                  {isPlayingCurrent ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
              )}

              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Murottal Syaikh Mishary Rashid Alafasy</span>
                  {isPlayingCurrent && (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                      (Sedang Memutar · Putaran {focusCurrentLoop}/{focusRepeatLimit === 'infinite' ? '∞' : focusRepeatLimit})
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500">
                  Audio berkualitas jernih per-ayat dengan fitur pengulangan mandiri
                </div>
              </div>
            </div>

            {/* Loop / Repeat Selector per-ayat */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5 text-slate-400" />
                <span>Ulangi:</span>
              </span>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                {[1, 3, 5, 7, 'infinite'].map((count) => {
                  const isSelected = focusRepeatLimit === count;
                  return (
                    <button
                      key={String(count)}
                      onClick={() => {
                        setFocusRepeatLimit(count as any);
                        setFocusCurrentLoop(1);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {count === 'infinite' ? '∞' : `${count}x`}
                    </button>
                  );
                })}
              </div>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                {[0.75, 1, 1.25].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handleRateChange(rate)}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      audioPlaybackRate === rate
                        ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Auto-advance & Status Tagger */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={focusAutoAdvance}
                onChange={(e) => setFocusAutoAdvance(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
              />
              <span>Lanjut otomatis ke ayat berikutnya setelah putaran selesai</span>
            </label>

            {/* Quick Status Tagger for Focused Ayah */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400 mr-1">Tandai Status:</span>
              <button
                onClick={() => updateAyahStatus(selectedSurah, focusedAyah.numberInSurah, 'unlearned')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                  currentStatus === 'unlearned'
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                Belum
              </button>

              <button
                onClick={() => updateAyahStatus(selectedSurah, focusedAyah.numberInSurah, 'memorizing')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                  currentStatus === 'memorizing'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
                }`}
              >
                Menghafal
              </button>

              <button
                onClick={() => updateAyahStatus(selectedSurah, focusedAyah.numberInSurah, 'reviewing')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                  currentStatus === 'reviewing'
                    ? 'bg-sky-600 text-white'
                    : 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 hover:bg-sky-100'
                }`}
              >
                Muraja'ah
              </button>

              <button
                onClick={() => updateAyahStatus(selectedSurah, focusedAyah.numberInSurah, 'mutqin')}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                  currentStatus === 'mutqin'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mutqin (Lancar)</span>
              </button>

              <button
                onClick={() => openReflectionForAyah(selectedSurah, focusedAyah.numberInSurah)}
                className="px-3 py-1 text-xs rounded-lg font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors flex items-center gap-1.5 cursor-pointer border border-amber-200 dark:border-amber-800/60"
                title="Buka Tadabbur & Refleksi Ayat di Think Quran"
              >
                <Compass className="w-3.5 h-3.5 text-amber-500" />
                <span>Think Quran</span>
              </button>

              <button
                onClick={() => setShowVoiceJournalModal(true)}
                className="px-3 py-1 text-xs rounded-lg font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors flex items-center gap-1.5 cursor-pointer border border-emerald-200 dark:border-emerald-800/60"
                title="Dikte jurnal suara refleksi hafalan ayat ini"
              >
                <Mic className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>Dikte Suara</span>
              </button>
            </div>
          </div>
        </div>

        {/* Voice-to-Text Journal Modal in Focus Mode */}
        <VoiceMemorizationJournal
          isModal={true}
          isOpen={showVoiceJournalModal}
          onClose={() => setShowVoiceJournalModal(false)}
        />
      </div>
    );
  }

  /* -------------------------------------------------------------
     RENDER: STANDARD CATALOG & AYAH LIST VIEW
  ------------------------------------------------------------- */
  return (
    <div className="space-y-6">
      <audio ref={audioRef} onEnded={handleAudioEnded} className="hidden" />

      {/* Search & Filter Header Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama surat (Al-Mulk, Yasin), arti, atau nomor..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Filter controls & Mode Fokus Launcher Button */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Juz selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <span className="whitespace-nowrap">Juz:</span>
            <select
              value={filterJuz}
              onChange={(e) => setFilterJuz(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Semua 30 Juz</option>
              <option value="1">Juz 1</option>
              <option value="29">Juz 29 (Tabarak)</option>
              <option value="30">Juz 30 ('Amma)</option>
            </select>
          </div>

          {/* Audio Speed */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs">
            <span className="px-2 text-slate-500 text-[11px]">Speed:</span>
            {[0.75, 1, 1.25].map(rate => (
              <button
                key={rate}
                onClick={() => handleRateChange(rate)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  audioPlaybackRate === rate 
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Dedicated Mode Fokus Button */}
          <button
            onClick={() => {
              setIsFocusMode(true);
              setFocusCurrentLoop(1);
            }}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            title="Masuk ke Mode Fokus (Zen Satu Ayat & Bebas Notifikasi)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Mode Fokus</span>
          </button>
        </div>
      </div>

      {/* Visual Daily Target & Memorization Progress Tracker Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 relative overflow-hidden space-y-5">
        {/* Subtle Ambient Background Gradient */}
        <div className="absolute top-0 right-0 w-80 h-40 bg-radial from-emerald-500/10 via-teal-500/5 to-transparent pointer-events-none rounded-bl-full" />

        {/* Header row: Title, Type Badge, Unit Switcher & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0 shadow-xs">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Target Hafalan Harian
                </h3>
                {/* Mode & Unit Badge */}
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  targetUnit === 'page'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/60'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                }`}>
                  {targetUnit === 'page' 
                    ? `Target: ${targetPageCount} Halaman Mushaf (~${targetCount} Ayat)`
                    : dailyTarget.targetType === 'surah'
                    ? `Fokus Surat: ${dailyTarget.targetSurahName || activeSurahMeta.nameLatin} (${targetCount} Ayat)`
                    : `Target: ${targetCount} Ayat / Hari`}
                </span>

                {/* Consecutive Goal Streak Badge (Shows Trophy icon when streak exceeds 7 days) */}
                <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-all ${
                  isStreakExceeds7Days
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700 shadow-2xs'
                    : 'bg-orange-50 dark:bg-orange-950/50 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800/60'
                }`}>
                  {isStreakExceeds7Days ? (
                    <>
                      <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                      <span>Streak: {currentGoalStreak} Hari (Trofi 🏆)</span>
                    </>
                  ) : (
                    <>
                      <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-400 shrink-0" />
                      <span>Streak: {currentGoalStreak} Hari</span>
                    </>
                  )}
                </div>

                {isTargetAchieved && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1 shadow-2xs">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Target Tercapai Hari Ini!
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tetapkan target harian berbasis ayat atau halaman (Mushaf) dengan pengukur progres melingkar yang presisi.
              </p>
            </div>
          </div>

          {/* Quick Unit Switcher & Action buttons */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center flex-wrap">
            {/* Unit Toggle Pill */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs font-medium">
              <button
                type="button"
                onClick={() => handleToggleUnit('ayat')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  targetUnit === 'ayat'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Beralih ke target hitungan Ayat"
              >
                <TrendingUp className="w-3 h-3" />
                <span>Ayat</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleUnit('page')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  targetUnit === 'page'
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Beralih ke target hitungan Halaman Mushaf (1 Halaman = 15 Ayat)"
              >
                <Layers className="w-3 h-3" />
                <span>Halaman (Page)</span>
              </button>
            </div>

            <button
              onClick={() => setShowVoiceJournalModal(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Dikte lisan refleksi progres hafalan hari ini dengan mikrofon"
            >
              <Mic className="w-3.5 h-3.5 animate-pulse" />
              <span>Dikte Jurnal Suara</span>
              {memorizationJournals.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-800 text-[10px] font-bold">
                  {memorizationJournals.length}
                </span>
              )}
            </button>

            <button
              onClick={openTargetModal}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Atur target jumlah ayat atau halaman yang ingin dihafal"
            >
              <Settings2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Atur Target</span>
            </button>

            <button
              onClick={resetDailyTargetProgress}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset progres target hari ini"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Hero Showcase: Circular Progress Ring + Prominent Remaining Count */}
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800/80 relative z-10 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Column 1: SVG Circular Progress Ring (4 Cols) */}
            <div className="md:col-span-4 flex items-center justify-center p-2 border-b md:border-b-0 md:border-r border-slate-200/70 dark:border-slate-700/70 pb-4 md:pb-0">
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-28 h-28 sm:w-32 sm:h-32 -rotate-90 drop-shadow-xs" viewBox="0 0 100 100">
                  {/* Track Background */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-slate-200 dark:stroke-slate-700/80"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Animated Progress Arc */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#quranProgressRingGrad)"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - targetProgressPct / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                  <defs>
                    <linearGradient id="quranProgressRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#0d9488" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Center Percentage Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white leading-none">
                    {targetProgressPct}%
                  </span>
                  <span className={`text-[11px] font-bold mt-1 px-2 py-0.5 rounded-full ${
                    isTargetAchieved 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300' 
                      : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {isTargetAchieved ? 'Tuntas 🎉' : 'Tercapai'}
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2: Prominent Remaining Count Hero Showcase (8 Cols) */}
            <div className="md:col-span-8 flex flex-col justify-center space-y-3 pl-0 md:pl-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Big Remaining Count */}
                <div className="flex items-center gap-3.5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-mono font-black text-2xl sm:text-3xl shrink-0 shadow-sm ${
                    isTargetAchieved
                      ? 'bg-emerald-600 text-white shadow-emerald-500/25 ring-4 ring-emerald-400/20'
                      : 'bg-amber-500 text-white shadow-amber-500/25 ring-4 ring-amber-400/20'
                  }`}>
                    {targetUnit === 'page' ? (isTargetAchieved ? 0 : remainingPages) : (isTargetAchieved ? 0 : remainingTargetCount)}
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{targetUnit === 'page' ? 'Halaman Tersisa Hari Ini' : 'Ayat Tersisa Hari Ini'}</span>
                      {isTargetAchieved && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                          100% Selesai
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {isTargetAchieved 
                        ? `Alhamdulillah, seluruh target ${targetUnit === 'page' ? `${targetPageCount} halaman (${targetCount} ayat)` : `${targetCount} ayat`} telah diselesaikan hari ini.` 
                        : targetUnit === 'page'
                        ? `Tersisa ± ${remainingTargetCount} ayat lagi untuk menuntaskan ${targetPageCount} halaman (${targetCount} ayat).`
                        : `Tersisa ${remainingTargetCount} ayat lagi menuju pemenuhan target ${targetCount} ayat harian Anda.`}
                    </p>
                  </div>
                </div>

                {/* Bonus XP Chip */}
                <div className="shrink-0 self-start sm:self-center">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-xs font-bold text-amber-800 dark:text-amber-300">
                    <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>+60 XP Bonus Target</span>
                  </div>
                </div>
              </div>

              {/* Progress Summary Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Total Selesai</div>
                  <div className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                    {targetUnit === 'page' 
                      ? `${completedPages} / ${targetPageCount} Halaman` 
                      : `${completedCount} / ${targetCount} Ayat`}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Status Ayat</div>
                  <div className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {completedCount} Ayat Terhitung
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Satuan Aktif</div>
                  <div className="font-extrabold text-teal-600 dark:text-teal-400 mt-0.5 capitalize flex items-center gap-1">
                    {targetUnit === 'page' ? <Layers className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                    <span>{targetUnit === 'page' ? 'Halaman (Page)' : 'Jumlah Ayat'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Consecutive Days Goal Streak Showcase Card (Shows Trophy icon when streak exceeds 7 days) */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            isStreakExceeds7Days
              ? 'bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-emerald-500/10 dark:from-amber-950/40 dark:via-yellow-950/20 dark:to-emerald-950/30 border-amber-300 dark:border-amber-700/80 shadow-xs ring-1 ring-amber-400/20'
              : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 shadow-xs'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left: Streak Icon + Counter + Description */}
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform ${
                  isStreakExceeds7Days
                    ? 'bg-amber-500 text-white shadow-amber-500/30 ring-4 ring-amber-300/40 dark:ring-amber-500/30 animate-pulse'
                    : 'bg-orange-500/15 text-orange-600 dark:text-orange-400 ring-4 ring-orange-500/10'
                }`}>
                  {isStreakExceeds7Days ? (
                    <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-amber-200 drop-shadow-sm" />
                  ) : (
                    <Flame className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500 fill-orange-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {currentGoalStreak} Hari Berturut-turut
                    </span>

                    {isStreakExceeds7Days ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 flex items-center gap-1 shadow-xs">
                        <Trophy className="w-3.5 h-3.5 text-slate-950 fill-slate-900" />
                        <span>Trofi Istiqomah Emas Terbuka (&gt; 7 Hari)</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-400" />
                        <span>{Math.max(1, 8 - currentGoalStreak)} hari lagi melampaui 7 hari menuju Trofi Emas</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {isStreakExceeds7Days ? (
                      <span>Mabruk! Streak Anda telah <strong>melampaui 7 hari</strong> berturut-turut menyelesaikan target harian. <strong>Trofi Istiqomah Emas 🏆</strong> aktif sebagai bukti kedisiplinan dan keberkahan hafalan Anda.</span>
                    ) : (
                      <span>Konsisten menuntaskan target harian setiap hari. Capai streak lebih dari 7 hari berturut-turut untuk membuka <strong>Trofi Istiqomah Emas 🏆</strong>.</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Right: Quick Streak Simulator / Testing Controls */}
              <div className="flex items-center gap-1.5 self-start md:self-center flex-wrap shrink-0">
                <span className="text-[11px] text-slate-400 mr-1 font-medium hidden sm:inline">Uji Streak:</span>
                <button
                  type="button"
                  onClick={() => simulateGoalStreak(4)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                    currentGoalStreak === 4
                      ? 'bg-slate-700 text-white dark:bg-slate-600 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                  title="Uji coba streak 4 hari (Di bawah 7 hari, ikon api)"
                >
                  <span className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-500" />
                    <span>4 Hari</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => simulateGoalStreak(7)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                    currentGoalStreak === 7
                      ? 'bg-slate-700 text-white dark:bg-slate-600 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                  title="Uji coba streak tepat 7 hari"
                >
                  <span className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-500" />
                    <span>7 Hari</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => simulateGoalStreak(8)}
                  className={`px-3 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                    currentGoalStreak === 8
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100'
                  }`}
                  title="Uji coba streak 8 hari (Melampaui 7 hari, membuka Trofi 🏆)"
                >
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>8 Hari (Trofi 🏆)</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => simulateGoalStreak(14)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                    currentGoalStreak === 14
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                  title="Uji coba streak 14 hari (Melampaui 7 hari, Trofi 🏆)"
                >
                  <span>14 Hari</span>
                </button>
              </div>
            </div>

            {/* 7-Day Rolling Day Checkmark Indicator Strip */}
            <div className="mt-3.5 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
              {recentStreakDays.map((day, idx) => (
                <div 
                  key={idx}
                  className={`p-1.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    day.isCompleted
                      ? isStreakExceeds7Days 
                        ? 'bg-amber-500/15 border-amber-300/80 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 ring-1 ring-amber-400/20'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                      : day.isToday
                      ? 'bg-amber-50/50 dark:bg-amber-950/20 border-dashed border-amber-300 text-amber-700'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-semibold opacity-75">
                    {day.isToday ? 'Hari Ini' : day.dayName}
                  </span>
                  <div className="my-0.5">
                    {day.isCompleted ? (
                      isStreakExceeds7Days ? (
                        <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 font-bold" />
                      )
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-dashed border-slate-300 dark:border-slate-600 block" />
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">
                    Tgl {day.dayOfMonth}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Animated Linear Bar for Extra Clarity */}
          <div className="w-full bg-slate-200/80 dark:bg-slate-700/80 rounded-full h-3 p-0.5 overflow-hidden shadow-inner relative">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 transition-all duration-700 ease-out shadow-xs shadow-emerald-500/20 relative"
              style={{ width: `${targetProgressPct}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Visual Step Slots / Slot Visualizer */}
          <div className="pt-1">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Slot Target Ayat ({completedCount}/{targetCount})</span>
              <span>{isTargetAchieved ? '100% Selesai' : `${remainingTargetCount} slot tersisa`}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {Array.from({ length: Math.min(targetCount, 12) }).map((_, idx) => {
                const isSlotCompleted = idx < completedCount;
                const isCurrentSlot = idx === completedCount;
                const key = completedKeys[idx];
                const keyLabel = key ? `Ayat ${key.split('_')[1]}` : `Ayat #${idx + 1}`;

                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      isSlotCompleted
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                        : isCurrentSlot
                        ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/80 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/40 animate-pulse'
                        : 'bg-white dark:bg-slate-800/40 border-dashed border-slate-200 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSlotCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrentSlot
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                    }`}>
                      {isSlotCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">
                        {isSlotCompleted ? keyLabel : isCurrentSlot ? 'Sedang Diproses' : `Target #${idx + 1}`}
                      </div>
                      <div className="text-[10px] opacity-75 truncate">
                        {isSlotCompleted ? 'Selesai' : isCurrentSlot ? 'Langkah berikutnya' : 'Menunggu'}
                      </div>
                    </div>
                  </div>
                );
              })}
              {targetCount > 12 && (
                <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-center text-xs text-slate-500 font-semibold">
                  +{targetCount - 12} Ayat Lainnya
                </div>
              )}
            </div>
          </div>

          {/* Stats Breakdown Pills & Quick Action */}
          <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-3 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-500">Rincian Hari Ini:</span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-medium border border-amber-200/60">
                {todayProgressStats.memorizingCount} Menghafal
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 font-medium border border-sky-200/60">
                {todayProgressStats.reviewingCount} Muraja'ah
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-medium border border-emerald-200/60">
                {todayProgressStats.mutqinCount} Mutqin
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowVoiceJournalModal(true)}
                className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 rounded-lg font-semibold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Rekam jurnal lisan refleksi hafalan hari ini menggunakan mikrofon"
              >
                <Mic className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>Dikte Suara ({memorizationJournals.length})</span>
              </button>

              <button
                onClick={() => {
                  setSelectedAyah(1);
                  setIsFocusMode(true);
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Mulai di Mode Fokus</span>
              </button>
            </div>
          </div>
        </div>

        {/* Motivation & Hadith Callout */}
        <div className={`p-4 rounded-xl text-xs flex items-center gap-3 border ${
          isTargetAchieved
            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
        }`}>
          <div className="w-7 h-7 rounded-lg bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            {isTargetAchieved ? <Award className="w-4 h-4 text-emerald-600" /> : <Lightbulb className="w-4 h-4 text-amber-500" />}
          </div>
          <div className="flex-1">
            {isTargetAchieved ? (
              <p>
                <strong>Mabruk! Target harian {targetCount} ayat Anda telah tercapai penuh hari ini.</strong> Konsistensi Anda menjaga Al-Quran adalah investasi terbaik dunia dan akhirat. (+60 XP telah ditambahkan)
              </p>
            ) : (
              <p>
                <em>"Amalan yang paling dicintai oleh Allah adalah amalan yang berkesinambungan (istiqomah) walaupun sedikit."</em> (HR. Muslim). Tandai ayat di bawah sebagai Menghafal, Muraja'ah, atau Mutqin untuk mengisi target hari ini.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Voice-to-Text Memorization Progress Journal Strip */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 rounded-2xl p-4 sm:p-5 border border-emerald-800/50 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 shadow-xs border border-emerald-500/30">
            <Mic className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Mikrofon API · Voice-to-Text
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {memorizationJournals.length} Catatan Tersimpan
              </span>
            </div>
            <h4 className="text-base font-bold text-white mt-1">
              Jurnal Suara Refleksi Progres Hafalan
            </h4>
            <p className="text-xs text-slate-300 font-light mt-0.5 max-w-xl">
              Ungkapkan secara lisan pencapaian target harian, tantangan tajwid pada surat {activeSurahMeta.nameLatin}, serta doa dan rasa syukurmu. Dikonversi otomatis menjadi teks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            type="button"
            onClick={() => setShowInlineVoiceJournal(!showInlineVoiceJournal)}
            className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>{showInlineVoiceJournal ? 'Tutup Panel Dikte' : 'Buka Panel Dikte'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowVoiceJournalModal(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Mic className="w-4 h-4 text-slate-950" />
            <span>Mulai Dikte Suara (+35 XP)</span>
          </button>
        </div>
      </div>

      {showInlineVoiceJournal && (
        <VoiceMemorizationJournal
          isModal={false}
          isOpen={true}
        />
      )}

      {/* 2-Column Split: Surah Drawer / Catalog + Active Surah Ayah List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Surah List (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[700px]">
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Daftar Surat ({filteredSurahs.length})
            </div>
            <div className="text-xs text-slate-500">
              Pilih untuk Menghafal
            </div>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/60 p-1">
            {filteredSurahs.map((surah) => {
              const isSelected = surah.number === selectedSurah;
              return (
                <button
                  key={surah.number}
                  onClick={() => {
                    setSelectedSurah(surah.number);
                    setSelectedAyah(1);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0 ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {surah.number}
                    </div>
                    <div className="min-w-0 truncate">
                      <div className="text-sm font-semibold truncate flex items-center gap-2">
                        <span>{surah.nameLatin}</span>
                        {surah.number === 55 && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                            ★ 78 Ayat Asli
                          </span>
                        )}
                        {surah.number === 67 && (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">
                            ★ Blueprint
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {surah.indonesianNameTranslation} · {surah.numberOfAyahs} ayat
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-quran text-lg leading-none text-slate-800 dark:text-slate-100">
                      {surah.nameArabic}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Juz {surah.juzStart}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Surah Workspace & Ayahs (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Surah Hero Card */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-xl p-5 shadow-sm border border-emerald-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-emerald-200 mb-1">
                  <span>Surat ke-{activeSurahMeta.number}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeSurahMeta.revelationType === 'Meccan' ? 'Makkiyyah' : 'Madaniyyah'}</span>
                  <span aria-hidden="true">·</span>
                  <span>Juz {activeSurahMeta.juzStart}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeSurahMeta.numberOfAyahs} Ayat</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {activeSurahMeta.nameLatin} ({activeSurahMeta.indonesianNameTranslation})
                </h2>
              </div>

              <div className="text-right">
                <div className="font-quran text-3xl text-emerald-100">
                  {activeSurahMeta.nameArabic}
                </div>
                <div className="text-xs text-emerald-200/80 mt-1">
                  Progres: {surahMutqinCount} dari {ayahs.length} ayat Mutqin ({surahProgressPct}%)
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-black/25 rounded-full h-2 mt-4 overflow-hidden">
              <div 
                className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${surahProgressPct}%` }}
              />
            </div>

            {/* Action shortcuts */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-emerald-700/60">
              <button
                onClick={() => {
                  setSelectedAyah(1);
                  setIsFocusMode(true);
                }}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Masuk Mode Fokus Surat Ini</span>
              </button>

              <button
                onClick={() => setActiveTab('palace')}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 text-white"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Buka Blueprint Kota Memori</span>
              </button>

              <button
                onClick={() => setActiveTab('tajweed')}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 text-white"
              >
                <Mic className="w-3.5 h-3.5 text-sky-300" />
                <span>Uji Tajwid dengan Suara AI</span>
              </button>
            </div>
          </div>

          {/* Ayahs List */}
          <div className="space-y-4">
            {ayahs.map((ayah) => {
              const status = getAyahStatus(selectedSurah, ayah.numberInSurah);
              const isPlaying = playingAudioUrl === ayah.audioUrl;

              return (
                <div
                  key={ayah.numberInSurah}
                  className={`bg-white dark:bg-slate-900 rounded-xl p-5 border transition-all shadow-xs ${
                    status === 'mutqin'
                      ? 'border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/20'
                      : status === 'memorizing' || status === 'reviewing'
                      ? 'border-amber-200 dark:border-amber-800/80'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {/* Top Ayah Meta & Status */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold flex items-center justify-center">
                        {ayah.numberInSurah}
                      </div>
                      <div className="text-xs text-slate-500">
                        {activeSurahMeta.nameLatin}:{ayah.numberInSurah}
                      </div>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <div className="text-xs font-medium">
                        {status === 'mutqin' && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            Mutqin (Lancar)
                          </span>
                        )}
                        {status === 'reviewing' && (
                          <span className="text-sky-600 dark:text-sky-400 font-medium">
                            Proses Muraja'ah
                          </span>
                        )}
                        {status === 'memorizing' && (
                          <span className="text-amber-600 dark:text-amber-400 font-medium">
                            Sedang Menghafal
                          </span>
                        )}
                        {status === 'unlearned' && (
                          <span className="text-slate-400">
                            Belum Dihafal
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions: Audio Player & Mode Fokus shortcut */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedAyah(ayah.numberInSurah);
                          setIsFocusMode(true);
                        }}
                        className="p-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        title="Fokuskan Ayat Ini dalam Mode Zen"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Fokus</span>
                      </button>

                      {ayah.audioUrl && (
                        <button
                          onClick={() => togglePlayAudio(ayah.audioUrl!)}
                          className={`p-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                            isPlaying
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                          title="Dengarkan Qari Syaikh Mishary Alafasy"
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Jeda</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Dengarkan</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Arabic Text Display */}
                  <div className="py-4 text-right">
                    <p 
                      dir="rtl" 
                      className={`font-quran leading-loose text-slate-900 dark:text-slate-50 ${arabicTextSizeClass}`}
                    >
                      {ayah.textArabic}
                    </p>
                  </div>

                  {/* Transliteration & Indonesian Translation */}
                  <div className="space-y-1 text-left pt-2 pb-3">
                    <p className="text-xs sm:text-sm font-medium text-emerald-800 dark:text-emerald-400 italic">
                      "{ayah.transliteration}"
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {ayah.translationId}
                    </p>
                  </div>

                  {/* Tajweed & Memory Palace Notes */}
                  {ayah.tajweedRule && (
                    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3 text-xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800/80 space-y-1 mb-3">
                      <div>
                        <strong className="text-emerald-700 dark:text-emerald-400">Kaidah Tajwid:</strong> {ayah.tajweedRule}
                      </div>
                      {ayah.memoryHint && (
                        <div>
                          <strong className="text-amber-700 dark:text-amber-400">Jangkar Kota Memori:</strong> {ayah.memoryHint}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Memorization Status Selector Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs text-slate-500 font-medium">
                      Tandai Status Hafalan:
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => updateAyahStatus(selectedSurah, ayah.numberInSurah, 'unlearned')}
                        className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                          status === 'unlearned'
                            ? 'bg-slate-700 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        Belum
                      </button>

                      <button
                        onClick={() => updateAyahStatus(selectedSurah, ayah.numberInSurah, 'memorizing')}
                        className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                          status === 'memorizing'
                            ? 'bg-amber-600 text-white'
                            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
                        }`}
                      >
                        Menghafal
                      </button>

                      <button
                        onClick={() => updateAyahStatus(selectedSurah, ayah.numberInSurah, 'reviewing')}
                        className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                          status === 'reviewing'
                            ? 'bg-sky-600 text-white'
                            : 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 hover:bg-sky-100'
                        }`}
                      >
                        Muraja'ah
                      </button>

                      <button
                        onClick={() => updateAyahStatus(selectedSurah, ayah.numberInSurah, 'mutqin')}
                        className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                          status === 'mutqin'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mutqin (Lancar)</span>
                      </button>

                      <button
                        onClick={() => openReflectionForAyah(selectedSurah, ayah.numberInSurah)}
                        className="px-2.5 py-1 text-xs rounded-md font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors flex items-center gap-1 cursor-pointer border border-amber-200 dark:border-amber-800/60"
                        title="Buka Tadabbur & Refleksi Ayat di Think Quran"
                      >
                        <Compass className="w-3.5 h-3.5 text-amber-500" />
                        <span>Think Quran</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Target Setting Modal */}
      {showTargetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Atur Target Hafalan Harian
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pilih jumlah ayat harian atau target surat spesifik sesuai ritme Anda
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowTargetModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step 1: Mode & Unit Target Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                1. Pilih Satuan & Mode Target
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTempTargetUnit('ayat');
                    setTempTargetType('ayah_count');
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    tempTargetUnit === 'ayat' && tempTargetType !== 'surah'
                      ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>Target Ayat</span>
                  </div>
                  <div className="text-[10px] opacity-75 mt-0.5">
                    Hitungan per-ayat harian
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTempTargetUnit('page');
                    setTempTargetType('page');
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    tempTargetUnit === 'page'
                      ? 'border-teal-500 bg-teal-50/80 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-semibold ring-2 ring-teal-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-teal-600" />
                    <span>Target Halaman</span>
                  </div>
                  <div className="text-[10px] opacity-75 mt-0.5">
                    Mushaf (1 Hal = 15 Ayat)
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTempTargetType('surah');
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    tempTargetType === 'surah'
                      ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                    <Bookmark className="w-4 h-4 text-emerald-600" />
                    <span>Fokus Surat</span>
                  </div>
                  <div className="text-[10px] opacity-75 mt-0.5">
                    Surat tertentu (Al-Mulk)
                  </div>
                </button>
              </div>
            </div>

            {/* If Surah Mode is Active: Pick Surah */}
            {tempTargetType === 'surah' && (
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-teal-600" />
                  <span>Pilih Surat Target</span>
                </label>
                <select
                  value={tempTargetSurahNumber}
                  onChange={(e) => setTempTargetSurahNumber(parseInt(e.target.value))}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {SURAH_LIST.map(s => (
                    <option key={s.number} value={s.number}>
                      {s.number}. {s.nameLatin} ({s.indonesianNameTranslation}) — {s.numberOfAyahs} Ayat
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500">
                  Ayat yang ditandai dari surat ini akan otomatis masuk ke progres target harian Anda.
                </p>
              </div>
            )}

            {/* Step 2: Presets based on chosen Unit (Ayat or Halaman) */}
            {tempTargetUnit === 'page' ? (
              /* PAGE (HALAMAN) PRESETS */
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-teal-600" />
                    <span>2. Jumlah Halaman per Hari (Standar Mushaf 15 Baris)</span>
                  </label>
                  <span className="text-[11px] font-mono text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md">
                    1 Halaman ≈ 15 Ayat
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { pages: 0.5, label: '½ Halaman', badge: 'Santai', sub: '± 7-8 Ayat / hari' },
                    { pages: 1, label: '1 Halaman', badge: 'Standar', sub: '± 15 Ayat / hari' },
                    { pages: 2, label: '2 Halaman', badge: '1 Lembar', sub: '± 30 Ayat / hari' },
                    { pages: 3, label: '3 Halaman', badge: 'Akselerasi', sub: '± 45 Ayat / hari' },
                    { pages: 4, label: '4 Halaman', badge: '1 Maqra\'', sub: 'Seperempat Juz (± 60 Ayat)' },
                  ].map(p => {
                    const isSelected = tempTargetPageCount === p.pages && customPageInput === String(p.pages);
                    return (
                      <button
                        key={p.pages}
                        type="button"
                        onClick={() => {
                          setTempTargetPageCount(p.pages);
                          setCustomPageInput(String(p.pages));
                          setTempTargetAyahCount(Math.round(p.pages * 15));
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/50 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/20'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold">{p.label}</span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300">
                            {p.badge}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                          {p.sub}
                        </div>
                      </button>
                    );
                  })}

                  {/* Custom Page Input */}
                  <div className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Kustom Halaman</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="20"
                        value={customPageInput}
                        onChange={(e) => {
                          setCustomPageInput(e.target.value);
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            setTempTargetPageCount(val);
                            setTempTargetAyahCount(Math.round(val * 15));
                          }
                        }}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 text-xs text-center font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="0.5-20"
                      />
                      <span className="text-[11px] text-slate-500 whitespace-nowrap">Hal</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* AYAT PRESETS */
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>2. Jumlah Ayat per Hari</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { count: 2, label: '2 Ayat', badge: 'Santai', sub: 'Pekerja Super Sibuk' },
                    { count: 3, label: '3 Ayat', badge: 'Konsisten', sub: 'Standar Harian' },
                    { count: 5, label: '5 Ayat', badge: 'Ideal', sub: 'Metode Islamicity' },
                    { count: 7, label: '7 Ayat', badge: 'Semangat', sub: 'Akselerasi Berkah' },
                    { count: 10, label: '10 Ayat', badge: 'Intensif', sub: 'Karantina Tahfidz' },
                  ].map(p => {
                    const isSelected = tempTargetAyahCount === p.count && customAyahInput === String(p.count);
                    return (
                      <button
                        key={p.count}
                        type="button"
                        onClick={() => {
                          setTempTargetAyahCount(p.count);
                          setCustomAyahInput(String(p.count));
                          setTempTargetPageCount(+(p.count / 15).toFixed(1));
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold">{p.label}</span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                            {p.badge}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                          {p.sub}
                        </div>
                      </button>
                    );
                  })}

                  {/* Custom Count Option */}
                  <div className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Kustom (Angka)</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={customAyahInput}
                        onChange={(e) => {
                          setCustomAyahInput(e.target.value);
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            setTempTargetAyahCount(val);
                            setTempTargetPageCount(+(val / 15).toFixed(1));
                          }
                        }}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 text-xs text-center font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="1-50"
                      />
                      <span className="text-[11px] text-slate-500">Ayat</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Goal Criteria */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                3. Kriteria Penyelesaian Ayat
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setTempGoalMode('all')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    tempGoalMode === 'all'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold">Semua Aktivitas Hafalan</div>
                  <div className="text-[10px] opacity-80 mt-0.5">
                    Menghafal, Muraja'ah, maupun Mutqin dihitung ke target
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTempGoalMode('mutqin')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    tempGoalMode === 'mutqin'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold">Hanya Status Mutqin (Lancar)</div>
                  <div className="text-[10px] opacity-80 mt-0.5">
                    Hanya ayat yang ditandai tuntas mutqin yang dihitung
                  </div>
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowTargetModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSaveTarget}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Simpan & Terapkan Target</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice-to-Text Memorization Progress Journal Modal */}
      <VoiceMemorizationJournal
        isModal={true}
        isOpen={showVoiceJournalModal}
        onClose={() => setShowVoiceJournalModal(false)}
      />
    </div>
  );
};
