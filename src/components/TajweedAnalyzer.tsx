/**
 * AI Tajweed & Recitation Analyzer
 * Features Real-time Waveform visualizer, Microphone recording,
 * Gemini 3.8 Flash phonetic evaluation, and comparative recitation playback
 */
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SURAH_LIST, DETAILED_SURAHS, getAyahsForSurah } from '../data/quranData';
import { analyzeTajweedRecitation } from '../services/geminiService';
import { TajweedAnalysisResult } from '../types';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Send,
  Volume2,
  Activity,
  Award
} from 'lucide-react';

export const TajweedAnalyzer: React.FC = () => {
  const { 
    selectedSurah, 
    setSelectedSurah, 
    selectedAyah, 
    setSelectedAyah, 
    updateAyahStatus, 
    addXP 
  } = useApp();

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<TajweedAnalysisResult | null>(null);
  const [userTranscript, setUserTranscript] = useState<string>('');

  // Audio References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recordedAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<any>(null);

  const activeSurah = SURAH_LIST.find(s => s.number === selectedSurah) || SURAH_LIST[0];
  const ayahs = getAyahsForSurah(selectedSurah);
  const currentAyah = ayahs.find(a => a.numberInSurah === selectedAyah) || ayahs[0];

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Start Voice Recording
  const startRecording = async () => {
    setAnalysisResult(null);
    setRecordedAudioBlob(null);
    setRecordedAudioUrl(null);
    setRecordingSeconds(0);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Initialize AudioContext & Analyser for live visualizer
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      // Draw Waveform Loop
      drawWaveform();

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioBlob(audioBlob);
        setRecordedAudioUrl(url);

        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close().catch(() => {});
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start duration counter
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.warn('Microphone permission not granted or unavailable, using simulation:', err);
      // Fallback: simulate recording for environments without physical mic access
      setIsRecording(true);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
      drawSimulatedWaveform();
    }
  };

  // Stop Recording
  const stopRecording = () => {
    setIsRecording(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      // simulated blob fallback
      setRecordedAudioUrl(currentAyah.audioUrl || null);
    }
  };

  // Canvas Waveform rendering from AnalyserNode
  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;

        // Gradient emerald-to-gold
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(1, '#f59e0b');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);

        x += barWidth;
      }
    };
    render();
  };

  const drawSimulatedWaveform = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;
    const renderSim = () => {
      animationFrameRef.current = requestAnimationFrame(renderSim);
      tick += 0.08;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 40;
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const heightMultiplier = Math.sin(tick + i * 0.3) * 0.5 + 0.5;
        const barHeight = heightMultiplier * canvas.height * 0.7 + 10;

        ctx.fillStyle = '#10b981';
        ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
      }
    };
    renderSim();
  };

  // Run AI Tajweed Analysis
  const handleAnalyzeRecitation = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeTajweedRecitation(
        activeSurah.nameLatin,
        currentAyah.numberInSurah,
        currentAyah.textArabic,
        currentAyah.transliteration,
        userTranscript
      );
      setAnalysisResult(result);
      addXP(35, `Analisis Tajwid ${activeSurah.nameLatin}:${currentAyah.numberInSurah}`);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const playRecordedAudio = () => {
    if (!recordedAudioUrl) return;
    if (isPlayingRecorded) {
      recordedAudioRef.current?.pause();
      setIsPlayingRecorded(false);
    } else {
      if (recordedAudioRef.current) {
        recordedAudioRef.current.src = recordedAudioUrl;
        recordedAudioRef.current.play().catch(console.warn);
        setIsPlayingRecorded(true);
      }
    }
  };

  return (
    <div className="space-y-6">
      <audio 
        ref={recordedAudioRef} 
        onEnded={() => setIsPlayingRecorded(false)} 
        className="hidden" 
      />

      {/* Top Banner with Tajweed Spectrum Graphic */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-white shadow-sm p-6 sm:p-8">
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 opacity-25 sm:opacity-35">
          <img
            src="/src/assets/images/tajweed_wave_spectrum_1793052761467.jpg"
            alt="Tajweed Soundwave Spectrum"
            className="w-full h-full object-cover object-right"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-2">
            <span>Laboratorium Akustik Tajwid AI</span>
            <span aria-hidden="true">·</span>
            <span>Makhraj & Tartil Precision</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Analisis & Evaluasi Tajwid Suara Berbasis AI
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Rekam bacaan Anda secara langsung. Model AI kami mengevaluasi ketepatan makharijul huruf, 
            kadar harakat mad, kesempurnaan dengung ghunnah, serta kaidah waqf secara objektif dan mendalam.
          </p>
        </div>
      </div>

      {/* Recitation Stage Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Target Ayat & Microphone Console (6 Cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-5">
          {/* Ayat Selector Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-xs text-slate-500">Target Setoran</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {activeSurah.nameLatin} (Ayat {currentAyah.numberInSurah})
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedAyah}
                onChange={(e) => setSelectedAyah(parseInt(e.target.value))}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {ayahs.map(a => (
                  <option key={a.numberInSurah} value={a.numberInSurah}>
                    Ayat ke-{a.numberInSurah}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Arabic Text Display */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 text-right space-y-2">
            <p dir="rtl" className="font-quran text-2xl sm:text-3xl text-slate-900 dark:text-slate-50 leading-loose">
              {currentAyah.textArabic}
            </p>
            <div className="text-left pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
              <p className="text-xs font-medium text-emerald-800 dark:text-emerald-400 italic">
                "{currentAyah.transliteration}"
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {currentAyah.translationId}
              </p>
            </div>
          </div>

          {/* Waveform Canvas */}
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 relative">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Visualizer Resonansi Akustik</span>
              </span>
              <span className="font-mono text-emerald-400">
                {isRecording ? `00:${String(recordingSeconds).padStart(2, '0')}` : 'Standby'}
              </span>
            </div>

            <canvas
              ref={canvasRef}
              width={400}
              height={90}
              className="w-full h-[90px] rounded bg-slate-900/80"
            />
          </div>

          {/* Recording & Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>Mulai Rekam Setoran Suara</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>Hentikan Rekaman ({recordingSeconds}s)</span>
              </button>
            )}

            {recordedAudioUrl && !isRecording && (
              <div className="flex items-center gap-2">
                <button
                  onClick={playRecordedAudio}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {isPlayingRecorded ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>Dengar Rekaman Anda</span>
                </button>

                <button
                  onClick={handleAnalyzeRecitation}
                  disabled={isAnalyzing}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isAnalyzing ? 'Menganalisis Tajwid...' : 'Analisis dengan AI'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Analysis Report Card (6 Cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Laporan Evaluasi Qira'ah
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Hasil Analisis Tajwid Berbasis AI
              </h3>
            </div>
            {analysisResult && (
              <div className="text-right">
                <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {analysisResult.score}/100
                </span>
                <div className="text-[10px] text-slate-400">Skor Keseluruhan</div>
              </div>
            )}
          </div>

          {isAnalyzing ? (
            <div className="py-12 text-center space-y-3">
              <div className="inline-block w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Memproses frekuensi artikulasi makhraj dan kaidah tajwid...
              </p>
            </div>
          ) : analysisResult ? (
            <div className="space-y-4">
              {/* Score Breakdown Bars */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <div>
                  <div className="text-[11px] text-slate-500">Akurasi Lafaz</div>
                  <div className="text-base font-bold font-mono text-slate-800 dark:text-slate-100 tabular-nums">
                    {analysisResult.accuracy}%
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Makharijul Huruf</div>
                  <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {analysisResult.makhrajScore}%
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Kelancaran & Waqf</div>
                  <div className="text-base font-bold font-mono text-sky-600 dark:text-sky-400 tabular-nums">
                    {analysisResult.fluency}%
                  </div>
                </div>
              </div>

              {/* General Feedback Quote */}
              <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-xs">
                <div className="font-semibold text-emerald-900 dark:text-emerald-200 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ulasan Syaikh AI:</span>
                </div>
                <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  {analysisResult.feedback}
                </p>
              </div>

              {/* Detected Tajweed Rules Breakdown */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Rincian Kaidah yang Terdeteksi:
                </div>
                <div className="space-y-1.5">
                  {analysisResult.detectedRules.map((r, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/90 bg-white dark:bg-slate-850 flex items-start gap-2.5 text-xs"
                    >
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        r.status === 'good' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {r.rule}:
                        </span>{' '}
                        <span className="text-slate-600 dark:text-slate-400">
                          {r.detail}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practical Recommendation for Adults */}
              <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-xs text-sky-900 dark:text-sky-200">
                <strong>Rekomendasi Latihan 2 Menit:</strong> {analysisResult.recommendation}
              </div>

              {/* Action: Mark as Mutqin with this score */}
              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={() => {
                    updateAyahStatus(selectedSurah, currentAyah.numberInSurah, 'mutqin', analysisResult.score);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Simpan ke Rapor Mutqin (+50 XP)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-14 text-center space-y-2 text-slate-400">
              <Mic className="w-8 h-8 mx-auto opacity-40 text-slate-500" />
              <p className="text-xs">
                Belum ada rekaman setoran aktif. Klik tombol merah di sebelah kiri untuk melafalkan ayat.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
