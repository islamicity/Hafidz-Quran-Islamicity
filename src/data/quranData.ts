/**
 * Quran Data Catalog & Ayah Dataset
 * Full 114 Surahs with comprehensive verses for core memorization blueprints
 */
import { Surah, Ayah } from '../types';
import { SURAH_AR_RAHMAN_AYAHS } from './surahArRahman';

import { ALL_114_SURAHS } from './allSurahsList';
import allQuranAyahsData from './allQuranAyahs.json';

export const SURAH_LIST: Surah[] = ALL_114_SURAHS;

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
  ],

  // Surah Ar-Rahman (55) - Otentik 78 Ayat Lengkap
  55: SURAH_AR_RAHMAN_AYAHS
};

/**
 * Returns authentic, genuine Quran ayahs for any of the 114 Surahs.
 * Priority:
 * 1. DETAILED_SURAHS if handcrafted loci/tajweed annotations are available (e.g. Al-Fatihah, Al-Mulk, Al-Ikhlas, Ar-Rahman)
 * 2. allQuranAyahsData containing all 114 surahs with authentic Arabic Uthmani script, latin transliteration, Indonesian translation, and recitation audio.
 */
export function getAyahsForSurah(surahNumber: number): Ayah[] {
  if (DETAILED_SURAHS[surahNumber]) {
    return DETAILED_SURAHS[surahNumber];
  }

  const allAyahsMap = allQuranAyahsData as unknown as Record<string, Ayah[]>;
  const authentic = allAyahsMap[String(surahNumber)];
  if (authentic && authentic.length > 0) {
    return authentic;
  }

  return [];
}
