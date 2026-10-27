/**
 * Quran Memorization Tracker Component
 * Covers 114 Surahs, 30 Juz, Audio Recitations, Status updates, Fast Search,
 * and Immersive 'Mode Fokus' (Zen Single-Ayah view with per-ayah audio looping and silenced notifications)
 */
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { SURAH_LIST, getAyahsForSurah } from '../data/quranData';
import { Ayah, MemorizationStatus, WordPronunciationGuide } from '../types';
import { playWordSpeech, getWordPronunciationGuide } from '../services/geminiService';
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
  Headphones
} from 'lucide-react';

export const QuranTracker: React.FC = () => {
  const { 
    selectedSurah, 
    setSelectedSurah, 
    selectedAyah, 
    setSelectedAyah, 
    updateAyahStatus, 
    getAyahStatus, 
    userProgress, 
    setActiveTab, 
    fontSize,
    isFocusMode,
    setIsFocusMode 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterJuz, setFilterJuz] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null);
  const [audioPlaybackRate, setAudioPlaybackRate] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
            </div>
          </div>
        </div>
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
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
