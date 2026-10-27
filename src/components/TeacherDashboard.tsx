/**
 * Teacher & Mentor Progress Management Dashboard
 * Real-time monitoring of students, setoran grading, and weekly reporting
 */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentProgress } from '../types';
import { 
  GraduationCap, 
  Search, 
  CheckCircle, 
  Clock, 
  FileText, 
  Download, 
  Edit3, 
  UserCheck, 
  Filter,
  BarChart2,
  Send
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { students, updateStudentNote, setShowExportModal } = useApp();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'std-1');
  const [searchStudent, setSearchStudent] = useState<string>('');
  const [editingNote, setEditingNote] = useState<string>('');
  const [isEditingNote, setIsEditingNote] = useState<boolean>(false);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
    s.level.toLowerCase().includes(searchStudent.toLowerCase())
  );

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const handleStartEdit = () => {
    setEditingNote(currentStudent.teacherNotes);
    setIsEditingNote(true);
  };

  const handleSaveNote = () => {
    updateStudentNote(currentStudent.id, editingNote);
    setIsEditingNote(false);
  };

  const handleVerifySetoran = (status: StudentProgress['status']) => {
    updateStudentNote(
      currentStudent.id,
      currentStudent.teacherNotes + ` [Diverifikasi ${new Date().toLocaleDateString('id-ID')}]`,
      status
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Portal Ustadz Pembimbing & Mentor Tahfidz</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Dashboard Manajemen Progres Murid & Santri
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau hafalan harian, evaluasi rekaman tajwid, dan buat laporan mingguan otomatis untuk wali murid.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Rapor Mingguan (PDF/Excel)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Student Roster (4 Cols) + Selected Student Dossier (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Student Roster */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              placeholder="Cari nama santri atau kelas..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredStudents.map((std) => {
              const isSelected = std.id === currentStudent.id;
              const pct = Math.round((std.memorizedAyahs / std.totalAyahsTarget) * 100);

              return (
                <button
                  key={std.id}
                  onClick={() => {
                    setSelectedStudentId(std.id);
                    setIsEditingNote(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-start justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={std.avatar}
                      alt={std.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                    <div className="min-w-0 truncate">
                      <div className="text-xs font-bold truncate">
                        {std.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {std.level}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Setoran: {std.lastSetoranSurah} ({std.lastSetoranAyahRange})
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {pct}%
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {std.memorizedAyahs}/{std.totalAyahsTarget} ayat
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Student Dossier & Evaluation */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-5">
            {/* Student Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={currentStudent.avatar}
                  alt={currentStudent.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/30"
                />
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {currentStudent.name}
                  </h2>
                  <div className="text-xs text-slate-500">
                    {currentStudent.level} · Target Harian: {currentStudent.dailyTargetAyah} Ayat
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                  currentStudent.status === 'completed'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : currentStudent.status === 'review_needed'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                }`}>
                  {currentStudent.status === 'completed' ? 'Khatam Target' : currentStudent.status === 'review_needed' ? 'Butuh Muraja\'ah' : 'Aktif Belajar'}
                </span>
              </div>
            </div>

            {/* Scorecard Strip */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <div>
                <div className="text-[11px] text-slate-500">Ayat Mutqin</div>
                <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {currentStudent.memorizedAyahs} / {currentStudent.totalAyahsTarget}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500">Skor Tajwid AI</div>
                <div className="text-lg font-bold font-mono text-sky-600 dark:text-sky-400 tabular-nums">
                  {currentStudent.tajweedScore}%
                </div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500">Setoran Terakhir</div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {currentStudent.lastSetoranDate}
                </div>
              </div>
            </div>

            {/* Setoran Verification Box */}
            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 space-y-2">
              <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
                <span>Setoran Masuk: {currentStudent.lastSetoranSurah} ({currentStudent.lastSetoranAyahRange})</span>
                <span className="text-[11px] font-normal text-emerald-700 dark:text-emerald-400">Status Rekaman: Tersimpan</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Santri telah merekam bacaan melalui modul Tajwid AI dengan skor makhraj {currentStudent.tajweedScore}%.
                Sebagai mentor, Anda dapat menyetujui atau meminta penguatan mental walk kota memori.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleVerifySetoran('completed')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Terima & Sahkan Mutqin</span>
                </button>
                <button
                  onClick={() => handleVerifySetoran('review_needed')}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Minta Muraja'ah Ulang</span>
                </button>
              </div>
            </div>

            {/* Teacher Notes & Guidance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Catatan Pembimbing untuk Santri & Wali Murid
                </div>
                {!isEditingNote && (
                  <button
                    onClick={handleStartEdit}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Catatan</span>
                  </button>
                )}
              </div>

              {isEditingNote ? (
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={editingNote}
                    onChange={(e) => setEditingNote(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setIsEditingNote(false)}
                      className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSaveNote}
                      className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-md shadow-xs cursor-pointer"
                    >
                      Simpan Catatan
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-700 dark:text-slate-300 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 italic leading-relaxed">
                  "{currentStudent.teacherNotes}"
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
