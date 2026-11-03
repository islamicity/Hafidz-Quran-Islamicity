/**
 * Voice-to-Text Memorization Journal Component
 * Allows users to record oral reflections on daily Quran memorization progress using the browser Microphone API & Speech Recognition
 */
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SURAH_LIST } from '../data/quranData';
import { MemorizationVoiceJournal, MemorizationMood } from '../types';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Check, 
  Copy, 
  Trash2, 
  Edit3, 
  X, 
  Calendar, 
  Target, 
  Flame, 
  Trophy, 
  BookOpen, 
  Volume2, 
  AlertCircle, 
  RefreshCw, 
  Share2, 
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

interface VoiceMemorizationJournalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isModal?: boolean;
}

export const VoiceMemorizationJournal: React.FC<VoiceMemorizationJournalProps> = ({
  isOpen = true,
  onClose,
  isModal = false
}) => {
  const {
    dailyTarget,
    selectedSurah,
    selectedAyah,
    memorizationJournals,
    saveMemorizationJournal,
    updateMemorizationJournal,
    deleteMemorizationJournal
  } = useApp();

  // Active Surah Meta
  const activeSurahMeta = SURAH_LIST.find(s => s.number === selectedSurah) || SURAH_LIST[0];

  // Speech Recognition States
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechLang, setSpeechLang] = useState<'id-ID' | 'ar-SA' | 'en-US'>('id-ID');
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(true);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [transcriptText, setTranscriptText] = useState<string>('');
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Journal Metadata States
  const [selectedMood, setSelectedMood] = useState<MemorizationMood>('lancar');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Target Harian', activeSurahMeta.nameLatin]);
  const [editingJournalId, setEditingJournalId] = useState<string | null>(null);
  const [copySuccessId, setCopySuccessId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [moodFilter, setMoodFilter] = useState<string>('all');
  const [viewHistoryOpen, setViewHistoryOpen] = useState<boolean>(false);

  // Audio Analyser & Speech Recognition References
  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Check Web Speech API availability on mount
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
    }
  }, []);

  // Update default tag when active surah changes
  useEffect(() => {
    if (!selectedTags.includes(activeSurahMeta.nameLatin)) {
      setSelectedTags(prev => [activeSurahMeta.nameLatin, ...prev.filter(t => !SURAH_LIST.some(s => s.nameLatin === t))]);
    }
  }, [selectedSurah, activeSurahMeta.nameLatin]);

  // Clean up audio & recognition resources when unmounting
  useEffect(() => {
    return () => {
      stopAllAudioCapture();
    };
  }, []);

  // Timer counter for active recording
  useEffect(() => {
    if (isListening) {
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isListening]);

  // Stop media stream, audio context, and speech recognition
  const stopAllAudioCapture = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {
        // ignore
      }
      audioContextRef.current = null;
    }

    setIsListening(false);
    setAudioLevel(0);
  };

  // Start microphone capture and speech recognition
  const handleStartListening = async () => {
    setMicPermissionError(null);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      setMicPermissionError('Web Speech API tidak didukung di browser ini. Anda dapat mengetik secara manual.');
      return;
    }

    try {
      // 1. Request microphone access for real-time visualizer
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStreamRef.current = stream;

          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const audioCtx = new AudioContextClass();
            audioContextRef.current = audioCtx;
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            analyserRef.current = analyser;

            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const updateVolume = () => {
              if (!analyserRef.current) return;
              analyserRef.current.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
              animationFrameRef.current = requestAnimationFrame(updateVolume);
            };
            updateVolume();
          }
        } catch (mediaErr: any) {
          console.warn('Microphone stream access warning:', mediaErr);
          if (mediaErr.name === 'NotAllowedError' || mediaErr.name === 'PermissionDeniedError') {
            setMicPermissionError('Izin mikrofon ditolak oleh browser. Mohon izinkan akses mikrofon di pengaturan browser.');
            return;
          }
        }
      }

      // 2. Initialize SpeechRecognition
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = speechLang;

      recognition.onstart = () => {
        setIsListening(true);
        setMicPermissionError(null);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTrans = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTrans += trans + ' ';
          } else {
            currentInterim += trans;
          }
        }

        if (finalTrans) {
          setTranscriptText(prev => {
            const separator = prev && !prev.endsWith(' ') ? ' ' : '';
            return prev + separator + finalTrans.trim();
          });
        }
        setInterimTranscript(currentInterim);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setMicPermissionError('Akses mikrofon tidak diizinkan. Silakan beri izin mikrofon pada address bar browser Anda.');
          stopAllAudioCapture();
        } else if (event.error === 'network') {
          setMicPermissionError('Terjadi kendala jaringan pada layanan pengenalan suara browser.');
        }
      };

      recognition.onend = () => {
        // If still supposed to be listening (some browsers stop automatically on brief silence), we can let user restart
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
      recognition.start();

    } catch (err: any) {
      console.warn('Speech recognition launch failed:', err);
      setMicPermissionError('Gagal mengaktifkan mikrofon: ' + (err.message || 'Izin ditolak atau tidak didukung'));
      stopAllAudioCapture();
    }
  };

  // Toggle listening
  const handleToggleListening = () => {
    if (isListening) {
      stopAllAudioCapture();
    } else {
      handleStartListening();
    }
  };

  // Preset reflection prompts
  const PROMPT_SUGGESTIONS = [
    "Alhamdulillah hari ini hafalan target 5 ayat berjalan lancar...",
    "Tantangan hari ini ada pada pelafalan huruf 'Ain dan Mad Wajib...",
    "Saya bersyukur bisa istiqomah muraja'ah sebelum subuh...",
    "Target besok adalah mengulang kembali ayat 1-10 agar semakin mutqin..."
  ];

  const handleApplyPrompt = (prompt: string) => {
    setTranscriptText(prev => {
      const separator = prev ? '\n\n' : '';
      return prev + separator + prompt;
    });
  };

  // Target Progress Snapshot Label
  const targetAyahs = dailyTarget.targetAyahCount || 5;
  const completedAyahsCount = (dailyTarget.completedAyahKeys || []).length;
  const progressPct = Math.min(100, Math.round((completedAyahsCount / targetAyahs) * 100));
  const currentStreak = dailyTarget.goalStreak || 0;
  const progressSnapshotSummary = `Target: ${targetAyahs} Ayat (Selesai ${completedAyahsCount} Ayat / ${progressPct}%) · Streak: ${currentStreak} Hari`;

  // Save or Update Journal
  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcriptText.trim()) return;

    if (editingJournalId) {
      updateMemorizationJournal(editingJournalId, {
        transcript: transcriptText.trim(),
        mood: selectedMood,
        tags: selectedTags,
        surahNumber: selectedSurah,
        surahName: activeSurahMeta.nameLatin,
        ayahNumber: selectedAyah,
        targetProgressSummary: progressSnapshotSummary,
        streakDays: currentStreak
      });
      setEditingJournalId(null);
    } else {
      saveMemorizationJournal({
        date: new Date().toISOString().split('T')[0],
        surahNumber: selectedSurah,
        surahName: activeSurahMeta.nameLatin,
        ayahNumber: selectedAyah,
        targetProgressSummary: progressSnapshotSummary,
        streakDays: currentStreak,
        transcript: transcriptText.trim(),
        mood: selectedMood,
        tags: selectedTags
      });
    }

    // Reset editor
    setTranscriptText('');
    setInterimTranscript('');
    stopAllAudioCapture();
    if (isModal && onClose) {
      onClose();
    }
  };

  // Edit existing journal
  const handleStartEdit = (journal: MemorizationVoiceJournal) => {
    setEditingJournalId(journal.id);
    setTranscriptText(journal.transcript);
    setSelectedMood(journal.mood);
    setSelectedTags(journal.tags || []);
    setViewHistoryOpen(false);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingJournalId(null);
    setTranscriptText('');
    setInterimTranscript('');
    stopAllAudioCapture();
  };

  // Copy journal to clipboard
  const handleCopyJournal = (journal: MemorizationVoiceJournal) => {
    const text = `🎙️ *Jurnal Refleksi Hafalan Al-Quran*\n📅 ${journal.date} · ${journal.surahName}\n🎯 ${journal.targetProgressSummary}\n✨ Suasana: ${journal.mood.toUpperCase()}\n\n"${journal.transcript}"\n\n— *Hafidz Quran Islamicity*`;
    navigator.clipboard.writeText(text);
    setCopySuccessId(journal.id);
    setTimeout(() => setCopySuccessId(null), 3000);
  };

  // Toggle tag
  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  // Filtered journals for history display
  const filteredJournals = memorizationJournals.filter(j => {
    if (moodFilter !== 'all' && j.mood !== moodFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchSurah = j.surahName.toLowerCase().includes(q);
      const matchText = j.transcript.toLowerCase().includes(q);
      const matchDate = j.date.includes(q);
      const matchTag = (j.tags || []).some(t => t.toLowerCase().includes(q));
      if (!matchSurah && !matchText && !matchDate && !matchTag) return false;
    }
    return true;
  });

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Inner Content
  const content = (
    <div className="space-y-5">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Voice-to-Text Journaling · Mikrofon AI & Lisan Santri</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
            <span>{editingJournalId ? 'Edit Catatan Refleksi Suara' : 'Jurnal Suara Progres Hafalan'}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              +35 XP
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Gunakan mikrofon untuk merekam refleksi lisan atas kelancaran hafalan hari ini, tantangan tajwid, atau doa dan rasa syukur.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Language selector for speech */}
          <div className="flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <span className="text-[11px] text-slate-400 px-1 font-medium">Bahasa:</span>
            <button
              type="button"
              onClick={() => setSpeechLang('id-ID')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                speechLang === 'id-ID' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-2xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              ID (Indonesia)
            </button>
            <button
              type="button"
              onClick={() => setSpeechLang('ar-SA')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                speechLang === 'ar-SA' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-2xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              AR (عربي)
            </button>
          </div>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mic Permission Warning if any */}
      {micPermissionError && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Catatan Mikrofon: </span>
            <span>{micPermissionError}</span>
          </div>
        </div>
      )}

      {/* Target & Progress Context Badge Bar */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-emerald-600" />
            <span>Konteks Hari Ini:</span>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium">
            Surah {activeSurahMeta.nameLatin}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200/60 dark:border-emerald-800/40">
            Target: {completedAyahsCount}/{targetAyahs} Ayat ({progressPct}%)
          </span>
          <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-medium border border-amber-200/60 dark:border-amber-800/40 flex items-center gap-1">
            {currentStreak > 7 ? <Trophy className="w-3 h-3 text-amber-500 fill-amber-400" /> : <Flame className="w-3 h-3 text-orange-500 fill-orange-400" />}
            <span>Streak {currentStreak} Hari</span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Big Interactive Microphone Dictation Area */}
      <div className="relative p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white shadow-md border border-slate-700/80 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          {/* Recording Timer & Status indicator */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              isListening 
                ? 'bg-rose-500/20 border border-rose-400/40 text-rose-300 animate-pulse'
                : 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
              <span>{isListening ? `Sedang Merekam Suara (${formatSeconds(recordingSeconds)})` : 'Mikrofon Siap Digunakan'}</span>
            </span>
          </div>

          {/* Sound Wave Visualizer Equalizer (Active when listening) */}
          <div className="h-10 flex items-center justify-center gap-1.5 px-4 w-full max-w-xs">
            {isListening ? (
              Array.from({ length: 16 }).map((_, i) => {
                const dynamicHeight = Math.max(6, Math.min(36, (audioLevel * (1 + Math.sin(i * 0.8))) / 3));
                return (
                  <span
                    key={i}
                    className="w-1.5 rounded-full bg-emerald-400 transition-all duration-75"
                    style={{ height: `${dynamicHeight}px` }}
                  />
                );
              })
            ) : (
              <span className="text-xs text-slate-400 font-light">
                Klik tombol mikrofon di bawah dan ceritakan progres hafalanmu
              </span>
            )}
          </div>

          {/* Large Pulsing Microphone Button */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleToggleListening}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/40 ring-4 ring-rose-400/40 animate-pulse'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30 ring-4 ring-emerald-400/20'
              }`}
              title={isListening ? 'Hentikan Perekaman Suara' : 'Mulai Rekam Suara (Dikte)'}
            >
              {isListening ? (
                <MicOff className="w-8 h-8 sm:w-9 sm:h-9" />
              ) : (
                <Mic className="w-8 h-8 sm:w-9 sm:h-9" />
              )}
            </button>
          </div>

          <div className="text-xs text-slate-300 font-medium">
            {isListening ? (
              <span className="text-rose-300 font-bold">Sedang mendengarkan... Bicara dengan santai dan jelas</span>
            ) : (
              <span>Tekan untuk mulai merekam suara atau dikte langsung ke teks</span>
            )}
          </div>
        </div>
      </div>

      {/* Live Interim Transcript Stream */}
      {isListening && interimTranscript && (
        <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 text-xs text-emerald-900 dark:text-emerald-200 animate-pulse flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">Mendeteksi Suara: </span>
            <span className="italic">"{interimTranscript}..."</span>
          </div>
        </div>
      )}

      {/* Form: Textarea for Review & Manual Edit */}
      <form onSubmit={handleSaveJournal} className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Transkrip Suara / Catatan Refleksi:</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {transcriptText.trim().split(/\s+/).filter(Boolean).length} kata · {transcriptText.length} karakter
            </span>
          </div>

          <textarea
            rows={4}
            required
            value={transcriptText}
            onChange={(e) => setTranscriptText(e.target.value)}
            placeholder="Transkrip suara Anda akan muncul di sini secara otomatis saat berbicara. Anda juga dapat mengetik atau mengedit teks ini kapan saja..."
            className="w-full p-3.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed font-normal shadow-2xs"
          />
        </div>

        {/* Quick Inspiration Prompt Chips */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Inspirasi Refleksi Hafalan (klik untuk menambahkan ke catatan):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PROMPT_SUGGESTIONS.map((prompt, pIdx) => (
              <button
                key={pIdx}
                type="button"
                onClick={() => handleApplyPrompt(prompt)}
                className="px-2.5 py-1 text-[11px] bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer text-left"
              >
                + {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Mood & Tag Evaluation Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Evaluasi Rasa Hati / Mood */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Evaluasi Kelancaran & Rasa Hati:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {([
                { id: 'lancar', label: 'Lancar 🌟' },
                { id: 'berjuang', label: 'Perlu Muraja\'ah 💪' },
                { id: 'khusyuk', label: 'Khusyuk 🤲' },
                { id: 'syukur', label: 'Syukur ✨' },
                { id: 'evaluasi', label: 'Evaluasi Tajwid 🎯' }
              ] as const).map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedMood(id)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium cursor-pointer transition-all ${
                    selectedMood === id
                      ? 'bg-emerald-600 text-white font-semibold shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Label & Tag:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['Ba\'da Subuh', 'Ba\'da Maghrib', 'Kota Memori', 'Target Harian', 'Fasahah Tajwid', 'Setoran'].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleToggleTag(tag)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium cursor-pointer transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-teal-600 text-white font-semibold shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            {transcriptText && (
              <button
                type="button"
                onClick={() => setTranscriptText('')}
                className="px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
              >
                Hapus Teks
              </button>
            )}
            {editingJournalId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                Batal Edit
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewHistoryOpen(!viewHistoryOpen)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Riwayat ({memorizationJournals.length})</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${viewHistoryOpen ? 'rotate-180' : ''}`} />
            </button>

            <button
              type="submit"
              disabled={!transcriptText.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{editingJournalId ? 'Perbarui Catatan Suara' : 'Simpan Jurnal Suara (+35 XP)'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* History of Voice Journals Section (Collapsible / Toggleable) */}
      {viewHistoryOpen && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Daftar Catatan Suara Progres Hafalan ({filteredJournals.length})</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Cari surat / teks..."
                  className="pl-7 pr-3 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <select
                value={moodFilter}
                onChange={(e) => setMoodFilter(e.target.value)}
                className="px-2 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300"
              >
                <option value="all">Semua Evaluasi</option>
                <option value="lancar">Lancar 🌟</option>
                <option value="berjuang">Perlu Muraja'ah 💪</option>
                <option value="khusyuk">Khusyuk 🤲</option>
                <option value="syukur">Syukur ✨</option>
                <option value="evaluasi">Evaluasi Tajwid 🎯</option>
              </select>
            </div>
          </div>

          {filteredJournals.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              Belum ada riwayat catatan suara yang sesuai filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredJournals.map((journal) => (
                <div
                  key={journal.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2.5 relative flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                          {journal.surahName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize font-medium">
                          {journal.mood}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopyJournal(journal)}
                          className="p-1 rounded text-slate-400 hover:text-sky-600 transition-colors cursor-pointer"
                          title="Salin Transkrip"
                        >
                          {copySuccessId === journal.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => handleStartEdit(journal)}
                          className="p-1 rounded text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                          title="Edit Catatan"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setConfirmDeleteId(journal.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Hapus Catatan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Delete Confirmation prompt */}
                    {confirmDeleteId === journal.id && (
                      <div className="p-2 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between text-xs">
                        <span className="text-rose-700 dark:text-rose-300 text-[11px] font-medium">Hapus catatan ini?</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-[10px] text-slate-600 cursor-pointer"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => {
                              deleteMemorizationJournal(journal.id);
                              setConfirmDeleteId(null);
                            }}
                            className="px-2 py-0.5 rounded bg-rose-600 text-[10px] text-white font-semibold cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Target className="w-3 h-3 text-emerald-500" />
                      <span>{journal.targetProgressSummary}</span>
                    </div>

                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal whitespace-pre-line bg-slate-50/60 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      "{journal.transcript}"
                    </p>

                    {journal.tags && journal.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {journal.tags.map(t => (
                          <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 mt-2">
                    <span>{journal.date}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                      <Mic className="w-2.5 h-2.5" />
                      <span>Rekaman Suara</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // If rendered as Modal
  if (isModal) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
          {content}
        </div>
      </div>
    );
  }

  // If rendered in-page
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-4">
      {content}
    </div>
  );
};
