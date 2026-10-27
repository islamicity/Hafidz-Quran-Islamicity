/**
 * Export Reports Modal
 * Generates PDF Printable Reports, CSV Data Sheets, Excel Workbooks, and Google Slides Outline
 */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SURAH_LIST } from '../data/quranData';
import { 
  X, 
  Printer, 
  FileSpreadsheet, 
  FileText, 
  Presentation, 
  Download, 
  Check, 
  Copy,
  ExternalLink
} from 'lucide-react';

export const ExportReportsModal: React.FC = () => {
  const { 
    showExportModal, 
    setShowExportModal, 
    userProgress, 
    students, 
    gamification 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pdf' | 'csv' | 'excel' | 'slides'>('pdf');
  const [copiedSlides, setCopiedSlides] = useState(false);

  if (!showExportModal) return null;

  const mutqinEntries = Object.values(userProgress).filter(p => p.status === 'mutqin');

  // Generate CSV Data
  const generateCSV = () => {
    const headers = ["Surah", "Nomor Ayat", "Status", "Tanggal Tinjauan", "Jumlah Pengulangan", "Skor Tajwid AI"];
    const rows = Object.values(userProgress).map(p => {
      const s = SURAH_LIST.find(surah => surah.number === p.surahNumber);
      return [
        s ? s.nameLatin : `Surah ${p.surahNumber}`,
        p.ayahNumber,
        p.status,
        p.lastReviewedAt,
        p.reviewCount,
        p.tajweedScore || '-'
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Hafalan_Hafidz_Quran_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate Excel-compatible XML data
  const generateExcel = () => {
    let table = '<table border="1"><tr><th>Surah</th><th>Ayat</th><th>Status</th><th>Terakhir Review</th><th>Jumlah Review</th><th>Skor Tajwid</th></tr>';
    Object.values(userProgress).forEach(p => {
      const s = SURAH_LIST.find(surah => surah.number === p.surahNumber);
      table += `<tr><td>${s?.nameLatin || p.surahNumber}</td><td>${p.ayahNumber}</td><td>${p.status}</td><td>${p.lastReviewedAt}</td><td>${p.reviewCount}</td><td>${p.tajweedScore || '-'}</td></tr>`;
    });
    table += '</table>';
    const blob = new Blob([table], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Hafalan_Excel_${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Google Slides presentation outline
  const slidesOutline = `
# PRESENTASI LAPORAN MINGGUAN TAHFIDZ
## Platform: Hafidz Quran Islamicity & Blueprint Kota Memori

---
### SLIDE 1: JUDUL & OVERVIEW
- **Judul**: Laporan Perkembangan Hafalan Al-Quran Santri
- **Metode**: Blueprint Kota Memori (Sistem Hafal Quran - SHQ)
- **Periode**: Pekan Berjalan (${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })})
- **Ringkasan**: Menghafal dengan pendekatan visual neuro-spasial ramah orang dewasa.

---
### SLIDE 2: PENCAPAIAN UTAMA (KEY MILESTONES)
- **Total Ayat Mutqin**: ${mutqinEntries.length} Ayat
- **Tingkat Istiqomah (Streak)**: ${gamification.streakDays} Hari Berturut-turut
- **Tingkat Kelancaran Tajwid AI**: 92.4% (Makharijul Huruf & Harakat Tartil)
- **Surat Primadona**: Surah Al-Mulk (10 Titik Loci Paviliun Utama)

---
### SLIDE 3: EVALUASI PERKEMBANGAN SANTRI
${students.map((s, i) => `
- **Santri ${i+1}: ${s.name}**
  - Progres: ${s.memorizedAyahs}/${s.totalAyahsTarget} Ayat (${Math.round((s.memorizedAyahs/s.totalAyahsTarget)*100)}%)
  - Tajwid: ${s.tajweedScore}%
  - Catatan Mentor: "${s.teacherNotes}"
`).join('')}

---
### SLIDE 4: JADWAL SPACED REPETITION PEKAN DEPAN
- H+1: Tinjauan kilat 2 menit ba'da Subuh
- H+3: Tasmi' mandiri tanpa mushaf
- H+7: Setoran rekaman suara ke modul Tajwid AI
- Target Baru: 3-5 Ayat / hari dengan ritme nyaman.
`;

  const copySlidesText = () => {
    navigator.clipboard.writeText(slidesOutline);
    setCopiedSlides(true);
    setTimeout(() => setCopiedSlides(false), 2000);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Ekspor Laporan & Dokumen Progres
              </h2>
              <p className="text-xs text-slate-500">
                Pilih format yang sesuai untuk Wali Murid, Mentor, atau Arsip Pribadi
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowExportModal(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'pdf'
                ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Printer className="w-4 h-4 text-emerald-600" />
            <span>PDF Printable</span>
          </button>

          <button
            onClick={() => setActiveTab('excel')}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'excel'
                ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel Workbook</span>
          </button>

          <button
            onClick={() => setActiveTab('csv')}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'csv'
                ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-sky-600" />
            <span>CSV Dataset</span>
          </button>

          <button
            onClick={() => setActiveTab('slides')}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'slides'
                ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Presentation className="w-4 h-4 text-amber-500" />
            <span>Google Slides</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'pdf' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-3">
                <div className="text-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <div className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
                    Hafidz Quran Islamicity
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    Rapor Mingguan Tahfidz & Evaluasi Tajwid
                  </h3>
                  <div className="text-[11px] text-slate-500">
                    Sistem Hafal Quran (SHQ) · Metode Blueprint Kota Memori
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><strong>Status:</strong> {mutqinEntries.length} Ayat Mutqin</div>
                  <div><strong>Streak:</strong> {gamification.streakDays} Hari Istiqomah</div>
                  <div><strong>Level:</strong> {gamification.levelTitle}</div>
                  <div><strong>Skor Tajwid:</strong> 93% (Sangat Baik)</div>
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  Format siap cetak dengan tata letak rapi, margin standar, dan kolom tanda tangan mentor.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={handlePrintPDF}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan PDF Sekarang</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'excel' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Unduh lembar kerja Microsoft Excel / Google Sheets berisi data tabulasi lengkap: nama surat, 
                ayat yang sudah mutqin, tanggal review berjarak, dan skor tajwid AI.
              </p>
              <button
                onClick={generateExcel}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File .XLS Excel</span>
              </button>
            </div>
          )}

          {activeTab === 'csv' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Unduh file data CSV mentah untuk keperluan integrasi database santri yayasan, analisis spreadsheet, 
                atau pencadangan lokal.
              </p>
              <button
                onClick={generateCSV}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File .CSV</span>
              </button>
            </div>
          )}

          {activeTab === 'slides' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Gunakan outline presentasi berikut untuk memaparkan perkembangan hafalan kepada wali murid atau pengurus yayasan:
              </p>
              <pre className="p-3 bg-slate-950 text-emerald-400 rounded-lg text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed whitespace-pre-wrap">
                {slidesOutline}
              </pre>
              <div className="flex items-center justify-end">
                <button
                  onClick={copySlidesText}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSlides ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSlides ? 'Tersalin ke Clipboard!' : 'Salin Teks Presentasi'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
