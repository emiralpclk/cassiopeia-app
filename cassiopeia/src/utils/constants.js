export const ZODIAC_SIGNS = [
  { id: 'aries', name: 'Koç', emoji: '♈', element: 'Ateş', date: '21 Mar - 19 Nis' },
  { id: 'taurus', name: 'Boğa', emoji: '♉', element: 'Toprak', date: '20 Nis - 20 May' },
  { id: 'gemini', name: 'İkizler', emoji: '♊', element: 'Hava', date: '21 May - 20 Haz' },
  { id: 'cancer', name: 'Yengeç', emoji: '♋', element: 'Su', date: '21 Haz - 22 Tem' },
  { id: 'leo', name: 'Aslan', emoji: '♌', element: 'Ateş', date: '23 Tem - 22 Ağu' },
  { id: 'virgo', name: 'Başak', emoji: '♍', element: 'Toprak', date: '23 Ağu - 22 Eyl' },
  { id: 'libra', name: 'Terazi', emoji: '♎', element: 'Hava', date: '23 Eyl - 22 Eki' },
  { id: 'scorpio', name: 'Akrep', emoji: '♏', element: 'Su', date: '23 Eki - 21 Kas' },
  { id: 'sagittarius', name: 'Yay', emoji: '♐', element: 'Ateş', date: '22 Kas - 21 Ara' },
  { id: 'capricorn', name: 'Oğlak', emoji: '♑', element: 'Toprak', date: '22 Ara - 19 Oca' },
  { id: 'aquarius', name: 'Kova', emoji: '♒', element: 'Hava', date: '20 Oca - 18 Şub' },
  { id: 'pisces', name: 'Balık', emoji: '♓', element: 'Su', date: '19 Şub - 20 Mar' },
];

export const AGE_RANGES = [
  { id: '18-24', label: '18-24' },
  { id: '25-34', label: '25-34' },
  { id: '35-44', label: '35-44' },
  { id: '45-54', label: '45-54' },
  { id: '55+', label: '55 ve üzeri' }
];

export const RELATIONSHIP_STATUSES = [
  { id: 'single', label: 'Bekar', emoji: '💫' },
  { id: 'relationship', label: 'İlişkide', emoji: '💕' },
  { id: 'married', label: 'Evli', emoji: '💍' },
  { id: 'complicated', label: 'Karmaşık', emoji: '🌀' },
];

export const FORTUNE_TYPES = [
  { id: 'coffee', name: 'Kahve Falı', emoji: '☕', description: 'Fincanındaki sembolleri oku', available: true },
  { id: 'tarot', name: 'Tarot', emoji: '🃏', description: 'Kartlardan geleceğe bak', available: true },
  { id: 'dream', name: 'Rüya Yorumu', emoji: '🌙', description: 'Rüyanın anlamını keşfet', available: false, phase: 2 },
  { id: 'numerology', name: 'Numeroloji', emoji: '🔢', description: 'Sayıların sırrını öğren', available: false, phase: 3 },
  { id: 'compatibility', name: 'Burç Uyumu', emoji: '♈', description: 'İki burcun uyumuna bak', available: false, phase: 3 },
  { id: 'palm', name: 'El Falı', emoji: '✋', description: 'Avucundaki çizgileri oku', available: false, phase: 3 },
];

export const TAROT_SLOTS = [
  { id: 'past', nameTr: 'Geçmiş', icon: 'history' },
  { id: 'present', nameTr: 'Şu An', icon: 'visibility' },
  { id: 'future', nameTr: 'Gelecek', icon: 'auto_awesome' },
];

export const TAROT_DECK = [
  { id: 0, name: 'The Fool', nameTr: 'Deli', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar00.jpg', meaning: 'Yeni başlangıçlar, masumiyet, spontanlık, özgür ruh' },
  { id: 1, name: 'The Magician', nameTr: 'Sihirbaz', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar01.jpg', meaning: 'İrade gücü, yaratıcılık, beceri, konsantrasyon' },
  { id: 2, name: 'The High Priestess', nameTr: 'Başrahibe', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar02.jpg', meaning: 'Sezgi, bilinçaltı, gizem, içsel bilgelik' },
  { id: 3, name: 'The Empress', nameTr: 'İmparatoriçe', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar03.jpg', meaning: 'Bereket, annelik, doğa, bolluk, şefkat' },
  { id: 4, name: 'The Emperor', nameTr: 'İmparator', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar04.jpg', meaning: 'Otorite, yapı, kontrol, baba figürü' },
  { id: 5, name: 'The Hierophant', nameTr: 'Aziz', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar05.jpg', meaning: 'Gelenek, maneviyat, rehberlik, education' },
  { id: 6, name: 'The Lovers', nameTr: 'Aşıklar', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar06.jpg', meaning: 'Aşk, uyum, ilişkiler, değerler, seçimler' },
  { id: 7, name: 'The Chariot', nameTr: 'Savaş Arabası', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar07.jpg', meaning: 'İrade, zafer, kararlılık, kontrol' },
  { id: 8, name: 'Strength', nameTr: 'Güç', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar08.jpg', meaning: 'Cesaret, sabır, içsel güç, yumuşak güç' },
  { id: 9, name: 'The Hermit', nameTr: 'Ermiş', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar09.jpg', meaning: 'İçsel arayış, yalnızlık, bilgelik, rehberlik' },
  { id: 10, name: 'Wheel of Fortune', nameTr: 'Kader Çarkı', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar10.jpg', meaning: 'Döngüler, kader, dönüm noktası, şans' },
  { id: 11, name: 'Justice', nameTr: 'Adalet', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar11.jpg', meaning: 'Adalet, denge, dürüstlük, sorumluluk' },
  { id: 12, name: 'The Hanged Man', nameTr: 'Asılan Adam', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar12.jpg', meaning: 'Teslimiyet, farklı bakış açısı, bekleme, fedakarlık' },
  { id: 13, name: 'Death', nameTr: 'Ölüm', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar13.jpg', meaning: 'Dönüşüm, son ve başlangıç, değişim, geçiş' },
  { id: 14, name: 'Temperance', nameTr: 'Denge', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar14.jpg', meaning: 'Denge, ılımlılık, sabır, uyum, iyileşme' },
  { id: 15, name: 'The Devil', nameTr: 'Şeytan', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar15.jpg', meaning: 'Bağımlılık, tutku, maddecilik, gölge benlik' },
  { id: 16, name: 'The Tower', nameTr: 'Kule', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar16.jpg', meaning: 'Yıkım, ani değişim, uyanış, kurtuluş' },
  { id: 17, name: 'The Star', nameTr: 'Yıldız', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar17.jpg', meaning: 'Umut, ilham, huzur, iyileşme, inanç' },
  { id: 18, name: 'The Moon', nameTr: 'Ay', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar18.jpg', meaning: 'Yanılsama, korku, bilinçaltı, sezgi, belirsizlik' },
  { id: 19, name: 'The Sun', nameTr: 'Güneş', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar19.jpg', meaning: 'Başarı, neşe, canlılık, aydınlanma, mutluluk' },
  { id: 20, name: 'Judgement', nameTr: 'Mahkeme', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar20.jpg', meaning: 'Yargılama, yenilenme, uyanış, af, çağrı' },
  { id: 21, name: 'The World', nameTr: 'Dünya', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar21.jpg', meaning: 'Tamamlanma, bütünlük, başarı, kutlama, yolculuk' },
];