/**
 * Blueprint Kota Memori Data & Guidance
 * Based on "Blueprint Kota Memori: Mulai Menghafal di Hari Pertama" & "Sistem Hafal Quran (SHQ)"
 */
import { MemoryPalaceRoom } from '../types';

export interface MethodStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  duration: string;
  actionGuidance: string;
  adultTip: string;
  iconName: string;
}

export const ISTANA_MEMORI_STEPS: MethodStep[] = [
  {
    stepNumber: 1,
    title: "Tahap 1: Pemilihan Fondasi Ruangan (Spatial Foundation)",
    subtitle: "Pilih 1 lokasi yang sangat familiar dalam kehidupan sehari-hari",
    duration: "2-3 Menit",
    actionGuidance: "Pilihlah ruangan yang Anda kenal tanpa perlu berpikir keras: Kamar Tidur Utama, Masjid Lingkungan, Ruang Tamu Masa Kecil, atau Ruang Kerja Kantor. Bayangkan Anda sedang berdiri di ambang pintu masuk utama.",
    adultTip: "Bagi orang dewasa yang sibuk: Jangan gunakan tempat khayalan baru. Otak visual Anda sudah memetakan rumah Anda selama bertahun-tahun. Kita hanya menaruh 'harta karun ayat' ke rak yang sudah ada.",
    iconName: "Home"
  },
  {
    stepNumber: 2,
    title: "Tahap 2: Pemetaan 10 Titik Loci Urut Searah Jarum Jam",
    subtitle: "Tentukan urutan titik perhentian permanen yang tidak boleh berubah",
    duration: "3-5 Menit",
    actionGuidance: "Mulai dari pintu masuk, tatap sekeliling searah jarum jam (Clockwise): Titik 1: Daun Pintu Masuk, Titik 2: Jam Dinding, Titik 3: Meja Kerja, Titik 4: Jendela Kaca, Titik 5: Rak Kitab, Titik 6: Sofa, Titik 7: Lampu Sudut, Titik 8: Karpet Sajadah, Titik 9: Lemari Pakaian, Titik 10: Saklar Lampu.",
    adultTip: "Jaga jarak antar titik minimal 1 meter agar gambar mental tidak bertumpuk atau membingungkan memori.",
    iconName: "MapPin"
  },
  {
    stepNumber: 3,
    title: "Tahap 3: Kodifikasi Asosiasi Visual & Emosi Kuat (Encoding)",
    subtitle: "Ubah kata kunci ayat menjadi adegan visual yang dramatis dan unik",
    duration: "5 Menit",
    actionGuidance: "Otak manusia mengingat kejanggalan, kebesaran, dan emosi, bukan sekadar teks hitam-putih. Contoh: Al-Mulk Ayat 1 ('Biyadihil Mulk' - Di tangan-Nya segala kerajaan): Bayangkan tangan raksasa emas bercahaya memegang mahkota kerajaan megah menancap di Daun Pintu Masuk Anda.",
    adultTip: "Jika Anda sulit menghafal lafaz, kuatkan visualisasinya terlebih dahulu. Begitu visualnya terpanggil, lidah akan otomatis melanjutkan bacaan tajwidnya.",
    iconName: "Sparkles"
  },
  {
    stepNumber: 4,
    title: "Tahap 4: Mental Walk Interaktif & Muraja'ah Imersif (Recall)",
    subtitle: "Berjalanlah secara imajinatif dari Titik 1 ke Titik 10 sambil melafalkan ayat",
    duration: "5 Menit",
    actionGuidance: "Tutup mata sejenak atau ikuti visualizer kota di aplikasi. Berjalanlah dari pintu masuk ke jam dinding, lalu ke meja. Lafalkan ayat pada setiap titik. Uji juga berjalan mundur dari Titik 10 ke Titik 1 untuk memastikan hafalan mutqin tanpa tergantung urutan kaku.",
    adultTip: "Dapat dilakukan saat commute di kereta, menyetir, atau sebelum tidur malam selama 5 menit tanpa perlu memegang mushaf fisik.",
    iconName: "Footprints"
  },
  {
    stepNumber: 5,
    title: "Tahap 5: Penguncian Mutqin (Spaced Repetition Protocol)",
    subtitle: "Kunci hafalan di memori jangka panjang (LTM) dengan jadwal berjarak ilmiah",
    duration: "H+1, H+3, H+7, H+14, H+30",
    actionGuidance: "Hafalan hari pertama akan terlupakan 70% bila tidak ditinjau ulang dalam 24 jam (Ebbinghaus Forgetting Curve). Jalankan review singkat 2 menit pada H+1 (esok Subuh), H+3, H+7, H+14, dan H+30. Sistem aplikasi kami akan otomatis menandai jadwalnya.",
    adultTip: "Cukup 2-3 menit per sesi review. Konsistensi harian jauh melipatgandakan hasil dibanding belajar maraton 2 jam seminggu sekali.",
    iconName: "CalendarClock"
  }
];

export const PRECONFIGURED_ROOMS: MemoryPalaceRoom[] = [
  {
    id: "palace-al-mulk",
    surahNumber: 67,
    surahName: "Surah Al-Mulk (Ayat 1-10)",
    roomName: "Paviliun Singgasana Mulk & Langit Bintang",
    theme: "Royal Islamic Palace & Astronomy Observation Hall",
    description: "Ruang istana bertingkat dengan kubah langit transparan, pilar marmer andalusia, dan lentera galaksi untuk mengunci 10 ayat pertama Surah Penyelamat Siksa Kubur.",
    loci: [
      {
        id: "mulk-1",
        locusNumber: 1,
        title: "Pintu Gerbang Utama Emas",
        description: "Pintu gerbang berukir emas tebal menyambut kedatangan.",
        ayahTarget: 1,
        visualAnchor: "Tangan Raksasa Emas menggenggam Singgasana Kerajaan Megah",
        mnemonicStory: "Ayat 1 (تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ): Anda memegang gagang pintu emas, lalu muncul kilau tangan mulia yang memegang singgasana raja alam semesta. Kuasanya meliputi segala sesuatu.",
        coordinates: { x: 18, y: 78 }
      },
      {
        id: "mulk-2",
        locusNumber: 2,
        title: "Jam Bandul & Timbangan Kristal",
        description: "Jam kuno berdetik di samping timbangan keadilan amal.",
        ayahTarget: 2,
        visualAnchor: "Dua cawan timbangan: Kematian (Maut) berwarna perak & Kehidupan (Hayah) berwarna hijau zamrud",
        mnemonicStory: "Ayat 2 (الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا): Jam bandul berbunyi 'tik-tok' menguji amal siapa yang terbaik di hadapan Al-'Aziz Al-Ghafur.",
        coordinates: { x: 30, y: 64 }
      },
      {
        id: "mulk-3",
        locusNumber: 3,
        title: "Kubah Langit Kaca Tujuh Lapis",
        description: "Kubah langit-langit raksasa tanpa sekat atau tiang pengganjal.",
        ayahTarget: 3,
        visualAnchor: "7 kubah kaca bertingkat sempurna tanpa celah retak (Tafawut / Futuur)",
        mnemonicStory: "Ayat 3 (الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا): Anda menengadah melihat tujuh lapis langit ciptaan Ar-Rahman, Anda mencari-cari apakah ada cacat atau retak? Sama sekali tidak ada!",
        coordinates: { x: 50, y: 35 }
      },
      {
        id: "mulk-4",
        locusNumber: 4,
        title: "Teropong Bintang Kuningan Antik",
        description: "Teropong astronomi kuno menghadap jendela luar angkasa.",
        ayahTarget: 4,
        visualAnchor: "Mata pengamat yang lelah dan tunduk takjub setelah melihat berulang kali (Karratayn)",
        mnemonicStory: "Ayat 4 (ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ): Anda mengarahkan teropong dua kali lagi, mata Anda kembali dalam keadaan letih dan terpana kagum.",
        coordinates: { x: 72, y: 42 }
      },
      {
        id: "mulk-5",
        locusNumber: 5,
        title: "Lampu Kristal Meteorit Gantung",
        description: "Chandelier berlian yang memancarkan pendar bintang pelindung.",
        ayahTarget: 5,
        visualAnchor: "Bintang-bintang bercahaya indah (Masabih) yang menembakkan panah cahaya penghalau setan",
        mnemonicStory: "Ayat 5 (وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ): Langit dunia dihiasi lentera bintang indah pemanah godaan setan menuju azab As-Sa'ir.",
        coordinates: { x: 62, y: 22 }
      },
      {
        id: "mulk-6",
        locusNumber: 6,
        title: "Pintu Besi Berkarat Bawah Tanah",
        description: "Pintu gerbang tebal terkunci rapat ke ruang tahanan dingin.",
        ayahTarget: 6,
        visualAnchor: "Batu hitam bertuliskan peringatan azab Jahanam bagi mereka yang ingkar",
        mnemonicStory: "Ayat 6 (وَلِلَّذِينَ كَفَرُوا بِرَبِّهِمْ عَذَابُ جَهَنَّمَ وَبِئْسَ الْمَصِيرُ): Pintu besi bergetar mengingatkan tempat kembali yang paling buruk bagi pembangkang.",
        coordinates: { x: 82, y: 55 }
      },
      {
        id: "mulk-7",
        locusNumber: 7,
        title: "Tungku Perapian Gejolak Merah",
        description: "Tungku api bergemuruh dengan asap mendidih.",
        ayahTarget: 7,
        visualAnchor: "Suara raungan menggelegar mengerikan saat sesuatu dilemparkan ke dalamnya (Shahiqan wa hiya tafuur)",
        mnemonicStory: "Ayat 7 (إِذَا أُلْقُوا فِيهَا سَمِعُوا لَهَا شَهِيقًا وَهِيَ تَفُورُ): Anda mendengar suara tarikan napas menggeram tajam dari api yang mendidih membakar.",
        coordinates: { x: 78, y: 75 }
      },
      {
        id: "mulk-8",
        locusNumber: 8,
        title: "Pos Penjaga Malaikat Tegas",
        description: "Meja komando dijaga sosok penjaga berwibawa agung (Khazanatuha).",
        ayahTarget: 8,
        visualAnchor: "Penjaga memegang buku tanya: 'Alam ya'tikum Nadzir?' (Belumkah datang pemberi peringatan?)",
        mnemonicStory: "Ayat 8 (تَكَادُ تَمَيَّزُ مِنَ الْغَيْظِ كُلَّمَا أُلْقِيَ فِيهَا فَوْجٌ سَأَلَهُمْ خَزَنَتُهَا أَلَمْ يَأْتِكُمْ نَذِيرٌ): Penjaga gerbang bertanya kepada setiap rombongan yang digiring masuk.",
        coordinates: { x: 60, y: 88 }
      },
      {
        id: "mulk-9",
        locusNumber: 9,
        title: "Mimbar Peringatan Berpahat Kitab",
        description: "Mimbar kayu jati tempat para nabi dan utusan menyampaikan kabar.",
        ayahTarget: 9,
        visualAnchor: "Lembaran risalah peringatan yang pernah ditolak dengan perkataan dusta",
        mnemonicStory: "Ayat 9 (قَالُوا بَلَىٰ قَدْ جَاءَنَا نَذِيرٌ فَكَذَّبْنَا وَقُلْنَا مَا نَزَّلَ اللَّهُ مِن شَيْءٍ): Penyesalan mendalam mengakui bahwa mereka dulu mendustakan peringatan para rasul.",
        coordinates: { x: 38, y: 86 }
      },
      {
        id: "mulk-10",
        locusNumber: 10,
        title: "Meja Baca & Lentera Akal Budi",
        description: "Meja belajar dengan kitab terbuka dan cangkir hening kontemplasi.",
        ayahTarget: 10,
        visualAnchor: "Simbol Telinga yang Menyimak (Nasma'u) dan Lentera Akal yang Memahami (Na'qilu)",
        mnemonicStory: "Ayat 10 (وَقَالُوا لَوْ كُنَّا نَسْمَعُ أَوْ نَعْقِلُ مَا كُنَّا فِي أَصْحَابِ السَّعِيرِ): Anda duduk di meja merenungi pentingnya mendengarkan dan menggunakan akal agar terhindar dari siksa.",
        coordinates: { x: 25, y: 82 }
      }
    ]
  },
  {
    id: "palace-al-fatihah",
    surahNumber: 1,
    surahName: "Surah Al-Fatihah (Ayat 1-7)",
    roomName: "Pelataran Ka'bah & Cahaya Ummul Kitab",
    theme: "Sacred Sanctuary Courtyard",
    description: "Tujuh titik loci di sekitar pelataran suci untuk mengukuhkan penghayatan Ummul Kitab dalam setiap rakaat shalat.",
    loci: [
      {
        id: "fatihah-1",
        locusNumber: 1,
        title: "Gerbang Babus Salam",
        description: "Pintu masuk pelataran suci dengan tulisan Basmalah bercahaya.",
        ayahTarget: 1,
        visualAnchor: "Lafaz Basmalah terpahat di marmer putih bersih meneteskan air sejuk.",
        mnemonicStory: "Bismillahir-Rahmanir-Rahim: Memulai setiap langkah dengan nama Allah Pengasih dan Penyayang.",
        coordinates: { x: 15, y: 50 }
      },
      {
        id: "fatihah-2",
        locusNumber: 2,
        title: "Pancuran Air Mancur Syukur",
        description: "Pancuran zam-zam melambangkan pujian abadi seluruh semesta.",
        ayahTarget: 2,
        visualAnchor: "Aliran air jernih berkilau melambangkan Rabbil-'Alamin.",
        mnemonicStory: "Alhamdu lillahi Rabbil-'alamin: Segala puji meluap bagi Sang Pemelihara seluruh galaksi dan makhluk.",
        coordinates: { x: 30, y: 35 }
      },
      {
        id: "fatihah-3",
        locusNumber: 3,
        title: "Taman Kurma Naungan Rahmat",
        description: "Pohon kurma rindang menaungi peziarah dari terik matahari.",
        ayahTarget: 3,
        visualAnchor: "Dua pilar hijau berhias emas bertuliskan Ar-Rahman dan Ar-Rahim.",
        mnemonicStory: "Ar-Rahmanir-Rahim: Kasih sayang Allah yang membentang luas tanpa batas.",
        coordinates: { x: 50, y: 25 }
      },
      {
        id: "fatihah-4",
        locusNumber: 4,
        title: "Menara Jam Waktu Abadi",
        description: "Menara jam tinggi melambangkan hisab hari pembalasan.",
        ayahTarget: 4,
        visualAnchor: "Timbangan emas raksasa penentu amal di Hari Pembalasan.",
        mnemonicStory: "Maliki Yawmid-Din: Dialah satu-satunya Raja Berkuasa di Hari Perhitungan.",
        coordinates: { x: 70, y: 30 }
      },
      {
        id: "fatihah-5",
        locusNumber: 5,
        title: "Mihrab Bersujud & Bermunajat",
        description: "Tempat menundukkan dahi dan mengangkat kedua telapak tangan.",
        ayahTarget: 5,
        visualAnchor: "Dua telapak tangan menengadah menghadap kiblat dengan penuh keikhlasan.",
        mnemonicStory: "Iyyaka na'budu wa iyyaka nasta'in: Hanya kepada-Mu kami beribadah dan memohon bantuan.",
        coordinates: { x: 80, y: 55 }
      },
      {
        id: "fatihah-6",
        locusNumber: 6,
        title: "Jalan Lurus Mercusuar Cahaya",
        description: "Lintasan lurus bercahaya tanpa belokan atau rintangan.",
        ayahTarget: 6,
        visualAnchor: "Garis marmer putih memancar menuju pintu ridha Allah.",
        mnemonicStory: "Ihdinas-siratal-mustaqim: Bimbinglah langkah kami meniti jalan yang paling lurus dan teguh.",
        coordinates: { x: 60, y: 75 }
      },
      {
        id: "fatihah-7",
        locusNumber: 7,
        title: "Gerbang Rombongan Beroleh Nikmat",
        description: "Gerbang kemuliaan para nabi, shiddiqin, syuhada, dan shalihin.",
        ayahTarget: 7,
        visualAnchor: "Cahaya para pendahulu saleh, terlindung dari kemurkaan dan kesesatan.",
        mnemonicStory: "Siratalladzina an'amta 'alayhim ghayril-maghdubi 'alayhim wa lad-dallin.",
        coordinates: { x: 35, y: 75 }
      }
    ]
  }
];
