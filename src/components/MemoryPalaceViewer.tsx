/**
 * Blueprint Kota Memori Component
 * Based on "Blueprint Kota Memori: Mulai Menghafal di Hari Pertama" & "Sistem Hafal Quran (SHQ)"
 * Features 5 Guided Stages, Interactive Loci Walkthrough, and Gemini AI Loci Generator
 */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ISTANA_MEMORI_STEPS, PRECONFIGURED_ROOMS, MethodStep } from '../data/memoryPalaceData';
import { DETAILED_SURAHS, getAyahsForSurah } from '../data/quranData';
import { generateCustomLoci } from '../services/geminiService';
import { 
  Sparkles, 
  MapPin, 
  ChevronRight, 
  ChevronLeft, 
  Eye, 
  RotateCw, 
  Footprints, 
  Calendar, 
  Home, 
  Wand2, 
  Play, 
  Pause, 
  Check, 
  Info,
  Lightbulb,
  Award
} from 'lucide-react';

export const MemoryPalaceViewer: React.FC = () => {
  const { 
    selectedSurah, 
    setSelectedSurah, 
    updateAyahStatus, 
    getAyahStatus, 
    addXP,
    fontSize 
  } = useApp();

  const [activeStepTab, setActiveStepTab] = useState<number>(1);
  const [activeRoomIndex, setActiveRoomIndex] = useState<number>(0);
  const [activeLocusIndex, setActiveLocusIndex] = useState<number>(0);
  const [walkDirection, setWalkDirection] = useState<'forward' | 'backward'>('forward');
  const [isWalkthroughMode, setIsWalkthroughMode] = useState<boolean>(false);
  const [testHideArabic, setTestHideArabic] = useState<boolean>(false);

  // Custom AI Generator state
  const [customRoomInput, setCustomRoomInput] = useState<string>('Ruang Tamu Rumah');
  const [isGeneratingLoci, setIsGeneratingLoci] = useState<boolean>(false);
  const [generatedLociResult, setGeneratedLociResult] = useState<{ title: string; visualAnchor: string; mnemonicStory: string } | null>(null);

  const activeRoom = PRECONFIGURED_ROOMS[activeRoomIndex];
  const currentLocus = activeRoom.loci[activeLocusIndex] || activeRoom.loci[0];
  const relatedAyah = DETAILED_SURAHS[activeRoom.surahNumber]?.find(a => a.numberInSurah === currentLocus.ayahTarget);

  const handleNextLocus = () => {
    if (activeLocusIndex < activeRoom.loci.length - 1) {
      setActiveLocusIndex(prev => prev + 1);
      addXP(10, `Menelusuri Loci ${activeLocusIndex + 2}`);
    } else {
      addXP(50, `Menyelesaikan Mental Walk Kota Memori`);
    }
  };

  const handlePrevLocus = () => {
    if (activeLocusIndex > 0) {
      setActiveLocusIndex(prev => prev - 1);
    }
  };

  const handleAILociGenerate = async () => {
    if (!relatedAyah) return;
    setIsGeneratingLoci(true);
    try {
      const res = await generateCustomLoci(
        activeRoom.surahName,
        currentLocus.ayahTarget,
        relatedAyah.textArabic,
        relatedAyah.translationId,
        customRoomInput
      );
      setGeneratedLociResult(res);
      addXP(25, 'Merancang Titik Loci AI Baru');
    } catch (e) {
      console.warn(e);
    } finally {
      setIsGeneratingLoci(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner with Blueprint visual reference */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-white shadow-sm">
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 opacity-30 md:opacity-40">
          <img
            src="/src/assets/images/istana_memori_blueprint_1793052760582.jpg"
            alt="Blueprint Kota Memori Courtyard"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
            <span>Metode Blueprint Kota Memori</span>
            <span aria-hidden="true">·</span>
            <span>Mulai Menghafal di Hari Pertama</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 text-balance">
            Kota Memori: Rahasia Menghafal Cepat & Anti-Lupa bagi Orang Dewasa
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            Metode mnemonik spasial berbasis sains neurobiologi. Memanfaatkan korteks hippocampus—bagian otak 
            yang menyimpan peta spasial tanpa penurunan fungsi di usia dewasa. Menghubungkan setiap ayat suci ke 
            titik ruangan yang sudah Anda kenal seumur hidup.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setActiveRoomIndex(0); // Al-Mulk
                setActiveStepTab(4); // Mental Walk
                setIsWalkthroughMode(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Footprints className="w-4 h-4 text-emerald-200" />
              <span>Mulai Mental Walk Surah Al-Mulk (10 Loci)</span>
            </button>

            <button
              onClick={() => setActiveStepTab(1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Info className="w-4 h-4 text-amber-400" />
              <span>Pelajari 5 Tahapan Ilmiah</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5-Step Guided Learning Stages Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            5 Tahapan Blueprint Kota Memori
          </div>
          <div className="text-xs text-slate-500">
            Panduan Langkah demi Langkah
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {ISTANA_MEMORI_STEPS.map((step) => {
            const isActive = activeStepTab === step.stepNumber;
            return (
              <button
                key={step.stepNumber}
                onClick={() => setActiveStepTab(step.stepNumber)}
                className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    Tahap {step.stepNumber}
                  </span>
                  <span className="text-[10px] text-slate-400">{step.duration}</span>
                </div>
                <div className="text-xs font-semibold line-clamp-1">{step.title.split(':')[1]?.trim() || step.title}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                  {step.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Deep-Dive Card */}
        {(() => {
          const stepDetail = ISTANA_MEMORI_STEPS.find(s => s.stepNumber === activeStepTab) || ISTANA_MEMORI_STEPS[0];
          return (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                    {stepDetail.stepNumber}
                  </span>
                  <span>{stepDetail.title}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {stepDetail.actionGuidance}
                </p>
              </div>

              <div className="md:w-80 shrink-0 p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-xs">
                <div className="font-semibold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>Tips untuk Orang Dewasa Sibuk:</span>
                </div>
                <p className="text-amber-800 dark:text-amber-200/90 leading-relaxed">
                  {stepDetail.adultTip}
                </p>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Main Interactive Stage: Mental Walk Simulator & Loci Navigator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Room & Loci Timeline (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pilih Kota Memori
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {activeRoom.roomName}
              </h3>
            </div>

            {/* Room selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
              {PRECONFIGURED_ROOMS.map((r, idx) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setActiveRoomIndex(idx);
                    setActiveLocusIndex(0);
                  }}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    activeRoomIndex === idx
                      ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {r.surahName.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {activeRoom.description}
          </p>

          {/* Loci List in Clockwise Order */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Urutan 10 Titik Loci (Searah Jarum Jam)</span>
              <span>Loci {activeLocusIndex + 1} / {activeRoom.loci.length}</span>
            </div>

            <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
              {activeRoom.loci.map((locus, idx) => {
                const isSelected = activeLocusIndex === idx;
                const status = getAyahStatus(activeRoom.surahNumber, locus.ayahTarget);

                return (
                  <button
                    key={locus.id}
                    onClick={() => setActiveLocusIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                        : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {locus.locusNumber}
                      </div>
                      <div className="min-w-0 truncate">
                        <div className="text-xs font-semibold truncate">
                          {locus.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          Ayat {locus.ayahTarget} · {locus.visualAnchor.slice(0, 30)}...
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      {status === 'mutqin' && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Mutqin
                        </span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Loci Visualizer Stage & Ayah Mnemonic Card (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Locus Mnemonic Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
            {/* Locus Header & Controls */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-bold font-mono rounded-md">
                  Titik Loci #{currentLocus.locusNumber}
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {currentLocus.title}
                </span>
              </div>

              {/* Navigation Arrows for Mental Walk */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevLocus}
                  disabled={activeLocusIndex === 0}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Loci Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextLocus}
                  disabled={activeLocusIndex === activeRoom.loci.length - 1}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Loci Berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Anchor Spotlight */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 space-y-1.5">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Jangkar Visual Spektakuler (Visual Anchor)</span>
              </div>
              <div className="text-sm font-semibold">
                "{currentLocus.visualAnchor}"
              </div>
              <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                {currentLocus.mnemonicStory}
              </p>
            </div>

            {/* Quran Ayah Display */}
            {relatedAyah && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Target Hafalan: Ayat {relatedAyah.numberInSurah}</span>
                  <button
                    onClick={() => setTestHideArabic(!testHideArabic)}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{testHideArabic ? 'Tampilkan Teks Arab' : 'Tutup Teks (Uji Ingatan)'}</span>
                  </button>
                </div>

                {/* Arabic Text (Hideable for active recall test!) */}
                <div className="py-2 text-right min-h-[60px] flex items-center justify-end">
                  {testHideArabic ? (
                    <div className="w-full text-center py-4 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg text-xs text-slate-500 italic">
                      [Teks Arab ditutup untuk menguji visualisasi Kota Memori Anda. Coba lafalkan dari ingatan visual!]
                    </div>
                  ) : (
                    <p dir="rtl" className="font-quran text-2xl sm:text-3xl text-slate-900 dark:text-white leading-loose">
                      {relatedAyah.textArabic}
                    </p>
                  )}
                </div>

                {/* Transliteration & Translation */}
                <div className="space-y-1 text-left">
                  <p className="text-xs sm:text-sm font-medium text-emerald-800 dark:text-emerald-400 italic">
                    "{relatedAyah.transliteration}"
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {relatedAyah.translationId}
                  </p>
                </div>
              </div>
            )}

            {/* Mental Walk Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  updateAyahStatus(activeRoom.surahNumber, currentLocus.ayahTarget, 'mutqin');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Kunci Mutqin di Titik Ini (+50 XP)</span>
              </button>

              <button
                onClick={handleNextLocus}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Lanjut ke Loci #{activeLocusIndex + 2 > activeRoom.loci.length ? 1 : activeLocusIndex + 2}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Custom Loci Generator Box */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-emerald-600" />
                <span>AI Kota Memori: Buat Jangkar Khusus Ruangan & Bangunan Anda</span>
              </div>
              <span className="text-[11px] text-slate-400">Gemini 3.8 Flash</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ingin menempatkan Ayat {currentLocus.ayahTarget} di rumah atau kantor Anda sendiri? Masukkan nama ruangan:
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customRoomInput}
                onChange={(e) => setCustomRoomInput(e.target.value)}
                placeholder="Contoh: Kamar Tidur, Meja Belajar, Garasi, Masjid Lingkungan..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
              <button
                onClick={handleAILociGenerate}
                disabled={isGeneratingLoci}
                className="px-4 py-2 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                {isGeneratingLoci ? (
                  <span>Meracik Asosiasi...</span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Generate Loci AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Loci Display */}
            {generatedLociResult && (
              <div className="p-3 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1 mt-2">
                <div className="font-bold text-emerald-900 dark:text-emerald-300">
                  {generatedLociResult.title}
                </div>
                <div className="text-emerald-800 dark:text-emerald-200">
                  <strong>Jangkar:</strong> {generatedLociResult.visualAnchor}
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {generatedLociResult.mnemonicStory}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
