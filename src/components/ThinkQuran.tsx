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
  RefreshCw,
  Search,
  Filter,
  Edit3,
  X,
  FileText,
  Sparkle
} from 'lucide-react';

export const ThinkQuran: React.FC = () => {
  const { 
    savedReflections, 
    saveUserReflection, 
    updateUserReflection,
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

  // Note-Taking / Journaling State
  const [noteEditorOpen, setNoteEditorOpen] = useState<boolean>(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteSurahNumber, setNoteSurahNumber] = useState<number>(67);
  const [noteAyahNumber, setNoteAyahNumber] = useState<number>(1);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteText, setNoteText] = useState<string>('');
  const [noteCommitment, setNoteCommitment] = useState<string>('');
  const [noteMood, setNoteMood] = useState<'tenang' | 'tersentuh' | 'bersemangat' | 'insyaf' | 'bersyukur'>('tenang');
  
  // Filter & Search state for notes
  const [noteSearchQuery, setNoteSearchQuery] = useState<string>('');
  const [noteFilterTab, setNoteFilterTab] = useState<'all' | 'current_ayah' | 'favorites'>('all');
  const [noteFilterMood, setNoteFilterMood] = useState<string>('all');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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

  // Derived active verse data for note preview
  const selectedNoteSurahMeta = SURAH_LIST.find(s => s.number === noteSurahNumber) || SURAH_LIST[0];
  const selectedNoteSurahAyahs = getAyahsForSurah(noteSurahNumber);
  const selectedNoteAyah = selectedNoteSurahAyahs.find(a => a.numberInSurah === noteAyahNumber) || selectedNoteSurahAyahs[0];

  // Notes specifically written for the currently displayed active verse
  const notesForActiveAyah = savedReflections.filter(
    r => r.surahNumber === activeReflection.surahNumber && r.ayahNumber === activeReflection.ayahNumber
  );

  // Filtered saved notes list
  const filteredSavedNotes = savedReflections.filter((note) => {
    if (noteFilterTab === 'current_ayah') {
      if (note.surahNumber !== activeReflection.surahNumber || note.ayahNumber !== activeReflection.ayahNumber) {
        return false;
      }
    } else if (noteFilterTab === 'favorites') {
      if (!note.isFavorite) return false;
    }

    if (noteFilterMood !== 'all' && note.moodTag !== noteFilterMood) {
      return false;
    }

    if (noteSearchQuery.trim()) {
      const q = noteSearchQuery.toLowerCase();
      const matchRef = note.ayahRef.toLowerCase().includes(q);
      const matchNote = note.reflectionNote.toLowerCase().includes(q);
      const matchSit = (note.userLifeSituation || '').toLowerCase().includes(q);
      const matchCommit = (note.actionCommitment || '').toLowerCase().includes(q);
      if (!matchRef && !matchNote && !matchSit && !matchCommit) {
        return false;
      }
    }

    return true;
  });

  // Open note editor pre-filled for the current active verse
  const handleOpenNoteForActiveVerse = () => {
    setEditingNoteId(null);
    setNoteSurahNumber(activeReflection.surahNumber);
    setNoteAyahNumber(activeReflection.ayahNumber);
    setNoteTitle('');
    setNoteText('');
    setNoteCommitment('');
    setNoteMood('tenang');
    setNoteEditorOpen(true);
    
    setTimeout(() => {
      const el = document.getElementById('catatan-tadabbur-ayat');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // Open note editor to edit an existing note
  const handleEditNote = (note: UserPersonalReflection) => {
    setEditingNoteId(note.id);
    setNoteSurahNumber(note.surahNumber);
    setNoteAyahNumber(note.ayahNumber);
    setNoteTitle(note.userLifeSituation || '');
    setNoteText(note.reflectionNote);
    setNoteCommitment(note.actionCommitment || '');
    setNoteMood(note.moodTag || 'tenang');
    setNoteEditorOpen(true);

    setTimeout(() => {
      const el = document.getElementById('catatan-tadabbur-ayat');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // Cancel / reset note form
  const handleCancelNote = () => {
    setEditingNoteId(null);
    setNoteTitle('');
    setNoteText('');
    setNoteCommitment('');
    setNoteEditorOpen(false);
  };

  // Save or update note
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    const surahMeta = SURAH_LIST.find(s => s.number === noteSurahNumber);
    const surahName = surahMeta ? surahMeta.nameLatin : `Surah ${noteSurahNumber}`;
    const ayahRef = `${surahName}: ${noteAyahNumber}`;

    if (editingNoteId) {
      updateUserReflection(editingNoteId, {
        ayahRef,
        surahNumber: noteSurahNumber,
        ayahNumber: noteAyahNumber,
        userLifeSituation: noteTitle || 'Refleksi mendalam ba\'da membaca ayat suci.',
        reflectionNote: noteText,
        actionCommitment: noteCommitment,
        moodTag: noteMood
      });
    } else {
      saveUserReflection({
        ayahRef,
        surahNumber: noteSurahNumber,
        ayahNumber: noteAyahNumber,
        userLifeSituation: noteTitle || 'Refleksi mendalam ba\'da membaca ayat suci.',
        reflectionNote: noteText,
        actionCommitment: noteCommitment,
        moodTag: noteMood,
        isFavorite: false
      });
    }

    handleCancelNote();
  };

  // Copy personal note to clipboard
  const handleCopyNote = (note: UserPersonalReflection) => {
    const text = `📖 *Catatan Tadabbur Ayat (${note.ayahRef})*\n\n"${note.reflectionNote}"\n\n📌 Situasi: ${note.userLifeSituation || '-'}\n${note.actionCommitment ? `🎯 Komitmen: ${note.actionCommitment}\n` : ''}💭 Suasana Jiwa: ${note.moodTag || 'Tenang'}\n📅 Dicatat: ${note.createdAt}\n\n— *Think Quran · Hafidz Quran Islamicity*`;
    navigator.clipboard.writeText(text);
    setCopySuccess(note.id);
    setTimeout(() => setCopySuccess(null), 3000);
  };

  // Jump to verse in Pelacak Hafalan
  const handleJumpToAyah = (surahNumber: number, ayahNumber: number) => {
    setSelectedSurah(surahNumber);
    setSelectedAyah(ayahNumber);
    setActiveTab('tracker');
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
              href="#catatan-tadabbur-ayat"
              className="px-4 py-2.5 bg-transparent hover:bg-white/10 text-slate-300 text-xs sm:text-sm font-medium rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <PenTool className="w-4 h-4 text-amber-400" />
              <span>Catatan Tadabbur Ayat ({savedReflections.length})</span>
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
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Surah {activeReflection.surahName} (Ayat {activeReflection.ayahNumber})
                </h2>
                {notesForActiveAyah.length > 0 && (
                  <button
                    onClick={() => {
                      setNoteFilterTab('current_ayah');
                      const el = document.getElementById('catatan-tadabbur-ayat');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-900/60 transition-colors"
                    title="Lihat catatan untuk ayat ini"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>{notesForActiveAyah.length} Catatan Pribadi</span>
                  </button>
                )}
              </div>
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
                onClick={handleOpenNoteForActiveVerse}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Tulis catatan tadabbur atau refleksi pribadi untuk ayat ini"
              >
                <PenTool className="w-3.5 h-3.5 text-amber-300" />
                <span>Catat Tadabbur</span>
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

          {/* Quick Nav to Memorization & Note Taking */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>Tersentuh oleh ayat ini? Abadikan refleksi atau kunci di hafalan:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenNoteForActiveVerse}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <PenTool className="w-3.5 h-3.5 text-amber-300" />
                <span>Catat Tadabbur Ayat Ini</span>
              </button>
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

      {/* 6. VERSE NOTE-TAKING & TADABBUR SYSTEM ("Catatan Tadabbur Ayat & Refleksi Pribadi") */}
      <div id="catatan-tadabbur-ayat" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-6 shadow-sm">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Buku Catatan Tadabbur · Refleksi Ayat & Komitmen Pribadi</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              Catatan Tadabbur & Refleksi Ayat
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Abadikan hikmah firman Allah yang menyapa jiwamu untuk ayat-ayat spesifik. Tersimpan aman secara lokal di perangkatmu.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (noteEditorOpen) {
                  handleCancelNote();
                } else {
                  handleOpenNoteForActiveVerse();
                }
              }}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <PenTool className="w-3.5 h-3.5 text-amber-300" />
              <span>{noteEditorOpen ? 'Tutup Editor' : '+ Catat Tadabbur Baru'}</span>
            </button>
          </div>
        </div>

        {/* Note-Taking Form (Editor) */}
        {noteEditorOpen && (
          <form onSubmit={handleSaveNote} className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-emerald-500/40 dark:border-emerald-500/30 space-y-4 shadow-sm">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  {editingNoteId ? <Edit3 className="w-3.5 h-3.5" /> : <PenTool className="w-3.5 h-3.5" />}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {editingNoteId ? 'Edit Catatan Tadabbur' : 'Tulis Catatan Tadabbur Ayat Baru'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCancelNote}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title="Tutup Form"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target Verse Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="sm:col-span-5 space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pilih Surat:</span>
                </label>
                <select
                  value={noteSurahNumber}
                  onChange={(e) => {
                    const newSurah = Number(e.target.value);
                    setNoteSurahNumber(newSurah);
                    setNoteAyahNumber(1);
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  {SURAH_LIST.map((s) => (
                    <option key={s.number} value={s.number}>
                      {s.number}. {s.nameLatin} ({s.numberOfAyahs} ayat)
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Nomor Ayat:
                </label>
                <select
                  value={noteAyahNumber}
                  onChange={(e) => setNoteAyahNumber(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  {Array.from({ length: selectedNoteSurahMeta?.numberOfAyahs || 1 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      Ayat {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4 flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    setNoteSurahNumber(activeReflection.surahNumber);
                    setNoteAyahNumber(activeReflection.ayahNumber);
                  }}
                  className="w-full px-2.5 py-1.5 text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer h-[34px]"
                  title="Gunakan ayat yang sedang dibuka di Think Quran saat ini"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pakai Ayat Aktif ({activeReflection.surahName}:{activeReflection.ayahNumber})</span>
                </button>
              </div>
            </div>

            {/* Live Verse Preview Card */}
            {selectedNoteAyah && (
              <div className="p-3.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                  <span>Pratinjau Ayat: Q.S. {selectedNoteSurahMeta?.nameLatin} [{selectedNoteSurahMeta?.number}]: {selectedNoteAyah.numberInSurah}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-normal">{selectedNoteSurahMeta?.indonesianNameTranslation}</span>
                </div>
                <p dir="rtl" className="font-quran text-lg sm:text-xl text-slate-900 dark:text-white leading-relaxed text-right select-text">
                  {selectedNoteAyah.textArabic}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{selectedNoteAyah.translationId}"
                </p>
              </div>
            )}

            {/* Life Context / Subject */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Situasi Hidup / Subjek Refleksi (Opsional):
              </label>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Contoh: Menghadapi kekhawatiran rezeki, renungan ba'da shalat subuh, dll..."
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Personal Tadabbur / Reflection Text */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <span>Catatan Refleksi & Tadabbur Pribadi:</span>
                  <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400">
                  {noteText.trim().split(/\s+/).filter(Boolean).length} kata · {noteText.length} karakter
                </span>
              </div>
              <textarea
                rows={4}
                required
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Tuliskan hikmah yang kamu peroleh dari ayat ini. Apa yang sedang Allah sampaikan ke lubuk hatimu? Mengapa ayat ini terasa relevan dengan perjalanan hidupmu?"
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed font-normal"
              />
            </div>

            {/* Quick Inspiration Prompts */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Inspirasi Pertanyaan Pemantik (klik untuk menyisipkan ke catatan):</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Pesan apa yang paling menyapa situasi hidup saya saat membaca ayat ini?",
                  "Nikmat dan karunia apa yang diingatkan ayat ini yang sering saya lupakan?",
                  "Bagaimana saya menerapkan keikhlasan dan kesabaran setelah merenungkan ayat ini?",
                  "Satu kebiasaan baik apa yang ingin saya mulai setelah merenungi ayat ini?"
                ].map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => {
                      setNoteText(prev => prev ? `${prev}\n\n• ${prompt} ` : `• ${prompt} `);
                    }}
                    className="px-2 py-1 text-[11px] bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md transition-colors cursor-pointer text-left"
                  >
                    + {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Commitment & Mood Tag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Komitmen Tindakan / Amalan Nyata (Opsional):
                </label>
                <input
                  type="text"
                  value={noteCommitment}
                  onChange={(e) => setNoteCommitment(e.target.value)}
                  placeholder="Contoh: Bersedekah besok pagi, lebih sabar saat berbicara..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Suasana Hati Setelah Merenung:
                </label>
                <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                  {([
                    { tag: 'tenang', label: 'Tenang 🌿' },
                    { tag: 'bersyukur', label: 'Bersyukur ✨' },
                    { tag: 'tersentuh', label: 'Tersentuh 💧' },
                    { tag: 'insyaf', label: 'Insyaf 🤲' },
                    { tag: 'bersemangat', label: 'Semangat 🔥' }
                  ] as const).map(({ tag, label }) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setNoteMood(tag)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium cursor-pointer transition-colors ${
                        noteMood === tag
                          ? 'bg-emerald-600 text-white font-semibold shadow-2xs'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Footer Buttons */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={handleCancelNote}
                className="px-3.5 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{editingNoteId ? 'Perbarui Catatan Tadabbur' : 'Simpan Catatan Tadabbur (+40 XP)'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Filter, Search & View Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setNoteFilterTab('all')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                noteFilterTab === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Semua Catatan ({savedReflections.length})
            </button>
            <button
              onClick={() => setNoteFilterTab('current_ayah')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                noteFilterTab === 'current_ayah'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Ayat Ini ({notesForActiveAyah.length})</span>
            </button>
            <button
              onClick={() => setNoteFilterTab('favorites')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                noteFilterTab === 'favorites'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bookmark className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>Favorit ({savedReflections.filter(r => r.isFavorite).length})</span>
            </button>
          </div>

          {/* Search & Mood Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={noteSearchQuery}
                onChange={(e) => setNoteSearchQuery(e.target.value)}
                placeholder="Cari ayat atau kata kunci..."
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {noteSearchQuery && (
                <button
                  onClick={() => setNoteSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={noteFilterMood}
              onChange={(e) => setNoteFilterMood(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Suasana</option>
              <option value="tenang">Tenang 🌿</option>
              <option value="bersyukur">Bersyukur ✨</option>
              <option value="tersentuh">Tersentuh 💧</option>
              <option value="insyaf">Insyaf 🤲</option>
              <option value="bersemangat">Bersemangat 🔥</option>
            </select>
          </div>
        </div>

        {/* Saved Notes Stream */}
        {filteredSavedNotes.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto text-emerald-600">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {noteSearchQuery || noteFilterTab !== 'all' || noteFilterMood !== 'all'
                  ? 'Tidak Ada Catatan yang Sesuai Filter'
                  : 'Belum Ada Catatan Tadabbur Tersimpan'}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {noteSearchQuery || noteFilterTab !== 'all' || noteFilterMood !== 'all'
                  ? 'Coba ubah kata kunci pencarian atau bersihkan filter suasana hati.'
                  : 'Setiap kali sebuah ayat menggetarkan hatimu, tuangkan ke dalam catatan ini agar hikmahnya selalu membimbing langkahmu.'}
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-1">
              {noteSearchQuery || noteFilterTab !== 'all' || noteFilterMood !== 'all' ? (
                <button
                  onClick={() => {
                    setNoteSearchQuery('');
                    setNoteFilterTab('all');
                    setNoteFilterMood('all');
                  }}
                  className="px-3.5 py-1.5 text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Reset Filter
                </button>
              ) : (
                <button
                  onClick={handleOpenNoteForActiveVerse}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5 text-amber-300" />
                  <span>Catat Refleksi Ayat Ini ({activeReflection.surahName}:{activeReflection.ayahNumber})</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSavedNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-xs transition-shadow space-y-3 relative group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                        {note.ayahRef}
                      </span>
                      {note.moodTag && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize font-medium">
                          {note.moodTag === 'tenang' && '🌿 '}
                          {note.moodTag === 'bersyukur' && '✨ '}
                          {note.moodTag === 'tersentuh' && '💧 '}
                          {note.moodTag === 'insyaf' && '🤲 '}
                          {note.moodTag === 'bersemangat' && '🔥 '}
                          {note.moodTag}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleFavoriteReflection(note.id)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title={note.isFavorite ? 'Hapus dari Favorit' : 'Tandai Favorit'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${note.isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
                      </button>

                      <button
                        onClick={() => handleEditNote(note)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Edit Catatan"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleCopyNote(note)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Salin Catatan"
                      >
                        {copySuccess === note.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => setConfirmDeleteId(note.id)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                        title="Hapus Catatan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Delete Confirmation Overlay */}
                  {confirmDeleteId === note.id && (
                    <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between text-xs">
                      <span className="text-rose-700 dark:text-rose-300 font-medium">Hapus catatan ini?</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-600 text-[11px] cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => {
                            deleteUserReflection(note.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-semibold cursor-pointer"
                        >
                          Ya, Hapus
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Life Situation context */}
                  {note.userLifeSituation && (
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Compass className="w-3 h-3 text-sky-500 shrink-0" />
                      <span className="line-clamp-1">{note.userLifeSituation}</span>
                    </div>
                  )}

                  {/* Reflection Note Content */}
                  <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal whitespace-pre-line bg-slate-50/70 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    "{note.reflectionNote}"
                  </div>

                  {/* Action Commitment */}
                  {note.actionCommitment && (
                    <div className="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30 flex items-start gap-1.5 text-xs text-emerald-800 dark:text-emerald-300">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Komitmen Tindakan: </span>
                        <span>{note.actionCommitment}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 mt-2">
                  <div className="flex items-center gap-2">
                    <span>{note.createdAt}</span>
                    <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Privat</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleJumpToAyah(note.surahNumber, note.ayahNumber)}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors flex items-center gap-1 cursor-pointer"
                    title="Buka ayat ini di Pelacak Hafalan"
                  >
                    <span>Buka Ayat</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
