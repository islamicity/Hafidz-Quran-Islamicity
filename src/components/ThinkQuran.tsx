/**
 * Think Quran: Tadabbur & Refleksi Kehidupan Cerdas
 * "Temukan Apa yang Sedang Disampaikan Allah SWT melalui Al-Quran-Nya kepada kita."
 * "Pahami lebih banyak dari apa yang kita baca. Lihat kehidupan sehari-hari melalui petunjuk Al-Quran."
 * "Bangun hubungan yang lebih dekat dengan Allah SWT melalui reflection. Rasakan Sebuah Reflection."
 * "Terkadang, Satu Ayat Mengubah Segalanya."
 */
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CURATED_THINK_QURAN_REFLECTIONS, REFLECTION_LIFE_TOPICS } from '../data/thinkQuranData';
import { SURAH_LIST, getAyahsForSurah } from '../data/quranData';
import { generateTadabburReflection } from '../services/geminiService';
import { QuranReflectionItem, UserPersonalReflection } from '../types';
import { 
  Sparkles, 
  Heart, 
  Compass, 
  BookOpen, 
  Play, 
  Pause, 
  Volume2, 
  Send, 
  Bookmark, 
  Share2, 
  Trash2, 
  ChevronRight, 
  Check, 
  PenTool, 
  MessageCircle, 
  Lock, 
  ArrowRight,
  HelpCircle,
  Lightbulb,
  Sun,
  Flame,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const ThinkQuran: React.FC = () => {
  const { 
    savedReflections, 
    saveUserReflection, 
    deleteUserReflection, 
    toggleFavoriteReflection,
    activeReflectionAyah,
    setActiveReflectionAyah,
    setSelectedSurah,
    setSelectedAyah,
    setActiveTab,
    addXP 
  } = useApp();

  // Active theme filter
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  
  // Active Featured Reflection
  const [currentReflectionIndex, setCurrentReflectionIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // AI Interactive Tadabbur State
  const [userLifeQuery, setUserLifeQuery] = useState<string>('');
  const [aiSelectedSurah, setAiSelectedSurah] = useState<number>(67); // Al-Mulk default
  const [aiSelectedAyah, setAiSelectedAyah] = useState<number>(2);
  const [isGeneratingTadabbur, setIsGeneratingTadabbur] = useState<boolean>(false);
  const [customAiReflection, setCustomAiReflection] = useState<QuranReflectionItem | null>(null);

  // Journaling Form State
  const [journalOpen, setJournalOpen] = useState<boolean>(false);
  const [journalSituation, setJournalSituation] = useState<string>('');
  const [journalNote, setJournalNote] = useState<string>('');
  const [journalCommitment, setJournalCommitment] = useState<string>('');
  const [journalMood, setJournalMood] = useState<'tenang' | 'tersentuh' | 'bersemangat' | 'insyaf' | 'bersyukur'>('tenang');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // If activeReflectionAyah is provided from QuranTracker or FocusMode, sync it
  useEffect(() => {
    if (activeReflectionAyah) {
      setAiSelectedSurah(activeReflectionAyah.surahNumber);
      setAiSelectedAyah(activeReflectionAyah.ayahNumber);
      // Check if it matches any curated reflection
      const matchingCuratedIndex = CURATED_THINK_QURAN_REFLECTIONS.findIndex(
        r => r.surahNumber === activeReflectionAyah.surahNumber && r.ayahNumber === activeReflectionAyah.ayahNumber
      );
      if (matchingCuratedIndex !== -1) {
        setCurrentReflectionIndex(matchingCuratedIndex);
      }
    }
  }, [activeReflectionAyah]);

  // Filtered curated reflections
  const filteredReflections = selectedTopic === 'all'
    ? CURATED_THINK_QURAN_REFLECTIONS
    : CURATED_THINK_QURAN_REFLECTIONS.filter(r => r.theme === selectedTopic);

  const activeReflection = customAiReflection || filteredReflections[currentReflectionIndex] || CURATED_THINK_QURAN_REFLECTIONS[0];

  // Audio Playback
  const toggleAudio = () => {
    if (!audioRef.current) {
      const formattedSurah = String(activeReflection.surahNumber).padStart(3, '0');
      const formattedAyah = String(activeReflection.ayahNumber).padStart(3, '0');
      const url = `https://everyayah.com/data/Alafasy_128kbps/${formattedSurah}${formattedAyah}.mp3`;
      const audio = new Audio(url);
      audio.onended = () => setIsPlayingAudio(false);
      audioRef.current = audio;
    }

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().catch(e => console.warn(e));
      setIsPlayingAudio(true);
      addXP(10, 'Mendengarkan Lantunan Tadabbur');
    }
  };

  // Change active reflection
  const handleSelectReflection = (index: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlayingAudio(false);
    setCustomAiReflection(null);
    setCurrentReflectionIndex(index);
  };

  // Trigger Gemini AI Tadabbur for specific life situation
  const handleGenerateAiTadabbur = async () => {
    setIsGeneratingTadabbur(true);
    try {
      const surahMeta = SURAH_LIST.find(s => s.number === aiSelectedSurah);
      const surahAyahs = getAyahsForSurah(aiSelectedSurah);
      const targetAyah = surahAyahs.find(a => a.numberInSurah === aiSelectedAyah) || surahAyahs[0];

      const result = await generateTadabburReflection(
        surahMeta?.nameLatin || 'Al-Quran',
        aiSelectedAyah,
        targetAyah?.textArabic || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        targetAyah?.translationId || 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.',
        userLifeQuery || 'Mencari kejernihan batin di tengah kelelahan rutinitas harian.'
      );

      const generatedItem: QuranReflectionItem = {
        id: 'ai-gen-' + Date.now(),
        surahNumber: aiSelectedSurah,
        surahName: surahMeta?.nameLatin || 'Al-Quran',
        ayahNumber: aiSelectedAyah,
        ayahArabic: targetAyah?.textArabic || '',
        transliteration: targetAyah?.transliteration || '',
        translation: targetAyah?.translationId || '',
        theme: 'Ketenangan & Kecemasan',
        divineMessage: result.divineMessage,
        dailyLifeContext: result.dailyLifeContext,
        soulReflectionPrompt: result.soulReflectionPrompt,
        actionableStep: result.actionableStep,
        heartfeltPrayer: result.heartfeltPrayer,
        tags: ['AI Tadabbur', surahMeta?.nameLatin || 'Al-Quran', 'Refleksi Personal']
      };

      setCustomAiReflection(generatedItem);
      addXP(50, 'Menemukan Petunjuk Hidup di Think Quran');

      // Reset audio for new verse
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlayingAudio(false);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsGeneratingTadabbur(false);
    }
  };

  // Submit personal reflection journal entry
  const handleSubmitJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalNote.trim()) return;

    saveUserReflection({
      ayahRef: `${activeReflection.surahName}: ${activeReflection.ayahNumber}`,
      surahNumber: activeReflection.surahNumber,
      ayahNumber: activeReflection.ayahNumber,
      userLifeSituation: journalSituation || 'Refleksi mendalam ba\'da membaca ayat suci.',
      reflectionNote: journalNote,
      actionCommitment: journalCommitment || 'Menjaga keikhlasan dan istiqamah hari ini.',
      moodTag: journalMood,
      isFavorite: false
    });

    setJournalNote('');
    setJournalSituation('');
    setJournalCommitment('');
    setJournalOpen(false);
  };

  // Copy inspiration card text
  const handleCopyInspiration = (item: QuranReflectionItem) => {
    const text = `✨ *Think Quran - Satu Ayat Mengubah Segalanya* ✨\n\n📖 *${item.surahName} (${item.surahNumber}:${item.ayahNumber})*\n"${item.translation}"\n\n💬 *Pesan Allah SWT Kepadamu:*\n${item.divineMessage}\n\n🔍 *Lensa Keseharian:*\n${item.dailyLifeContext}\n\n🤲 *Doa Reflektif:*\n${item.heartfeltPrayer}\n\n— *Hafidz Quran Islamicity · Think Quran*`;
    navigator.clipboard.writeText(text);
    setCopySuccess(item.id);
    setTimeout(() => setCopySuccess(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* 1. Serene Hero Banner with Contemplation Image & Core Philosophy */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-white shadow-sm">
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/5 opacity-35 md:opacity-50">
          <img
            src="/src/assets/images/think_quran_reflection_1793527833663.jpg"
            alt="Think Quran Serene Contemplation"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 lg:p-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/15 border border-amber-400/30 rounded-full text-xs font-semibold text-amber-300 mb-3">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Think Quran · Tadabbur & Refleksi Kehidupan Cerdas</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3 text-balance leading-tight">
            Temukan Apa yang Sedang Disampaikan Allah SWT Melalui Al-Quran-Nya kepada Kita.
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-light">
            Al-Quran bukan sekadar untuk dibaca dan dihafal, melainkan petunjuk hidup yang hidup. 
            Pahami lebih banyak dari apa yang kita baca. Lihat kehidupan sehari-hari melalui bimbingan wahyu, 
            bangun hubungan yang lebih dekat dengan Allah SWT melalui refleksi tulus.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#satu-ayat"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Rasakan Sebuah Reflection</span>
            </a>

            <a
              href="#tanya-hikmah"
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs sm:text-sm font-medium rounded-xl border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-sky-400" />
              <span>Curhat ke Al-Quran (AI)</span>
            </a>

            <a
              href="#jurnal-refleksi"
              className="px-4 py-2.5 bg-transparent hover:bg-white/10 text-slate-300 text-xs sm:text-sm font-medium rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <PenTool className="w-4 h-4 text-amber-400" />
              <span>Jurnal Refleksi ({savedReflections.length})</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Transformative Philosophy Strip: "Terkadang, Satu Ayat Mengubah Segalanya" */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900/40 to-amber-950/30 rounded-xl p-4 sm:p-5 border border-emerald-800/40 dark:border-emerald-800/20 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 justify-center sm:justify-start">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Kearifan Ruhiyah</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            "Terkadang, Satu Ayat Mengubah Segalanya."
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Satu ayat yang dipahami maknanya dan diresapi hingga relung kalbu sanggup meluruhkan kecemasan menahun, 
            mengubah arah keputusan karir, dan mengembalikan kedamaian rumah tangga.
          </p>
        </div>

        <button
          onClick={() => {
            const randomIdx = Math.floor(Math.random() * CURATED_THINK_QURAN_REFLECTIONS.length);
            handleSelectReflection(randomIdx);
          }}
          className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 shrink-0 cursor-pointer shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
          <span>Ayat Pencerah Lainnya</span>
        </button>
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Pilih Dimensi Kehidupan yang Ingin Kamu Terangi:
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {REFLECTION_LIFE_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => {
                setSelectedTopic(topic.id);
                setCustomAiReflection(null);
                setCurrentReflectionIndex(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
                selectedTopic === topic.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{topic.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. MAIN STAGE: "Rasakan Sebuah Reflection" - Interactive Ayat Showcase */}
      <div id="satu-ayat" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Verses in this Topic (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Koleksi Ayat Pencerah</span>
            </div>
            <span className="text-[11px] text-slate-400">
              {filteredReflections.length} Ayat
            </span>
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredReflections.map((item, idx) => {
              const isSelected = !customAiReflection && idx === currentReflectionIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectReflection(idx)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/50 shadow-2xs'
                      : 'border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.surahName} : {item.ayahNumber}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                      {item.theme}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 italic">
                    "{item.translation}"
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                    <span>Lihat Refleksi</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Contemplation Card (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-6 shadow-sm">
          {/* Header of Active Ayah */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Tadabbur Terfokus · {activeReflection.theme}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                Surah {activeReflection.surahName} (Ayat {activeReflection.ayahNumber})
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleAudio}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
                title="Dengarkan tilawah tartil merdu Mishary Alafasy"
              >
                {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlayingAudio ? 'Jeda Audio' : 'Dengarkan Ayat'}</span>
              </button>

              <button
                onClick={() => handleCopyInspiration(activeReflection)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                title="Salin Renungan Ini"
              >
                {copySuccess === activeReflection.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setJournalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <PenTool className="w-3.5 h-3.5 text-amber-300" />
                <span>Tulis Jurnal</span>
              </button>
            </div>
          </div>

          {/* Large Arabic Calligraphy & Translation */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/40 dark:from-slate-800/40 dark:to-emerald-950/20 border border-slate-200/80 dark:border-slate-800 text-center space-y-4">
            <p dir="rtl" className="font-quran text-2xl sm:text-3xl lg:text-4xl text-slate-900 dark:text-white leading-loose select-text">
              {activeReflection.ayahArabic}
            </p>

            <div className="max-w-2xl mx-auto space-y-1">
              <p className="text-xs sm:text-sm font-medium text-emerald-800 dark:text-emerald-400 italic">
                "{activeReflection.transliteration}"
              </p>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                "{activeReflection.translation}"
              </p>
            </div>
          </div>

          {/* 4 Contemplation Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Divine Intimate Message */}
            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-800/40 space-y-2">
              <div className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Apa yang Sedang Allah SWT Bisikkan Kepadamu?</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeReflection.divineMessage}
              </p>
            </div>

            {/* 2. Daily Life Context */}
            <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/25 border border-sky-200/80 dark:border-sky-800/40 space-y-2">
              <div className="text-xs font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>Melihat Keseharian Melalui Ayat Ini</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeReflection.dailyLifeContext}
              </p>
            </div>

            {/* 3. Soul Reflection Prompt */}
            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-200/80 dark:border-emerald-800/40 space-y-2">
              <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Rasakan Sebuah Reflection (Muhasabah Hati)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "{activeReflection.soulReflectionPrompt}"
              </p>
            </div>

            {/* 4. Actionable 24-Hour Step */}
            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/25 border border-indigo-200/80 dark:border-indigo-800/40 space-y-2">
              <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Langkah Nyata 24 Jam ke Depan</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeReflection.actionableStep}
              </p>
            </div>
          </div>

          {/* Heartfelt Prayer Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
              🤲
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Doa Reflektif dari Kedalaman Hati
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                "{activeReflection.heartfeltPrayer}"
              </p>
            </div>
          </div>

          {/* Quick Nav to Memorization */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>Tersentuh oleh ayat ini? Kunci di memori jangka panjang:</span>
            <button
              onClick={() => {
                setSelectedSurah(activeReflection.surahNumber);
                setSelectedAyah(activeReflection.ayahNumber);
                setActiveTab('tracker');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Hafalkan di Pelacak Hafalan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. INTERACTIVE SECTION: "Curhat ke Al-Quran & AI Tadabbur Generator" */}
      <div id="tanya-hikmah" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Cerdas Berdaya · Bertenaga Gemini 3.8 Flash</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Curhat ke Al-Quran: Temukan Pesan Allah atas Apa yang Sedang Kamu Rasakan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tuliskan situasi hidup, kegalauan, atau pilih ayat spesifik. AI akan menghubungkannya dengan hikmah tadabbur mendalam.
            </p>
          </div>
        </div>

        {/* Preset Situation Pills */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Contoh Kegelisahan / Situasi Orang Dewasa:
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "Lelah mental (burnout) menghadapi tekanan kerja dan bosan dengan rutinitas",
              "Sering overthinking tentang masa depan finansial dan keluarga",
              "Merasa bersalah atas dosa masa lalu dan rindu kembali ke jalan Allah",
              "Hubungan rumah tangga sedang diuji oleh ego dan kurang komunikasi",
              "Merasa sepi dan sendirian berjuang tanpa ada yang memahami letihku"
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setUserLifeQuery(preset)}
                className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer text-left"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-6 space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Ceritakan Apa yang Sedang Berkecamuk di Hatimu / Situasi Hidup:
            </label>
            <input
              type="text"
              value={userLifeQuery}
              onChange={(e) => setUserLifeQuery(e.target.value)}
              placeholder="Contoh: 'Saya sedang lelah di kantor, merasa usaha tidak dihargai...'"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Surah & Ayat Rujukan:
            </label>
            <select
              value={aiSelectedSurah}
              onChange={(e) => {
                setAiSelectedSurah(Number(e.target.value));
                setAiSelectedAyah(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {SURAH_LIST.slice(0, 30).map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.nameLatin} ({s.numberOfAyahs} ayat)
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <button
              onClick={handleGenerateAiTadabbur}
              disabled={isGeneratingTadabbur}
              className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer h-[38px]"
            >
              {isGeneratingTadabbur ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Merajut Hikmah Ilahi...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Generate Tadabbur Hidup</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 6. PERSONAL REFLECTION JOURNAL ("Jurnal Refleksi Pribadi") */}
      <div id="jurnal-refleksi" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Jurnal Hati Pribadi · Terenkripsi Lokal & Bebas Iklan</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Catatan Tadabbur & Komitmen Hidupmu
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simpan bisikan batin saat berdialog dengan firman-Nya. Kunci refleksi agar menjadi amal shalih.
            </p>
          </div>

          <button
            onClick={() => setJournalOpen(!journalOpen)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
          >
            <PenTool className="w-3.5 h-3.5 text-amber-300" />
            <span>{journalOpen ? 'Tutup Formulir' : '+ Tulis Refleksi Baru'}</span>
          </button>
        </div>

        {/* Add Reflection Modal / Drawer Box */}
        {journalOpen && (
          <form onSubmit={handleSubmitJournal} className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-emerald-600" />
              <span>Refleksi untuk: {activeReflection.surahName} Ayat {activeReflection.ayahNumber}</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Kondisi Hidup atau Ujian yang Sedang Dihadapi:
              </label>
              <input
                type="text"
                value={journalSituation}
                onChange={(e) => setJournalSituation(e.target.value)}
                placeholder="Contoh: Merasa lelah bekerja dan kurang sabar dengan anak..."
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Pesan Allah yang Paling Menyentuh Hatimu (Refleksi):
              </label>
              <textarea
                rows={3}
                required
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                placeholder="Apa yang kamu sadari setelah membaca ayat ini? Apa yang ingin kamu ubah dalam dirimu?"
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Komitmen Tindakan Nyata Hari Ini:
                </label>
                <input
                  type="text"
                  value={journalCommitment}
                  onChange={(e) => setJournalCommitment(e.target.value)}
                  placeholder="Contoh: Meminta maaf ke pasangan, atau shalat tepat waktu..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Kondisi Jiwa Setelah Refleksi:
                </label>
                <div className="flex items-center gap-1.5 pt-1">
                  {(['tenang', 'tersentuh', 'bersemangat', 'insyaf', 'bersyukur'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setJournalMood(m)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize cursor-pointer transition-colors ${
                        journalMood === m
                          ? 'bg-emerald-600 text-white font-semibold'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setJournalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Simpan ke Jurnal Hati (+40 XP)</span>
              </button>
            </div>
          </form>
        )}

        {/* Saved Reflections Stream */}
        {savedReflections.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
            <PenTool className="w-6 h-6 text-slate-400 mx-auto" />
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Belum Ada Jurnal Refleksi Tersimpan
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Setiap kali sebuah ayat menggetarkan hatimu, tuangkan ke dalam jurnal ini agar menjadi saksi perjalanan hijrah batinmu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedReflections.map((ref) => (
              <div
                key={ref.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3 relative group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      {ref.ayahRef}
                    </span>
                    {ref.moodTag && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                        {ref.moodTag}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFavoriteReflection(ref.id)}
                      className="p-1 text-slate-400 hover:text-amber-500 cursor-pointer"
                      title="Tandai Favorit"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${ref.isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                    <button
                      onClick={() => deleteUserReflection(ref.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                      title="Hapus Catatan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-medium text-slate-500">
                    Situasi: {ref.userLifeSituation}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    "{ref.reflectionNote}"
                  </p>
                </div>

                {ref.actionCommitment && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-start gap-1.5 text-xs text-emerald-800 dark:text-emerald-300">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium">Komitmen: {ref.actionCommitment}</span>
                  </div>
                )}

                <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                  <span>Dicatat pada {ref.createdAt}</span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Privat</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
