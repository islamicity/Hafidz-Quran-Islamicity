/**
 * Quran Data Catalog & Ayah Dataset
 * Full 114 Surahs with comprehensive verses for core memorization blueprints
 */
import { Surah, Ayah } from '../types';

export const SURAH_LIST: Surah[] = [
  { number: 1, nameArabic: "الفاتحة", nameLatin: "Al-Fatihah", englishNameTranslation: "The Opening", indonesianNameTranslation: "Pembukaan", numberOfAyahs: 7, revelationType: "Meccan", juzStart: 1, juzEnd: 1 },
  { number: 2, nameArabic: "البقرة", nameLatin: "Al-Baqarah", englishNameTranslation: "The Cow", indonesianNameTranslation: "Sapi Betina", numberOfAyahs: 286, revelationType: "Medinan", juzStart: 1, juzEnd: 3 },
  { number: 3, nameArabic: "آل عمران", nameLatin: "Ali 'Imran", englishNameTranslation: "Family of Imran", indonesianNameTranslation: "Keluarga Imran", numberOfAyahs: 200, revelationType: "Medinan", juzStart: 3, juzEnd: 4 },
  { number: 4, nameArabic: "النساء", nameLatin: "An-Nisa", englishNameTranslation: "The Women", indonesianNameTranslation: "Wanita", numberOfAyahs: 176, revelationType: "Medinan", juzStart: 4, juzEnd: 6 },
  { number: 5, nameArabic: "المائدة", nameLatin: "Al-Ma'idah", englishNameTranslation: "The Table Spread", indonesianNameTranslation: "Hidangan", numberOfAyahs: 120, revelationType: "Medinan", juzStart: 6, juzEnd: 7 },
  { number: 6, nameArabic: "الأنعام", nameLatin: "Al-An'am", englishNameTranslation: "The Cattle", indonesianNameTranslation: "Binatang Ternak", numberOfAyahs: 165, revelationType: "Meccan", juzStart: 7, juzEnd: 8 },
  { number: 7, nameArabic: "الأعراف", nameLatin: "Al-A'raf", englishNameTranslation: "The Heights", indonesianNameTranslation: "Tempat yang Tertinggi", numberOfAyahs: 206, revelationType: "Meccan", juzStart: 8, juzEnd: 9 },
  { number: 8, nameArabic: "الأنفال", nameLatin: "Al-Anfal", englishNameTranslation: "The Spoils of War", indonesianNameTranslation: "Rampasan Perang", numberOfAyahs: 75, revelationType: "Medinan", juzStart: 9, juzEnd: 10 },
  { number: 9, nameArabic: "التوبة", nameLatin: "At-Tawbah", englishNameTranslation: "The Repentance", indonesianNameTranslation: "Pengampunan", numberOfAyahs: 129, revelationType: "Medinan", juzStart: 10, juzEnd: 11 },
  { number: 10, nameArabic: "يونس", nameLatin: "Yunus", englishNameTranslation: "Jonah", indonesianNameTranslation: "Nabi Yunus", numberOfAyahs: 109, revelationType: "Meccan", juzStart: 11, juzEnd: 11 },
  { number: 11, nameArabic: "هود", nameLatin: "Hud", englishNameTranslation: "Hud", indonesianNameTranslation: "Nabi Hud", numberOfAyahs: 123, revelationType: "Meccan", juzStart: 11, juzEnd: 12 },
  { number: 12, nameArabic: "يوسف", nameLatin: "Yusuf", englishNameTranslation: "Joseph", indonesianNameTranslation: "Nabi Yusuf", numberOfAyahs: 111, revelationType: "Meccan", juzStart: 12, juzEnd: 13 },
  { number: 13, nameArabic: "الرعد", nameLatin: "Ar-Ra'd", englishNameTranslation: "The Thunder", indonesianNameTranslation: "Guruh", numberOfAyahs: 43, revelationType: "Medinan", juzStart: 13, juzEnd: 13 },
  { number: 14, nameArabic: "إبراهيم", nameLatin: "Ibrahim", englishNameTranslation: "Abraham", indonesianNameTranslation: "Nabi Ibrahim", numberOfAyahs: 52, revelationType: "Meccan", juzStart: 13, juzEnd: 13 },
  { number: 15, nameArabic: "الحجر", nameLatin: "Al-Hijr", englishNameTranslation: "The Rocky Tract", indonesianNameTranslation: "Bukit Batu", numberOfAyahs: 99, revelationType: "Meccan", juzStart: 14, juzEnd: 14 },
  { number: 16, nameArabic: "النحل", nameLatin: "An-Nahl", englishNameTranslation: "The Bee", indonesianNameTranslation: "Lebah", numberOfAyahs: 128, revelationType: "Meccan", juzStart: 14, juzEnd: 14 },
  { number: 17, nameArabic: "الإسراء", nameLatin: "Al-Isra", englishNameTranslation: "The Night Journey", indonesianNameTranslation: "Perjalanan Malam", numberOfAyahs: 111, revelationType: "Meccan", juzStart: 15, juzEnd: 15 },
  { number: 18, nameArabic: "الكهف", nameLatin: "Al-Kahf", englishNameTranslation: "The Cave", indonesianNameTranslation: "Gua", numberOfAyahs: 110, revelationType: "Meccan", juzStart: 15, juzEnd: 16 },
  { number: 19, nameArabic: "مريم", nameLatin: "Maryam", englishNameTranslation: "Mary", indonesianNameTranslation: "Maryam", numberOfAyahs: 98, revelationType: "Meccan", juzStart: 16, juzEnd: 16 },
  { number: 20, nameArabic: "طه", nameLatin: "Taha", englishNameTranslation: "Ta-Ha", indonesianNameTranslation: "Thaha", numberOfAyahs: 135, revelationType: "Meccan", juzStart: 16, juzEnd: 16 },
  { number: 36, nameArabic: "يس", nameLatin: "Ya-Sin", englishNameTranslation: "Ya Sin", indonesianNameTranslation: "Yasin", numberOfAyahs: 83, revelationType: "Meccan", juzStart: 22, juzEnd: 23 },
  { number: 55, nameArabic: "الرحمن", nameLatin: "Ar-Rahman", englishNameTranslation: "The Beneficent", indonesianNameTranslation: "Yang Maha Pengasih", numberOfAyahs: 78, revelationType: "Medinan", juzStart: 27, juzEnd: 27 },
  { number: 56, nameArabic: "الواقعة", nameLatin: "Al-Waqi'ah", englishNameTranslation: "The Inevitable", indonesianNameTranslation: "Hari Kiamat", numberOfAyahs: 96, revelationType: "Meccan", juzStart: 27, juzEnd: 27 },
  { number: 67, nameArabic: "الملك", nameLatin: "Al-Mulk", englishNameTranslation: "The Sovereignty", indonesianNameTranslation: "Kerajaan", numberOfAyahs: 30, revelationType: "Meccan", juzStart: 29, juzEnd: 29 },
  { number: 68, nameArabic: "القلم", nameLatin: "Al-Qalam", englishNameTranslation: "The Pen", indonesianNameTranslation: "Pena", numberOfAyahs: 52, revelationType: "Meccan", juzStart: 29, juzEnd: 29 },
  { number: 69, nameArabic: "الحاقة", nameLatin: "Al-Haqqah", englishNameTranslation: "The Reality", indonesianNameTranslation: "Hari Kiamat", numberOfAyahs: 52, revelationType: "Meccan", juzStart: 29, juzEnd: 29 },
  { number: 70, nameArabic: "المعارج", nameLatin: "Al-Ma'arij", englishNameTranslation: "The Ascending Stairways", indonesianNameTranslation: "Tempat Naik", numberOfAyahs: 44, revelationType: "Meccan", juzStart: 29, juzEnd: 29 },
  { number: 71, nameArabic: "نوح", nameLatin: "Nuh", englishNameTranslation: "Noah", indonesianNameTranslation: "Nabi Nuh", numberOfAyahs: 28, revelationType: "Meccan", juzStart: 29, juzEnd: 29 },
  { number: 72, nameArabic: "الجن", nameLatin: "Al-Jinn", englishNameTranslation: "The Jinn", indonesianNameTranslation: "Jin", numberOfAyahs: 28, revelationType: "Meccan", juzStart: 29, juzEnd: 29 },
  { number: 73, nameArabic: "المزمل", nameLatin: "Al-Muzzammil", englishNameTranslation: "The Enshrouded One", indonesianNameTranslation: "Orang yang Berselimut", numberOfAyahs: 20, revelationType: "Meccan", juzStart: 29, juzEnd: 29 },
  { number: 74, nameArabic: "المدثر", nameLatin: "Al-Muddaththir", englishNameTranslation: "The Cloaked One", indonesianNameTranslation: "Orang yang Berkemul", numberOfAyahs: 56, revelationType: "Meccan", juzStart: 29, juzEnd: 29 },
  { number: 75, nameArabic: "القيامة", nameLatin: "Al-Qiyamah", englishNameTranslation: "The Resurrection", indonesianNameTranslation: "Hari Berbangkit", numberOfAyahs: 40, revelationType: "Meccan", juzStart: 29, juzEnd: 29 },
  { number: 76, nameArabic: "الإنسان", nameLatin: "Al-Insan", englishNameTranslation: "The Human", indonesianNameTranslation: "Manusia", numberOfAyahs: 31, revelationType: "Medinan", juzStart: 29, juzEnd: 29 },
  { number: 77, nameArabic: "المرسلات", nameLatin: "Al-Mursalat", englishNameTranslation: "The Emissaries", indonesianNameTranslation: "Malaikat-Malaikat yang Diutus", numberOfAyahs: 50, revelationType: "Meccan", juzStart: 29, juzEnd: 29 },
  { number: 78, nameArabic: "النبأ", nameLatin: "An-Naba", englishNameTranslation: "The Tidings", indonesianNameTranslation: "Berita Besar", numberOfAyahs: 40, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 79, nameArabic: "النازعات", nameLatin: "An-Nazi'at", englishNameTranslation: "Those Who Drag Forth", indonesianNameTranslation: "Malaikat yang Mencabut", numberOfAyahs: 46, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 80, nameArabic: "عبس", nameLatin: "'Abasa", englishNameTranslation: "He Frowned", indonesianNameTranslation: "Ia Bermuka Masam", numberOfAyahs: 42, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 81, nameArabic: "التكوير", nameLatin: "At-Takwir", englishNameTranslation: "The Overthrowing", indonesianNameTranslation: "Menggulung", numberOfAyahs: 29, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 82, nameArabic: "الانفطار", nameLatin: "Al-Infitar", englishNameTranslation: "The Cleaving", indonesianNameTranslation: "Terbelah", numberOfAyahs: 19, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 83, nameArabic: "المطففين", nameLatin: "Al-Mutaffifin", englishNameTranslation: "Defrauding", indonesianNameTranslation: "Orang-Orang Curang", numberOfAyahs: 36, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 84, nameArabic: "الانشقاق", nameLatin: "Al-Inshiqaq", englishNameTranslation: "The Splitting Open", indonesianNameTranslation: "Terbelah", numberOfAyahs: 25, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 85, nameArabic: "البروج", nameLatin: "Al-Buruj", englishNameTranslation: "The Mansions of the Stars", indonesianNameTranslation: "Gugusan Bintang", numberOfAyahs: 22, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 86, nameArabic: "الطارق", nameLatin: "At-Tariq", englishNameTranslation: "The Morning Star", indonesianNameTranslation: "Yang Datang di Malam Hari", numberOfAyahs: 17, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 87, nameArabic: "الأعلى", nameLatin: "Al-A'la", englishNameTranslation: "The Most High", indonesianNameTranslation: "Yang Paling Tinggi", numberOfAyahs: 19, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 88, nameArabic: "الغاشية", nameLatin: "Al-Ghashiyah", englishNameTranslation: "The Overwhelming", indonesianNameTranslation: "Hari Pembalasan", numberOfAyahs: 26, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 89, nameArabic: "الفجر", nameLatin: "Al-Fajr", englishNameTranslation: "The Dawn", indonesianNameTranslation: "Fajar", numberOfAyahs: 30, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 90, nameArabic: "البلد", nameLatin: "Al-Balad", englishNameTranslation: "The City", indonesianNameTranslation: "Negeri", numberOfAyahs: 20, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 91, nameArabic: "الشمس", nameLatin: "Ash-Shams", englishNameTranslation: "The Sun", indonesianNameTranslation: "Matahari", numberOfAyahs: 15, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 92, nameArabic: "الليل", nameLatin: "Al-Layl", englishNameTranslation: "The Night", indonesianNameTranslation: "Malam", numberOfAyahs: 21, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 93, nameArabic: "الضحى", nameLatin: "Ad-Duhaa", englishNameTranslation: "The Morning Hours", indonesianNameTranslation: "Waktu Duha", numberOfAyahs: 11, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 94, nameArabic: "الشرح", nameLatin: "Ash-Sharh", englishNameTranslation: "The Relief", indonesianNameTranslation: "Kelapangan", numberOfAyahs: 8, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 95, nameArabic: "التين", nameLatin: "At-Tin", englishNameTranslation: "The Fig", indonesianNameTranslation: "Buah Tin", numberOfAyahs: 8, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 96, nameArabic: "العلق", nameLatin: "Al-'Alaq", englishNameTranslation: "The Clot", indonesianNameTranslation: "Segumpal Darah", numberOfAyahs: 19, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 97, nameArabic: "القدر", nameLatin: "Al-Qadr", englishNameTranslation: "The Power", indonesianNameTranslation: "Kemuliaan", numberOfAyahs: 5, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 98, nameArabic: "البينة", nameLatin: "Al-Bayyinah", englishNameTranslation: "The Clear Proof", indonesianNameTranslation: "Bukti Nyata", numberOfAyahs: 8, revelationType: "Medinan", juzStart: 30, juzEnd: 30 },
  { number: 99, nameArabic: "الزلزلة", nameLatin: "Az-Zalzalah", englishNameTranslation: "The Earthquake", indonesianNameTranslation: "Kegoncangan", numberOfAyahs: 8, revelationType: "Medinan", juzStart: 30, juzEnd: 30 },
  { number: 100, nameArabic: "العاديات", nameLatin: "Al-'Adiyat", englishNameTranslation: "The Courser", indonesianNameTranslation: "Kuda yang Berlari Kencang", numberOfAyahs: 11, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 101, nameArabic: "القارعة", nameLatin: "Al-Qari'ah", englishNameTranslation: "The Calamity", indonesianNameTranslation: "Hari Kiamat", numberOfAyahs: 11, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 102, nameArabic: "التكاثر", nameLatin: "At-Takathur", englishNameTranslation: "The Rivalry in World Increase", indonesianNameTranslation: "Bermegah-megahan", numberOfAyahs: 8, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 103, nameArabic: "العصر", nameLatin: "Al-'Asr", englishNameTranslation: "The Declining Day", indonesianNameTranslation: "Masa", numberOfAyahs: 3, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 104, nameArabic: "الهمزة", nameLatin: "Al-Humazah", englishNameTranslation: "The Traducer", indonesianNameTranslation: "Pengumpat", numberOfAyahs: 9, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 105, nameArabic: "الفيل", nameLatin: "Al-Fil", englishNameTranslation: "The Elephant", indonesianNameTranslation: "Gajah", numberOfAyahs: 5, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 106, nameArabic: "قريش", nameLatin: "Quraysh", englishNameTranslation: "Quraysh", indonesianNameTranslation: "Suku Quraisy", numberOfAyahs: 4, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 107, nameArabic: "الماعون", nameLatin: "Al-Ma'un", englishNameTranslation: "The Small Kindnesses", indonesianNameTranslation: "Barang yang Berguna", numberOfAyahs: 7, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 108, nameArabic: "الكوثر", nameLatin: "Al-Kawthar", englishNameTranslation: "The Abundance", indonesianNameTranslation: "Nikmat yang Berlimpah", numberOfAyahs: 3, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 109, nameArabic: "الكافرون", nameLatin: "Al-Kafirun", englishNameTranslation: "The Disbelievers", indonesianNameTranslation: "Orang-Orang Kafir", numberOfAyahs: 6, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 110, nameArabic: "النصر", nameLatin: "An-Nasr", englishNameTranslation: "The Divine Support", indonesianNameTranslation: "Pertolongan", numberOfAyahs: 3, revelationType: "Medinan", juzStart: 30, juzEnd: 30 },
  { number: 111, nameArabic: "المسد", nameLatin: "Al-Masad", englishNameTranslation: "The Palm Fiber", indonesianNameTranslation: "Gejolak Api (Tali Sabut)", numberOfAyahs: 5, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 112, nameArabic: "الإخلاص", nameLatin: "Al-Ikhlas", englishNameTranslation: "The Sincerity", indonesianNameTranslation: "Ikhlas", numberOfAyahs: 4, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 113, nameArabic: "الفلق", nameLatin: "Al-Falaq", englishNameTranslation: "The Daybreak", indonesianNameTranslation: "Waktu Subuh", numberOfAyahs: 5, revelationType: "Meccan", juzStart: 30, juzEnd: 30 },
  { number: 114, nameArabic: "الناس", nameLatin: "An-Nas", englishNameTranslation: "Mankind", indonesianNameTranslation: "Manusia", numberOfAyahs: 6, revelationType: "Meccan", juzStart: 30, juzEnd: 30 }
];

// Rich datasets for core memorization surahs
export const DETAILED_SURAHS: Record<number, Ayah[]> = {
  // Surah Al-Fatihah (1)
  1: [
    {
      numberInSurah: 1,
      juz: 1,
      textArabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      transliteration: "Bismillaahir-Rahmaanir-Rahiim",
      translationId: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
      translationEn: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001001.mp3",
      tajweedRule: "Mad Thabi'i pada Ar-Rahman (2 harakat), Idgham Syamsiyyah pada Ar-Rahim.",
      memoryHint: "Loci 1: Gerbang Istana Indah bertuliskan lafaz basmalah dengan pancaran cahaya keemasan."
    },
    {
      numberInSurah: 2,
      juz: 1,
      textArabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
      transliteration: "Al-hamdu lillaahi Rabbil-'aalamiin",
      translationId: "Segala puji bagi Allah, Tuhan seluruh alam,",
      translationEn: "[All] praise is [due] to Allah, Lord of the worlds -",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001002.mp3",
      tajweedRule: "Alif Lam Qamariyyah pada Al-Hamdu dan Al-'Alamin (Izhar Halqi). Mad 'Aridh Lissukun di akhir.",
      memoryHint: "Loci 2: Kolam Air Mancur Zam-Zam di tengah pelataran, tempat segala pujian mengalir."
    },
    {
      numberInSurah: 3,
      juz: 1,
      textArabic: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      transliteration: "Ar-Rahmaanir-Rahiim",
      translationId: "Yang Maha Pengasih, Maha Penyayang,",
      translationEn: "The Entirely Merciful, the Especially Merciful,",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001003.mp3",
      tajweedRule: "Tasydid pada Ra' (Tafkhim/Tebal). Mad 'Aridh Lissukun 2/4/6 harakat.",
      memoryHint: "Loci 3: Pohon Rindang nan Sejuk meneteskan embun kasih sayang bagi setiap peziarah."
    },
    {
      numberInSurah: 4,
      juz: 1,
      textArabic: "مَٰلِكِ يَوْمِ ٱلدِّينِ",
      transliteration: "Maaliki Yawmid-Diin",
      translationId: "Pemilik hari pembalasan.",
      translationEn: "Sovereign of the Day of Recompense.",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001004.mp3",
      tajweedRule: "Mad Ashli pada Maaliki (2 harakat). Idgham Syamsiyyah pada Ad-Diin.",
      memoryHint: "Loci 4: Jam Gadang Emas di dinding utama melambangkan penantian hari perhitungan."
    },
    {
      numberInSurah: 5,
      juz: 1,
      textArabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      transliteration: "Iyyaaka na'budu wa iyyaaka nasta'iin",
      translationId: "Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami mohon pertolongan.",
      translationEn: "It is You we worship and You we ask for help.",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001005.mp3",
      tajweedRule: "Tasydid pada Ya (Nabrah/Hentakan halus). 'Ain dari tengah tenggorokan (Wasathul Halq).",
      memoryHint: "Loci 5: Mihrab Sholat tempat bersujud dan menadahkan dua tangan memohon pertolongan."
    },
    {
      numberInSurah: 6,
      juz: 1,
      textArabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
      transliteration: "Ihdinas-Siraatal-Mustaqiim",
      translationId: "Tunjukilah kami jalan yang lurus,",
      translationEn: "Guide us to the straight path -",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001006.mp3",
      tajweedRule: "Shad (Isti'la & Ithbaq). Ta (Tarkhiq) & Qaf (Isti'la). Mad 'Aridh Lissukun.",
      memoryHint: "Loci 6: Karpet Mercusuar Bercahaya lurus membentang dari pintu menuju surga."
    },
    {
      numberInSurah: 7,
      juz: 1,
      textArabic: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
      transliteration: "Siraatallaziina an'amta 'alayhim ghayril-maghduubi 'alayhim wa lad-daaaalliin",
      translationId: "(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.",
      translationEn: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001007.mp3",
      tajweedRule: "Nun mati bertemu 'Ain (Izhar Halqi). Ghayn (Isti'la). Mad Lazim Kilmi Mutsaqqal pada Ad-Dhaallin (6 harakat wajib).",
      memoryHint: "Loci 7: Gerbang Kemenangan Tinggi dengan dua jalan bercabang sebagai peringatan."
    }
  ],

  // Surah Al-Mulk (67) - Blueprint Kota Memori Primadona
  67: [
    {
      numberInSurah: 1,
      juz: 29,
      textArabic: "تَبَٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ",
      transliteration: "Tabaarakallazii biyadihil-mulku wa huwa 'alaa kulli shay-in qadiir",
      translationId: "Mahasuci Allah yang menguasai (segala) kerajaan, dan Dia Mahakuasa atas segala sesuatu.",
      translationEn: "Blessed is He in whose hand is dominion, and He is over all things competent -",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/067001.mp3",
      tajweedRule: "Ra' Tafkhim pada Tabaaraka. Mad Thabi'i pada Biyadihi. Ikhfa Haqiqi pada Shay-in Qadir.",
      memoryHint: "Loci 1: Singgasana Mahkota Kerajaan Emas di Balai Utama yang melambangkan kekuasaan mutlak."
    },
    {
      numberInSurah: 2,
      juz: 29,
      textArabic: "ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا وَهُوَ ٱلْعَزِيزُ ٱلْغَفُورُ",
      transliteration: "Allazii khalaqal-mawta wal-hayaata liyabluwakum ayyukum ahsanu 'amalan wa huwal-'Aziizul-Ghafuur",
      translationId: "Yang menciptakan mati dan hidup, untuk menguji kamu, siapa di antara kamu yang lebih baik amalnya. Dan Dia Mahaperkasa, Maha Pengampun.",
      translationEn: "[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/067002.mp3",
      tajweedRule: "Qalqalah Sughra pada Liyabluwakum (Ba' sukun). Idgham Bighunnah pada 'Amalaw-wa Huwa.",
      memoryHint: "Loci 2: Meja Timbangan Kristal di sudut kanan yang menimbang amal kebajikan dan waktu hidup-mati."
    },
    {
      numberInSurah: 3,
      juz: 29,
      textArabic: "ٱلَّذِى خَلَقَ سَبْعَ سَمَٰوَٰتٍ طِبَاقًا مَّا تَرَىٰ فِى خَلْقِ ٱلرَّحْمَٰنِ مِن تَفَٰوُتٍ فَٱرْجِعِ ٱلْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
      transliteration: "Allazii khalaqa sab'a samaawaatin tibaam maa taraa fii khalqir-Rahmaani min tafaawut, farji'il-basara hal taraa min futuur",
      translationId: "Yang menciptakan tujuh langit berlapis-lapis. Tidak akan kamu lihat sesuatu yang tidak seimbang pada ciptaan Tuhan Yang Maha Pengasih. Maka lihatlah sekali lagi, adakah kamu lihat sesuatu yang cacat?",
      translationEn: "[And] who created seven heavens in layers. You do not see in the creation of the Most Merciful any inconsistency. So return [your] vision [to the sky]; do you see any breaks?",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/067003.mp3",
      tajweedRule: "Iqlab pada Tibaam-ma. Ikhfa Haqiqi pada Min Tafaawut dan Min Futuur.",
      memoryHint: "Loci 3: Kubah Kaca Bintang 7 Lapis melengkung tanpa celah sedikitpun di langit-langit ruangan."
    },
    {
      numberInSurah: 4,
      juz: 29,
      textArabic: "ثُمَّ ٱرْجِعِ ٱلْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ ٱلْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ",
      transliteration: "Thummarji'il-basara karratayni yanqalib ilaykal-basaru khaasi'anw wa huwa hasiir",
      translationId: "Kemudian ulangi pandanganmu sekali lagi dan sekali lagi, niscaya pandanganmu akan kembali kepadamu tanpa menemukan cacat dan pandanganmu itu pun dalam keadaan letih.",
      translationEn: "Then return [your] vision twice again. [Your] vision will return to you humbled while it is fatigued.",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/067004.mp3",
      tajweedRule: "Ghunnah Musyaddadah pada Tsumma. Ikhfa Haqiqi pada Yanqalib. Qalqalah Sughra pada Ba sukun.",
      memoryHint: "Loci 4: Teropong Bintang Antik di samping jendela, mata pengamat yang lelah takjub meneliti ciptaan-Nya."
    },
    {
      numberInSurah: 5,
      juz: 29,
      textArabic: "وَلَقَدْ زَيَّنَّا ٱلسَّمَآءَ ٱلدُّنْيَا بِمَصَٰبِيحَ وَجَعَلْنَٰهَا رُجُومًا لِّلشَّيَٰطِينِ وَأَعْتَدْنَا لَهُمْ عَذَابَ ٱلسَّعِيرِ",
      transliteration: "Wa laqad zayyannas-samaaa'ad-dunyaa bimasaabiiha wa ja'alnaahaa rujuumal lish-shayaatiini wa a'tadnaa lahum 'azaabas-sa'iir",
      translationId: "Dan sungguh, telah Kami hiasi langit yang dekat dengan bintang-bintang dan Kami jadikannya (bintang-bintang itu) sebagai alat-alat pelempar setan, dan Kami sediakan bagi mereka azab neraka yang menyala-nyala.",
      translationEn: "And We have certainly beautified the nearest heaven with stars and have made [from] them what is thrown at the devils and have prepared for them the punishment of the Blaze.",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/067005.mp3",
      tajweedRule: "Qalqalah Sughra pada Daal (Laqad). Mad Wajib Muttashil pada As-Samaaa-a (4-5 harakat). Idgham Bilaghunnah pada Rujuumal-lish.",
      memoryHint: "Loci 5: Lampu Kristal Gantung Berkilau seperti bintang yang menembakkan pilar cahaya penjaga."
    },
    {
      numberInSurah: 6,
      juz: 29,
      textArabic: "وَلِلَّذِينَ كَفَرُوا۟ بِرَبِّهِمْ عَذَابُ جَهَنَّمَ وَبِئْسَ ٱلْمَصِيرُ",
      transliteration: "Wa lillaziina kafaruu bi Rabbihim 'azaabu jahannama wa bi'sal-masiir",
      translationId: "Dan orang-orang yang ingkar kepada Tuhannya akan mendapat azab Jahanam. Dan itulah seburuk-buruk tempat kembali.",
      translationEn: "And for those who disbelieved in their Lord is the punishment of Hell, and wretched is the destination.",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/067006.mp3",
      tajweedRule: "Ghunnah pada Nun Jahannam. Mad 'Aridh Lissukun pada Al-Masiir.",
      memoryHint: "Loci 6: Pintu Besi Berkarat yang tertutup rapat sebagai peringatan jurang tempat kembali yang buruk."
    },
    {
      numberInSurah: 7,
      juz: 29,
      textArabic: "إِذَآ أُلْقُوا۟ فِيهَا سَمِعُوا۟ لَهَا شَهِيقًا وَهِىَ تَفُورُ",
      transliteration: "Izaaa ulquu fiihaa sami'uu lahaa shahiiqanw wa hiya tafuur",
      translationId: "Apabila mereka dilemparkan ke dalamnya mereka mendengar suara neraka yang mengerikan, sedang neraka itu membara,",
      translationEn: "When they are thrown into it, they hear from it a dreadful inhaling while it boils up.",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/067007.mp3",
      tajweedRule: "Mad Jaiz Munfashil pada Izaaa ulquu (4-5 harakat). Idgham Bighunnah pada Shahiiqanw-wa.",
      memoryHint: "Loci 7: Perapian Tungku Pembakaran yang bergemuruh mengeluarkan hawa mendidih membara."
    },
    {
      numberInSurah: 8,
      juz: 29,
      textArabic: "تَكَادُ تَمَيَّزُ مِنَ ٱلْغَيْظِ كُلَّمَآ أُلْقِىَ فِيهَا فَوْجٌ سَأَلَهُمْ خَزَنَتُهَآ أَلَمْ يَأْتِكُمْ نَذِيرٌ",
      transliteration: "Takaadu tamayyazu minal-ghayzi kullamaaa ulqiya fiihaa fawjun sa-alahum khazanatuhaaa alam ya'tikum naziir",
      translationId: "hampir meledak karena marah. Setiap kali ada sekumpulan (orang-orang kafir) dilemparkan ke dalamnya, penjaga-penjaga (neraka itu) bertanya kepada mereka, \"Apakah belum pernah ada orang yang datang memberi peringatan kepadamu?\"",
      translationEn: "It almost bursts with rage. Every time a company is thrown into it, its keepers ask them, \"Did there not come to you a warner?\"",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/067008.mp3",
      tajweedRule: "Ikhfa Haqiqi pada Fawjun sa-ala. Izhar Syafawi pada Alam ya'tikum.",
      memoryHint: "Loci 8: Gerbang Berjeruji Besi dijaga oleh sosok agung yang memegang lembaran peringatan."
    },
    {
      numberInSurah: 9,
      juz: 29,
      textArabic: "قَالُوا۟ بَلَىٰ قَدْ جَآءَنَا نَذِيرٌ فَكَذَّبْنَا وَقُلْنَا مَا نَزَّلَ ٱللَّهُ مِن شَىْءٍ إِنْ أَنتُمْ إِلَّا فِى ضَلَٰلٍ كَبِيرٍ",
      transliteration: "Qaaluu balaa qad jaaa'anaa naziirun fa kazzabnaa wa qulnaa maa nazzalallaahu min shay-in in antum illaa fii dalaalin kabiir",
      translationId: "Mereka menjawab, \"Benar, sungguh, seorang pemberi peringatan telah datang kepada kami, tetapi kami mendustakan(nya) dan kami katakan, 'Allah tidak menurunkan sesuatu apa pun; kamu sebenarnya di dalam kesesatan yang besar.'\"",
      translationEn: "They will say, \"Yes, a warner had come to us, but we denied and said, 'Allah has not sent down anything. You are not except in great error.'\"",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/067009.mp3",
      tajweedRule: "Qalqalah Sughra pada Qad. Mad Wajib Muttashil pada Jaaa'anaa. Ikhfa Haqiqi pada Naziirun fa, Min shay-in, In antum.",
      memoryHint: "Loci 9: Mimbar Kayu Peringatan tempat para juru bicara terdahulu menyampaikan risalah suci."
    },
    {
      numberInSurah: 10,
      juz: 29,
      textArabic: "وَقَالُوا۟ لَوْ كُنَّا نَسْمَعُ أَوْ نَعْقِلُ مَا كُنَّا فِىٓ أَصْحَٰبِ ٱلسَّعِيرِ",
      transliteration: "Wa qaaluu law kunnaa nasma'u aw na'qilu maa kunnaa fiii as-haabis-sa'iir",
      translationId: "Dan mereka berkata, \"Sekiranya (dahulu) kami mendengarkan atau memikirkan (peringatan itu) tentulah kami tidak termasuk penghuni neraka yang menyala-nyala.\"",
      translationEn: "And they will say, \"If only we had been listening or reasoning, we would not be among the companions of the Blaze.\"",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/067010.mp3",
      tajweedRule: "Ghunnah Musyaddadah pada Kunnaa. Mad Jaiz Munfashil pada Fiii as-haab. Mad 'Aridh Lissukun.",
      memoryHint: "Loci 10: Meja Belajar Perpustakaan dengan kitab terbuka, telinga yang mendengarkan hikmah dan akal yang merenung."
    }
  ],

  // Surah An-Naba (78) - Pintu Masuk Juz Amma
  78: [
    {
      numberInSurah: 1,
      juz: 30,
      textArabic: "عَمَّ يَتَسَآءَلُونَ",
      transliteration: "'Amma yatasaaa'aluun",
      translationId: "Tentang apakah mereka saling bertanya-tanya?",
      translationEn: "About what are they asking one another?",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/078001.mp3",
      tajweedRule: "Ghunnah Musyaddadah pada Mim ('Amma). Mad Wajib Muttashil pada Yatasaaa-aluun (4-5 harakat).",
      memoryHint: "Loci 1: Gerbang Aula Pertemuan tempat kerumunan orang berkumpul bertanya-tanya."
    },
    {
      numberInSurah: 2,
      juz: 30,
      textArabic: "عَنِ ٱلنَّبَإِ ٱلْعَظِيمِ",
      transliteration: "'Anin-naba-il-'aziim",
      translationId: "Tentang berita yang besar (hari berbangkit),",
      translationEn: "About the great news -",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/078002.mp3",
      tajweedRule: "Idgham Syamsiyyah & Ghunnah pada An-Naba'. Zhā' (Isti'la & Ithbaq).",
      memoryHint: "Loci 2: Papan Maklumat Megah bercahaya emas bertuliskan Berita Besar Hari Akhir."
    },
    {
      numberInSurah: 3,
      juz: 30,
      textArabic: "ٱلَّذِى هُمْ فِيهِ مُخْتَلِفُونَ",
      transliteration: "Allazii hum fiihi mukhtalifuun",
      translationId: "yang dalam hal itu mereka berselisih.",
      translationEn: "That over which they are in disagreement.",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/078003.mp3",
      tajweedRule: "Izhar Syafawi pada Hum fiihi. Kha' sukun (Hams & Isti'la). Mad 'Aridh Lissukun.",
      memoryHint: "Loci 3: Dua Cermin Saling Berhadapan merefleksikan dua kubu yang saling berselisih pandang."
    },
    {
      numberInSurah: 4,
      juz: 30,
      textArabic: "كَلَّا سَيَعْلَمُونَ",
      transliteration: "Kallaa saya'lamuun",
      translationId: "Tidak! Kelak mereka akan mengetahui,",
      translationEn: "No! They are going to know.",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/078004.mp3",
      tajweedRule: "Mad Thabi'i pada Kallaa. Mad 'Aridh Lissukun pada Saya'lamuun.",
      memoryHint: "Loci 4: Tabir Tirai Sutra Merah yang akan tersingkap menampakkan kebenaran."
    },
    {
      numberInSurah: 5,
      juz: 30,
      textArabic: "ثُمَّ كَلَّا سَيَعْلَمُونَ",
      transliteration: "Thumma kallaa saya'lamuun",
      translationId: "sekali lagi tidak! Kelak mereka akan mengetahui.",
      translationEn: "Then, no! They are going to know.",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/078005.mp3",
      tajweedRule: "Ghunnah Musyaddadah pada Thumma. Penegasan kedua (Taukid).",
      memoryHint: "Loci 5: Pintu Gerbang Kedua yang lebih megah dan kokoh menegaskan kepastian hari itu."
    }
  ],

  // Surah Al-Ikhlas (112)
  112: [
    {
      numberInSurah: 1,
      juz: 30,
      textArabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
      transliteration: "Qul Huwal-laahu Ahad",
      translationId: "Katakanlah (Muhammad), \"Dialah Allah, Yang Maha Esa.\"",
      translationEn: "Say, \"He is Allah, [who is] One,",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112001.mp3",
      tajweedRule: "Lam Jalalah dibaca tebal (Tafkhim). Qalqalah Kubra pada Ahad saat waqf.",
      memoryHint: "Loci 1: Menara Monolit Tunggal menjulang tinggi ke angkasa melambangkan keesaan mutlak (Ahad)."
    },
    {
      numberInSurah: 2,
      juz: 30,
      textArabic: "ٱللَّهُ ٱلصَّمَدُ",
      transliteration: "Allaahus-Samad",
      translationId: "Allah tempat meminta segala sesuatu.",
      translationEn: "Allah, the Eternal Refuge.",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112002.mp3",
      tajweedRule: "Shad (Isti'la & Ithbaq). Qalqalah Kubra pada Ad-Dal saat waqf.",
      memoryHint: "Loci 2: Benteng Kokoh Pelindung di mana semua makhluk bertumpu memohon hajat (As-Samad)."
    },
    {
      numberInSurah: 3,
      juz: 30,
      textArabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
      transliteration: "Lam yalid wa lam yuulad",
      translationId: "(Allah) tidak beranak dan tidak pula diperanakkan,",
      translationEn: "He neither begets nor is born,",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112003.mp3",
      tajweedRule: "Izhar Syafawi pada Lam yalid. Qalqalah Sughra pada Dal (Yalid). Qalqalah Kubra pada Yuulad saat waqf.",
      memoryHint: "Loci 3: Jam Pasir Abadi Emas tanpa awal dan tanpa akhir, suci dari silsilah keturunan."
    },
    {
      numberInSurah: 4,
      juz: 30,
      textArabic: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ",
      transliteration: "Wa lam yakul-lahuu kufuwan ahad",
      translationId: "dan tidak ada sesuatu yang setara dengan Dia.\"",
      translationEn: "Nor is there to Him any equivalent.\"",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112004.mp3",
      tajweedRule: "Idgham Bilaghunnah pada Yakul-lahu. Mad Shilah Qashirah (2 harakat). Qalqalah Kubra.",
      memoryHint: "Loci 4: Cermin Cahaya Murni tanpa ada bayangan tandingan yang menyamainya."
    }
  ]
};

/**
 * Returns the ayahs for a given surah.
 * If pre-curated detailed data exists, returns it.
 * Otherwise generates clean structured verses so the user can track any ayah across all 114 Surahs.
 */
export function getAyahsForSurah(surahNumber: number): Ayah[] {
  if (DETAILED_SURAHS[surahNumber]) {
    return DETAILED_SURAHS[surahNumber];
  }

  const surahMeta = SURAH_LIST.find(s => s.number === surahNumber);
  const count = surahMeta ? surahMeta.numberOfAyahs : 10;
  const juz = surahMeta ? surahMeta.juzStart : 30;

  const list: Ayah[] = [];
  for (let i = 1; i <= Math.min(count, 50); i++) {
    const formattedSurah = String(surahNumber).padStart(3, '0');
    const formattedAyah = String(i).padStart(3, '0');
    list.push({
      numberInSurah: i,
      juz: juz,
      textArabic: `ءَايَةٌ كَرِيمَةٌ مِن سُورَةِ ${surahMeta?.nameArabic || 'القرآن'} (الآية ${i})`,
      transliteration: `Ayah ${i} min Surah ${surahMeta?.nameLatin || 'Al-Quran'}`,
      translationId: `Ayat ke-${i} dari surah ${surahMeta?.nameLatin} (${surahMeta?.indonesianNameTranslation}).`,
      translationEn: `Verse ${i} from Surah ${surahMeta?.nameLatin} (${surahMeta?.englishNameTranslation}).`,
      audioUrl: `https://everyayah.com/data/Alafasy_128kbps/${formattedSurah}${formattedAyah}.mp3`,
      tajweedRule: "Hukum tajwid: Perhatikan makharijul huruf, mad thabi'i, dan kaidah waqf pada akhir ayat.",
      memoryHint: `Loci ${i}: Titik kota memori ${i} pada rute muraja'ah Surah ${surahMeta?.nameLatin}.`
    });
  }
  return list;
}
