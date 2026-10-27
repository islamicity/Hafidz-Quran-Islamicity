/**
 * Daily Reminder & Push Notification Manager Modal
 * Personalized schedules tailored for busy working adults with real browser Web Push support
 */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DailyReminderConfig } from '../types';
import { 
  X, 
  Bell, 
  Clock, 
  Check, 
  Volume2, 
  Sparkles, 
  Plus, 
  Trash2, 
  Send,
  ShieldAlert
} from 'lucide-react';

export const ReminderModal: React.FC = () => {
  const { showReminderModal, setShowReminderModal, reminders, updateReminders, addXP } = useApp();
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [testSuccessMessage, setTestSuccessMessage] = useState<string | null>(null);

  // New Reminder Form
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTime, setNewTime] = useState('06:00');
  const [newName, setNewName] = useState('Muraja\'ah Singkat Pagi');
  const [newMessage, setNewMessage] = useState('Luangkan 5 menit di Kota Memori sebelum beraktivitas kerja.');
  const [newFrequency, setNewFrequency] = useState<'daily' | 'workdays' | 'custom'>('daily');

  if (!showReminderModal) return null;

  // Request browser Web Push notification permission
  const requestPushPermission = async () => {
    if (typeof Notification === 'undefined') {
      setTestSuccessMessage('Browser ini tidak mendukung Web Notifications API.');
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === 'granted') {
        sendTestNotification();
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // Trigger real or simulated test push notification
  const sendTestNotification = () => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification('Hafidz Quran Islamicity · Pengingat Belajar', {
        body: 'Saatnya istirahat sejenak! Mari telusuri 2 titik Loci di Kota Memori Surah Al-Mulk.',
        icon: '/favicon.ico'
      });
      setTestSuccessMessage('Notifikasi push percontohan berhasil dikirim ke layar Anda!');
    } else {
      setTestSuccessMessage('Simulasi Pengingat: [05:15 Ba\'da Subuh] "Pikiran jernih, mari sambung 2 ayat di Kota Memori."');
    }
    addXP(10, 'Menguji Notifikasi Pengingat');
    setTimeout(() => setTestSuccessMessage(null), 4000);
  };

  const toggleReminder = (index: number) => {
    const updated = reminders.map((r, i) => i === index ? { ...r, enabled: !r.enabled } : r);
    updateReminders(updated);
  };

  const deleteReminder = (index: number) => {
    const updated = reminders.filter((_, i) => i !== index);
    updateReminders(updated);
  };

  const handleAddNewReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const newConfig: DailyReminderConfig = {
      enabled: true,
      timeSlot: newTime,
      name: newName,
      message: newMessage,
      frequency: newFrequency,
      soundEnabled: true,
      reminderType: 'custom'
    };
    updateReminders([...reminders, newConfig]);
    setIsAddingNew(false);
    setNewName('');
    setNewMessage('');
    addXP(15, 'Menambahkan Jadwal Pengingat');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Notifikasi Pengingat Harian Personal
              </h2>
              <div className="text-xs text-slate-500">
                Jaga konsistensi hafalan di sela kesibukan aktivitas kerja
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowReminderModal(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {/* Web Push Permission Banner */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Izin Notifikasi Push Browser</span>
                {notificationPermission === 'granted' && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">(Aktif)</span>
                )}
              </div>
              <div className="text-[11px] text-slate-500">
                {notificationPermission === 'granted' 
                  ? 'Pengingat akan muncul di perangkat Anda sesuai jadwal.' 
                  : 'Aktifkan agar pengingat tetap berdering saat browser terminimalisasi.'}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {notificationPermission !== 'granted' ? (
                <button
                  onClick={requestPushPermission}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Izinkan Push
                </button>
              ) : (
                <button
                  onClick={sendTestNotification}
                  className="px-2.5 py-1 text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-lg font-medium cursor-pointer flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Uji Kirim</span>
                </button>
              )}
            </div>
          </div>

          {testSuccessMessage && (
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs border border-emerald-200 text-center animate-fade-in">
              {testSuccessMessage}
            </div>
          )}

          {/* Preset Reminder List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Jadwal Belajar Terpasang ({reminders.length})
              </div>
              <button
                onClick={() => setIsAddingNew(!isAddingNew)}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Jadwal</span>
              </button>
            </div>

            <div className="space-y-2">
              {reminders.map((reminder, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    reminder.enabled
                      ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50 dark:bg-slate-850'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => toggleReminder(idx)}
                      className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center border cursor-pointer ${
                        reminder.enabled
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {reminder.enabled && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {reminder.timeSlot}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {reminder.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        "{reminder.message}"
                      </p>
                      <div className="text-[10px] text-slate-400 mt-1 capitalize">
                        Frekuensi: {reminder.frequency === 'workdays' ? 'Hari Kerja (Senin-Jumat)' : 'Setiap Hari'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteReminder(idx)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
                    title="Hapus Jadwal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Reminder Form */}
          {isAddingNew && (
            <form onSubmit={handleAddNewReminder} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Buat Jadwal Pengingat Baru
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 mb-0.5 block">Jam Pengingat:</label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 mb-0.5 block">Frekuensi:</label>
                  <select
                    value={newFrequency}
                    onChange={(e: any) => setNewFrequency(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="daily">Setiap Hari</option>
                    <option value="workdays">Hari Kerja Saja</option>
                    <option value="custom">Akhir Pekan Saja</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-500 mb-0.5 block">Nama Pengingat:</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Muraja'ah KRL / Perjalanan Pulang"
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 mb-0.5 block">Pesan Motivasi:</label>
                <input
                  type="text"
                  required
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Contoh: 5 menit visualisasikan Loci 1-3 Surah Al-Mulk"
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Simpan Jadwal (+15 XP)
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
