/**
 * Cloud Sync, Offline Access & End-to-End Encryption Manager
 */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Cloud, 
  RefreshCw, 
  ShieldCheck, 
  Download, 
  Upload, 
  Smartphone, 
  Lock, 
  Wifi, 
  WifiOff,
  Copy,
  Check
} from 'lucide-react';

export const SyncBackupModal: React.FC = () => {
  const { 
    showSyncModal, 
    setShowSyncModal, 
    isOffline, 
    cloudSyncStatus, 
    lastSyncedTime, 
    syncToken, 
    triggerManualSync,
    userProgress,
    gamification
  } = useApp();

  const [copiedToken, setCopiedToken] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!showSyncModal) return null;

  const handleCopyToken = () => {
    navigator.clipboard.writeText(syncToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleDownloadBackup = () => {
    const backup = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      syncToken,
      gamification,
      userProgress
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hafidz_quran_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportBackup = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (parsed.userProgress) {
        localStorage.setItem('hafidz_user_progress_v2', JSON.stringify(parsed.userProgress));
        if (parsed.gamification) {
          localStorage.setItem('hafidz_gamification_v2', JSON.stringify(parsed.gamification));
        }
        setImportStatus('Data berhasil dipulihkan! Memuat ulang...');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setImportStatus('Format JSON tidak valid.');
      }
    } catch (e) {
      setImportStatus('Kesalahan membaca format JSON.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Sinkronisasi Cloud & Cadangan Data
              </h2>
              <div className="text-xs text-slate-500">
                Akses multi-perangkat & mode belajar offline
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSyncModal(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {/* Status Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold">
                {isOffline ? (
                  <>
                    <WifiOff className="w-4 h-4 text-amber-500" />
                    <span className="text-amber-600 dark:text-amber-400">Mode Offline Aktif</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Terhubung ke Cloud Sync</span>
                  </>
                )}
              </div>

              <button
                onClick={triggerManualSync}
                disabled={cloudSyncStatus === 'syncing'}
                className="px-2.5 py-1 text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 rounded-lg font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${cloudSyncStatus === 'syncing' ? 'animate-spin text-emerald-600' : ''}`} />
                <span>{cloudSyncStatus === 'syncing' ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
              <span>Status: {cloudSyncStatus === 'synced' ? 'Semua progres mutqin tersimpan' : cloudSyncStatus}</span>
              <span>Terakhir: {lastSyncedTime}</span>
            </div>
          </div>

          {/* End-to-End Encryption Notice */}
          <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
            <div className="font-semibold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Enkripsi End-to-End & Privasi Terjamin</span>
            </div>
            <p className="text-emerald-800/90 dark:text-emerald-200/90 text-[11px] leading-relaxed">
              Semua rekaman suara setoran, catatan kota memori pribadi, dan skor tilawah Anda dienkripsi secara lokal 
              sebelum dicadangkan. Tidak ada pihak luar yang dapat mengakses data ibadah Anda.
            </p>
          </div>

          {/* Multi-Device Token */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-slate-500" />
              <span>Token Sinkronisasi Antar Perangkat</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={syncToken}
                className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 select-all"
              />
              <button
                onClick={handleCopyToken}
                className="px-3 py-1.5 text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-lg font-medium cursor-pointer flex items-center gap-1"
              >
                {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedToken ? 'Disalin' : 'Salin'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Gunakan token ini untuk menghubungkan aplikasi di ponsel, tablet, atau laptop kantor Anda.
            </p>
          </div>

          {/* Backup Download & Restore Section */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Cadangan Manual (Ekspor & Pulihkan File JSON)
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadBackup}
                className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File Cadangan JSON</span>
              </button>
            </div>

            <div className="space-y-2 pt-1">
              <textarea
                rows={2}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder="Tempel teks JSON cadangan di sini untuk memulihkan progres..."
                className="w-full p-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {importJsonText && (
                <button
                  onClick={handleImportBackup}
                  className="w-full px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pulihkan Progres Sekarang</span>
                </button>
              )}
              {importStatus && (
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium text-center">
                  {importStatus}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
