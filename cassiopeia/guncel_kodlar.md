### src/context/AppContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';
import { getApiKey, getUserProfile, getHistory, setApiKey as saveApiKey, setUserProfile, addToHistory as saveToHistory } from '../services/storage';

const AppContext = createContext(null);
const AppDispatchContext = createContext(null);

const initialState = {
  apiKey: '',
  user: null, 
  currentFortune: {
    step: 'intent',
    intent: '',
    imageData: null,
    coffeeResult: null,
    selectedTarotCards: [],
    synthesisResult: null,
  },
  history: [],
  showApiKeyModal: false,
  showOnboarding: false,
  isLoading: false,
  error: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_API_KEY':
      saveApiKey(action.payload);
      return { ...state, apiKey: action.payload, showApiKeyModal: false };
    case 'SET_USER':
      setUserProfile(action.payload);
      return { ...state, user: action.payload, showOnboarding: false };
    case 'TOGGLE_API_KEY_MODAL':
      return { ...state, showApiKeyModal: !state.showApiKeyModal };
    case 'SHOW_API_KEY_MODAL':
      return { ...state, showApiKeyModal: action.payload };
    case 'SHOW_ONBOARDING':
      return { ...state, showOnboarding: action.payload };
    case 'SET_INTENT':
      return { ...state, currentFortune: { ...state.currentFortune, intent: action.payload, step: 'upload' } };
    case 'SET_IMAGE':
      return { ...state, currentFortune: { ...state.currentFortune, imageData: action.payload, step: 'analyzing' } };
    case 'SET_COFFEE_RESULT':
      return { ...state, currentFortune: { ...state.currentFortune, coffeeResult: action.payload, step: 'results' }, isLoading: false };
    case 'GO_TO_BRIDGE':
      return { ...state, currentFortune: { ...state.currentFortune, step: 'bridge' } };
    case 'SET_TAROT_CARDS':
      return { ...state, currentFortune: { ...state.currentFortune, selectedTarotCards: action.payload, step: 'synthesis' } };
    case 'SET_SYNTHESIS_RESULT':
      return { ...state, currentFortune: { ...state.currentFortune, synthesisResult: action.payload }, isLoading: false };
    case 'RESET_FORTUNE':
      return { ...state, currentFortune: { ...initialState.currentFortune }, isLoading: false, error: null };
    case 'SET_HISTORY':
      return { ...state, history: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SAVE_TO_HISTORY':
      const historyEntry = {
        type: 'coffee',
        intent: state.currentFortune.intent,
        imageDataUrl: state.currentFortune.imageData?.dataUrl,
        coffeeResult: state.currentFortune.coffeeResult,
        tarotCards: state.currentFortune.selectedTarotCards,
        synthesisResult: state.currentFortune.synthesisResult,
        date: new Date().toISOString()
      };
      saveToHistory(historyEntry);
      return { ...state, history: getHistory() };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    try {
      const apiKey = getApiKey();
      const user = getUserProfile();
      const history = getHistory();
      if (apiKey) dispatch({ type: 'SET_API_KEY', payload: apiKey });
      if (user) dispatch({ type: 'SET_USER', payload: user });
      if (history.length) dispatch({ type: 'SET_HISTORY', payload: history });
      if (!apiKey) dispatch({ type: 'SHOW_API_KEY_MODAL', payload: true });
      if (!user) dispatch({ type: 'SHOW_ONBOARDING', payload: true });
    } catch (err) {
      console.error('Uygulama yüklenirken hata oluştu:', err);
      dispatch({ type: 'SET_ERROR', payload: 'Uygulama verileri yüklenemedi. Lütfen sayfayı yenileyin.' });
    }
  }, []);

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppState must be used within AppProvider');
  return context;
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext);
  if (!context) throw new Error('useAppDispatch must be used within AppProvider');
  return context;
}

### src/utils/constants.js
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
  { id: '18-25', label: '18-25' },
  { id: '26-35', label: '26-35' },
  { id: '36-45', label: '36-45' },
  { id: '45+', label: '45+' },
];

export const RELATIONSHIP_STATUSES = [
  { id: 'single', label: 'Bekar', emoji: '💫' },
  { id: 'relationship', label: 'İlişkide', emoji: '💕' },
  { id: 'married', label: 'Evli', emoji: '💍' },
  { id: 'complicated', label: 'Karmaşık', emoji: '🌀' },
];

export const FORTUNE_TYPES = [
  { id: 'coffee', name: 'Kahve Falı', emoji: '☕', description: 'Fincanındaki sembolleri oku', available: true },
  { id: 'tarot', name: 'Tarot', emoji: '🃏', description: 'Kartlardan geleceğe bak', available: false, phase: 2 },
  { id: 'dream', name: 'Rüya Yorumu', emoji: '🌙', description: 'Rüyanın anlamını keşfet', available: false, phase: 2 },
  { id: 'numerology', name: 'Numeroloji', emoji: '🔢', description: 'Sayıların sırrını öğren', available: false, phase: 3 },
  { id: 'compatibility', name: 'Burç Uyumu', emoji: '♈', description: 'İki burcun uyumuna bak', available: false, phase: 3 },
  { id: 'palm', name: 'El Falı', emoji: '✋', description: 'Avucundaki çizgileri oku', available: false, phase: 3 },
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

### src/utils/prompts.js
// ============================================================
// CASSIOPEIA — 7 Katmanlı Fal Motoru Prompt Sistemi
// ============================================================

const CASSIOPEIA_PERSONA = `Sen Cassiopeia'sın — deneyimli, bilge, sıcak ama ciddi bir Türk kahvesi falcısı ve ruhsal danışman.

KİMLİĞİN:
- Ne çok mistik ne çok gündelik — arada bir ton
- Sembolleri sıralamak yerine YORUMLARSTN
- "Sana bir at bir de kuş gördüm" DEMEZSIN
- Bunun yerine enerjileri, akışları ve bağlantıları anlatırsın
- Samimi, güven veren, edebi ama anlaşılır Türkçe
- Kötü haberleri yumuşatarak ama DÜRÜSTÇE söyle
- Kullanıcıya "sen" diye hitap et
- ÇOK ÖNEMLİ: Yazıları her zaman kısa, öz ve vurucu tut. Uzun paragraflardan kaçın. Detaylı ama sıkmadan anlat.`;

const LAYER_1_PHYSICAL = `
KATMAN 1 — FİZİKSEL OKUMA (Telvenin Topoğrafyası):

Telve Yoğunluğu:
- Kalın, koyu, çamur gibi bölgeler → "karmik bagaj", çözülememiş ağır enerji, bastırılmış duygular
- İnce, açık bölgeler → akış, ferahlama, hızlı gerçekleşecek olaylar

Gözyaşı Damlaları:
- Duvardan aşağı süzülen telve çizgileri → "enerji boşalımı", arınma
- Fincan ağlıyorsa kişinin içinde tuttuğu bir duygu patlamaya hazır

Negatif Alan (Boşlukların Dili):
- Büyük beyaz boşluklar → aydınlanma, zihinsel berraklık, blokajın kalkması
- Beyaz alanları "ferahlık kapısı" olarak yorumla
- Sadece telvenin olduğu yere değil, OLMADIĞI yere de bak

Genel İzlenim:
- Fincana baktığında önce genel enerjiyi oku
- Yoğun mu ferah mı, kalabalık mı boş mu, ağır mı hafif mi?
- Bu ilk izlenimle başla`;

const LAYER_2_SYMBOLS = `
KATMAN 2 — SEMBOL TESPİTİ (50+ Sembol Sözlüğü):

İNSAN & VARLIK:
Kuş → haber (yönüne göre iyi/kötü) | Yılan → kıskançlık, gizli düşman
Köpek → sadık dost | Kedi → ihanet | At → yolculuk, hareket
Balık → maddi kazanç, bereket | Fare → kayıp, hırsızlık
Tilki → kurnazlık, aldatma | Aslan → güç, himaye
Tavşan → korku, çekingenlik | Kelebek → dönüşüm, yeni dönem
Örümcek → tuzak, komplo | Kuş yuvası → aile haberi

NESNE:
Yüzük → evlilik, bağlayıcı anlaşma | Anahtar → çözüm, kapı açılacak
Makas → kopuş, kesinti | Mum → umut, bekleme
Şemsiye → koruma | Taç → otorite, yükselme
Zincir → bağımlılık, esaret | Kılıç → gerçeğini savunma, toksik bağları kesme
Çan → önemli haber | Ayna → öz yüzleşme

DOĞA:
Ağaç → sağlık, uzun ömür (dallar yukarıysa olumlu)
Çiçek → mutluluk, güzel haberler | Dağ → engel (ama aşılacak)
Deniz/Dalga → duygusal çalkantı | Bulut → belirsizlik
Güneş → başarı, aydınlanma | Ay → kadın figürü, sezgi
Yıldız → şans, umut

YAPI:
Kapı → fırsat | Pencere → yeni bakış açısı
Köprü → geçiş dönemi | Merdiven → yükseliş
Yol/çizgi → değişim, seyahat | Ev → güvenlik, aile

ŞEKİL:
Kalp → aşk, duygusal yoğunluk | Göz → nazar, kıskançlık
Daire → döngü, tekrar | Üçgen → uyarı
Kare → güvenlik, stabilite | Çapraz → kavşak, seçim zamanı
Harf → isim baş harfi, önemli kişi | Kanat → özgürlük`;

const LAYER_3_RELATIONSHIPS = `
KATMAN 3 — SEMBOL İLİŞKİLERİ & ÇELİŞKİ ÇÖZÜMÜ:

Yan yana olan semboller birbirleriyle KONUŞUR:
- Kalp + Makas → bir aşk bağı kopma noktasında
- Kuş + Ev → eve bir haber geliyor
- Yılan + Göz → kıskanan birinin nazarı üstünde
- Balık + Fare → kazanç var ama dikkat etmezsen kayıp da var
- Anahtar + Kapı → büyük bir fırsat kapısı açılıyor
- Zincir + Kelebek → bağımlılıktan kurtulup dönüşüm başlıyor
- Dağ + Yol → engel var ama yol açık, geçeceksin
- Ay + Yılan → bir kadından gelen kıskançlık/tehlike

ÇELİŞKİ YÖNETİMİ:
- Çelişen semboller gördüğünde atlatma, AÇIKLA
- "Fincanda hem bereket hem kayıp var. Bu, gelen kazancın dikkat gerektirdiğini söylüyor."
- Çelişki = gerçek hayatın karmaşıklığı, bunu kucakla`;

const LAYER_4_ENERGY = `
KATMAN 4 — ENERJİ OKUMA:

FİNCAN ANATOMİSİ:
- Kulp tarafı: Ev, aile, yakın çevre
- Kulp karşısı: Dış dünya, iş, sosyal hayat
- Dip: Geçmiş, köken, bilinçaltı
- Ağız kenarı: Yakın gelecek (1-2 hafta)
- Orta: Orta vadeli (1-3 ay)
- Alt (dibe yakın): Uzak gelecek

ERİL & DİŞİL ENERJİ:
- Keskin, köşeli, düz çizgiler → eril enerji (aksiyon, mantık, dış dünya)
- Yuvarlak, kavisli, yumuşak hatlar → dişil enerji (sezgi, kabulleniş, bekleme)
- Hangisi baskınsa bunu yorumla

ZAMANLAMA & MOMENTUM:
- Şekiller ağız kenarına yakın ve yukarı → hızlı tezahür, olaylar çok yakında
- Şekiller dibe çökmüş ve yatay → kuluçka dönemi, sabır zamanı
- Büyük figürler → yakın zamanda gerçekleşecek
- Küçük figürler → uzak gelecekte

TORTUNUN AKIŞI:
- Akış yönü enerjinin yönünü gösterir
- Açık renkli bölgeler → olumlu enerji
- Koyu/yoğun bölgeler → ağır, çözülmeyi bekleyen enerji`;

const LAYER_5_ARCHETYPES = `
KATMAN 5 — ARKETİP & DERİNLİK (Jung Psikolojisi):

ARKETİP OKUMA:
- Karanlık silüet / canavar → kullanıcının Gölgesi (yüzleşmekten korktuğu yanı)
  "Bu bir düşman değil, senin bastırdığın bir yönün. Ona bak, onu tanı."
- Kılıç → sadece kavga değil, "kendi gerçeğini savunma ve toksik bağları kesme zamanı"
- Taç → ego mu, gerçek güç mü? Bağlama göre yorumla
- Ayna → kendini görmekten kaçtığın bir şey var

KÖK ANALİZİ (FİNCANIN DİBİ = BİLİNÇALTI):
- Dipteki yoğun tortular → geçmişten taşınan inanç, bağımlılık, alışkanlık
- "Köklerindeki o ağır tortu çözülmeden, ağzındaki kuşlar uçamayacak"
- Dip temizse → geçmişle barışık, sağlam temeller`;

const LAYER_7_NARRATION = `
KATMAN 7 — ANLATIM KURALLARI:

- Madde madde listeleme. HİKAYE ANLAT
- Genel enerjiden başla, sembollere geç, aralarındaki bağlantıları kur, sonunda bir sonuca bağla
- Samimi, güven veren, edebi ama anlaşılır Türkçe
- Kötü haberleri yumuşatarak ama DÜRÜSTÇE söyle. Yalan söyleme
- Net görebildiğin sembolleri kesin konuş
- Belirsiz olanları "burada bir enerji var ama henüz netleşmemiş" de
- UYDURMA, görmediğin şeyi görüyormuş gibi yapma
- Detaylı ama sıkmadan anlat — ne çok kısa ne çok uzun
- Kullanıcıya "sen" diye hitap et
- Kullanıcının niyetine birden fazla kez dön, sembolleri niyetle ilişkilendir`;

// ============================================================
// EXPORT: Prompt builders
// ============================================================

export function buildCoffeeGeneralPrompt(intent, zodiac, ageRange, relationshipStatus) {
  return `${CASSIOPEIA_PERSONA}

${LAYER_1_PHYSICAL}
${LAYER_2_SYMBOLS}
${LAYER_3_RELATIONSHIPS}
${LAYER_4_ENERGY}
${LAYER_5_ARCHETYPES}
${LAYER_7_NARRATION}

KATMAN 6 — KİŞİSELLEŞTİRME:
- Kullanıcının burcu: ${zodiac}
- Yaş aralığı: ${ageRange}
- İlişki durumu: ${relationshipStatus}
- Niyeti: "${intent}"

GÖREV: Fincana bak ve GENEL bir fal yorumu yap. Tüm katmanları kullan. Hikaye anlat.
Yanıtını düz metin olarak ver, markdown kullanma.`;
}

export function buildCoffeePastPrompt(intent, zodiac, relationshipStatus) {
  return `${CASSIOPEIA_PERSONA}

${LAYER_1_PHYSICAL}
${LAYER_2_SYMBOLS}
${LAYER_5_ARCHETYPES}
${LAYER_7_NARRATION}

Kullanıcının burcu: ${zodiac} | İlişki durumu: ${relationshipStatus} | Niyeti: "${intent}"

GÖREV: Fincanın DİP bölgesine ve alt kısımlarına odaklan. Kökler, geçmiş döngüler, 
tamamlanmış ilişkiler, bilinçaltına itilmiş konular. Telve yoğunluğu burada ağırsa 
"çözülmeyi bekleyen karmik bagaj" olarak oku. Arketip katmanını (gölge çalışması) burada 
özellikle kullan. Geçmişte ne olmuş, ne yaşanmış, neler taşınıyor — bunlara odaklan.
Yanıtını düz metin olarak ver, markdown kullanma.`;
}

export function buildCoffeeFuturePrompt(intent, zodiac, relationshipStatus) {
  return `${CASSIOPEIA_PERSONA}

${LAYER_1_PHYSICAL}
${LAYER_2_SYMBOLS}
${LAYER_4_ENERGY}
${LAYER_7_NARRATION}

Kullanıcının burcu: ${zodiac} | İlişki durumu: ${relationshipStatus} | Niyeti: "${intent}"

GÖREV: Ağız kenarı ve üst bölgelere odaklan. Momentum analizi yap: şekiller yukarı 
ivmeleniyorsa hızlı tezahür, aşağı çökmüşse sabır zamanı. Yakın (1-2 hafta) ve uzak 
(1-3 ay) gelecek ayrımı yap. Negatif alanları (beyaz boşlukları) "açılan fırsat 
pencereleri" olarak yorumla. Geleceğe dair ne görüyorsun — bunlara odaklan.
Yanıtını düz metin olarak ver, markdown kullanma.`;
}

export function buildCoffeeLovePrompt(intent, zodiac, relationshipStatus) {
  return `${CASSIOPEIA_PERSONA}

${LAYER_2_SYMBOLS}
${LAYER_3_RELATIONSHIPS}
${LAYER_4_ENERGY}
${LAYER_7_NARRATION}

Kullanıcının burcu: ${zodiac} | İlişki durumu: ${relationshipStatus} | Niyeti: "${intent}"

GÖREV: Kalp, yüzük, çift figürler, kuş çiftleri ve dişil enerji sembollerine odaklan.
Kullanıcının ilişki durumu "${relationshipStatus}" — buna göre yorumla.
Eril/dişil enerji dengesini aşk bağlamında analiz et. Çelişen semboller varsa adresle.
Yanıtını düz metin olarak ver, markdown kullanma.`;
}

export function buildCoffeeCareerPrompt(intent, zodiac) {
  return `${CASSIOPEIA_PERSONA}

${LAYER_2_SYMBOLS}
${LAYER_3_RELATIONSHIPS}
${LAYER_4_ENERGY}
${LAYER_7_NARRATION}

Kullanıcının burcu: ${zodiac} | Niyeti: "${intent}"

GÖREV: Kulp karşısı bölge, balık, anahtar, merdiven, kapı, yol sembollerine odaklan.
Eril enerji (aksiyon, hareket) burada önemli. Momentum analizi yap: kariyer enerjisi 
yükselişte mi durağan mı? Telve yoğunluğu iş bölgesinde ağırsa "bloke olmuş kariyer 
enerjisi" olarak oku. İş, para ve kariyer hakkında yorum yap.
Yanıtını düz metin olarak ver, markdown kullanma.`;
}

export function buildCoffeeSymbolsPrompt() {
  return `${CASSIOPEIA_PERSONA}

${LAYER_2_SYMBOLS}
${LAYER_3_RELATIONSHIPS}

GÖREV: Fincanda tespit ettiğin TÜM sembolleri aşağıdaki JSON formatında ver.
SADECE JSON döndür, başka bir şey yazma:

{
  "semboller": [
    { "sembol": "Kuş", "konum": "Ağız kenarı, sağ taraf", "anlam": "Yakında güzel bir haber geliyor", "pisin": "olumlu" }
  ],
  "iliskiler": [
    { "semboller": ["Kuş", "Ev"], "anlam": "Eve bir haber geliyor" }
  ]
}`;
}

export function buildTarotSynthesisPrompt(coffeeJSON, intent, zodiac, ageRange, relationshipStatus, card1, card2, card3) {
  return `${CASSIOPEIA_PERSONA}

Sen az önce bu kullanıcının kahve fincanını yorumladın. Şimdi falı derinleştirmek için 
3 Tarot kartı çekti.

KAHVE FALI VERİSİ:
${typeof coffeeJSON === 'string' ? coffeeJSON : JSON.stringify(coffeeJSON)}

KULLANICI BİLGİLERİ:
- Niyet: "${intent}"
- Burç: ${zodiac}
- Yaş: ${ageRange}
- İlişki durumu: ${relationshipStatus}

ÇEKİLEN TAROT KARTLARI:
1. Geçmiş: ${card1.nameTr} (${card1.name}) — ${card1.meaning}
2. Şu An: ${card2.nameTr} (${card2.name}) — ${card2.meaning}
3. Gelecek: ${card3.nameTr} (${card3.name}) — ${card3.meaning}

GÖREVİN:
- Fincandaki belirsiz mesajları tarot kartlarıyla NETLEŞTİR
- Fincanda görünen semboller ile kartların nasıl birbiriyle KONUŞTUĞUNU anlat
- Geçmiş kart + fincan dibi → geçmiş enerjinin doğrulanması
- Şu an kartı + fincan ortası → mevcut durumun netleşmesi
- Gelecek kart + fincan ağzı → geleceğin teyidi
- Her iki disiplini harmanlayan GÜÇLÜ bir sentez sun
- Kullanıcının niyetine mutlaka BAĞLA
- Arketip/gölge çalışması varsa tarot kartıyla destekle
- Final cümlesi güçlü, etkileyici ve unutulmaz olsun
- Yanıtını düz metin olarak ver, markdown kullanma`;
}

export function buildDailyHoroscopePrompt(zodiac) {
  return `Sen Cassiopeia'sın. Kısa ve öz bir günlük burç yorumu yap.
Burç: ${zodiac}
Tarih: ${new Date().toLocaleDateString('tr-TR')}
3-4 cümle yeterli. Samimi ve sıcak bir dil kullan. Türkçe yaz. Markdown kullanma.`;
}

export function buildDailyCardPrompt(cardName, cardMeaning) {
  return `Sen Cassiopeia'sın. Bugünün tarot kartı "${cardName}". 
Anlamı: ${cardMeaning}
Bu kartın bugün için ne mesaj verdiğini 2-3 cümleyle anlat. Samimi ve sıcak. Türkçe yaz. Markdown kullanma.`;
}

### src/utils/imageCompressor.js
/**
 * Canvas-based image compressor for coffee cup photos.
 * Reduces 10MB+ photos to ~200-400KB before sending to Gemini API.
 */
export function compressImage(file, maxWidth = 800, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Scale down if wider than maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG base64
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64 = dataUrl.split(',')[1];

        resolve({
          base64,
          mimeType: 'image/jpeg',
          dataUrl,
          originalSize: file.size,
          compressedSize: Math.round(base64.length * 0.75), // approximate byte size
        });
      };
      img.onerror = () => reject(new Error('Fotoğraf yüklenemedi'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Dosya okunamadı'));
    reader.readAsDataURL(file);
  });
}

### src/index.css
/* ============================================================
   CASSIOPEIA — Global Styles
   Premium dark theme, mobile-first
   ============================================================ */

/* Reset & Base */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --bg: #0a0a0f;
  --bg-card: #12121a;
  --bg-card-hover: #1a1a25;
  --bg-elevated: #16161f;
  --bg-input: #0e0e16;
  --border: rgba(255,255,255,0.06);
  --border-focus: rgba(140,160,220,0.4);
  --text-primary: #e8e8ed;
  --text-secondary: #8a8a9a;
  --text-muted: #55556a;
  --accent: #8ca0dc;
  --accent-glow: rgba(140,160,220,0.15);
  --accent-gradient: linear-gradient(135deg, #8ca0dc 0%, #b8a9e8 50%, #dc8ca0 100%);
  --positive: #7cc9a0;
  --negative: #dc8c8c;
  --warning: #dcb88c;
  --radius: 16px;
  --radius-sm: 10px;
  --radius-xs: 6px;
  --nav-height: 72px;
  --font-body: 'Space Grotesk', -apple-system, sans-serif;
  --font-label: 'Inter', -apple-system, sans-serif;
}

html, body {
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text-primary);
  overflow: hidden;
}

#root {
  height: 100%;
}

/* ============================================================
   App Shell
   ============================================================ */
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 430px;
  margin: 0 auto;
  position: relative;
  background: var(--bg);
  overflow: hidden;
  box-shadow: 0 0 60px rgba(0,0,0,0.5);
}

.app-main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: var(--nav-height);
  scroll-behavior: smooth;
}

.app-main::-webkit-scrollbar { width: 0; }

/* ============================================================
   Bottom Navigation
   ============================================================ */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  height: var(--nav-height);
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgba(10,10,15,0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--border);
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom, 8px);
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  text-decoration: none;
  color: var(--text-muted);
  transition: color 0.2s;
}

.bottom-nav-item .material-symbols-outlined {
  font-size: 24px;
  transition: transform 0.2s;
}

.bottom-nav-item.active {
  color: var(--accent);
}

.bottom-nav-item.active .material-symbols-outlined {
  transform: scale(1.1);
}

.bottom-nav-label {
  font-family: var(--font-label);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

/* ============================================================
   Pages
   ============================================================ */
.page {
  padding: 24px 20px;
  min-height: 100%;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
  margin-top: 4px;
}

/* ============================================================
   Home Page
   ============================================================ */
.home-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}

.home-greeting {
  display: flex;
  align-items: center;
  gap: 14px;
}

.greeting-emoji {
  font-size: 36px;
}

.greeting-text {
  color: var(--text-secondary);
  font-size: 14px;
}

.greeting-zodiac {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.home-date {
  color: var(--text-muted);
  font-size: 12px;
  font-family: var(--font-label);
  text-align: right;
  padding-top: 4px;
}

/* Quick Action */
.quick-action-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: var(--accent-gradient);
  border: none;
  border-radius: var(--radius);
  color: #0a0a0f;
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;
  transition: transform 0.15s, box-shadow 0.3s;
}

.quick-action-btn:active {
  transform: scale(0.98);
}

.quick-action-btn .arrow {
  margin-left: auto;
}

/* Home Cards */
.home-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  color: var(--text-secondary);
}

.card-header h3 {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.card-header .material-symbols-outlined {
  font-size: 20px;
  color: var(--accent);
}

.zodiac-mini-emoji {
  font-size: 20px;
}

/* Daily Card */
.daily-card-content {
  display: flex;
  gap: 16px;
}

.daily-card-image {
  width: 80px;
  height: 120px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--border);
}

.daily-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.7) brightness(0.9);
}

.daily-card-info {
  flex: 1;
  min-width: 0;
}

.daily-card-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.daily-card-meaning {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.daily-card-reading {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Horoscope */
.horoscope-text {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-secondary);
}

/* Energy */
.energy-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.energy-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.energy-label {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-label);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.energy-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--accent);
}

.energy-divider {
  width: 1px;
  height: 40px;
  background: var(--border);
}

/* Shimmer Loading */
.shimmer {
  background: linear-gradient(90deg, var(--bg-card) 25%, var(--bg-elevated) 50%, var(--bg-card) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-xs);
  color: transparent !important;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ============================================================
   Fortunes Page
   ============================================================ */
.fortune-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fortune-type-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  text-align: left;
  font-family: var(--font-body);
  color: var(--text-primary);
}

.fortune-type-card:active:not(.locked) {
  transform: scale(0.98);
  background: var(--bg-card-hover);
}

.fortune-type-card.locked {
  opacity: 0.45;
  cursor: default;
}

.fortune-type-emoji {
  font-size: 32px;
  flex-shrink: 0;
}

.fortune-type-info {
  flex: 1;
}

.fortune-type-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 2px;
}

.fortune-type-desc {
  font-size: 12px;
  color: var(--text-muted);
}

.fortune-type-badge {
  font-size: 10px;
  color: var(--text-muted);
  background: rgba(255,255,255,0.05);
  padding: 4px 10px;
  border-radius: 20px;
  font-family: var(--font-label);
  white-space: nowrap;
}

.fortune-arrow {
  color: var(--text-muted);
}

/* ============================================================
   Coffee Fortune Steps
   ============================================================ */
.coffee-page {
  padding-top: 0;
}

.fortune-progress {
  height: 3px;
  background: var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
}

.fortune-progress-fill {
  height: 100%;
  background: var(--accent-gradient);
  transition: width 0.5s ease;
  border-radius: 0 2px 2px 0;
}

.fortune-step {
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - var(--nav-height) - 3px);
}

.step-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--accent-glow);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.step-icon .material-symbols-outlined {
  font-size: 28px;
  color: var(--accent);
}

.step-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
}

.step-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
  text-align: center;
  max-width: 300px;
  line-height: 1.5;
  margin-bottom: 32px;
}

.step-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: var(--accent-gradient);
  border: none;
  border-radius: var(--radius);
  color: #0a0a0f;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.2s;
  margin-top: 24px;
}

.step-button:active {
  transform: scale(0.97);
}

.step-button:disabled {
  opacity: 0.4;
  cursor: default;
}

.step-button.secondary {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.step-error {
  color: var(--negative);
  font-size: 13px;
  margin-top: 12px;
}

/* Intent Step */
.intent-form {
  width: 100%;
  max-width: 380px;
}

.intent-input {
  width: 100%;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  outline: none;
  transition: border-color 0.3s;
}

.intent-input:focus {
  border-color: var(--border-focus);
}

.intent-input::placeholder {
  color: var(--text-muted);
}

.intent-counter {
  display: block;
  text-align: right;
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 6px;
  font-family: var(--font-label);
}

/* Upload Step */
.upload-zone {
  width: 100%;
  max-width: 320px;
  aspect-ratio: 1;
  border: 2px dashed rgba(140,160,220,0.2);
  border-radius: var(--radius);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: border-color 0.3s, background 0.3s;
}

.upload-zone:active {
  border-color: var(--accent);
  background: var(--accent-glow);
}

.upload-icon {
  font-size: 48px;
  color: var(--text-muted);
}

.upload-text {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-secondary);
}

.upload-hint {
  font-size: 12px;
  color: var(--text-muted);
}

.upload-compressing {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--text-secondary);
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.upload-preview-container {
  width: 100%;
  max-width: 320px;
  position: relative;
}

.upload-preview {
  width: 100%;
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.upload-change {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: rgba(10,10,15,0.8);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border);
  border-radius: 20px;
  color: var(--text-secondary);
  font-size: 12px;
  font-family: var(--font-body);
  cursor: pointer;
}

.upload-change .material-symbols-outlined {
  font-size: 14px;
}

/* Analyzing Step */
.analyzing-step {
  justify-content: center;
}

.analyzing-image-container {
  width: 240px;
  height: 240px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  border: 2px solid var(--border);
  margin-bottom: 32px;
}

.analyzing-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.6) saturate(0.5);
}

.scan-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), #fff, var(--accent), transparent);
  box-shadow: 0 0 15px var(--accent), 0 0 30px var(--accent);
  animation: scanMove 2.5s ease-in-out infinite;
}

@keyframes scanMove {
  0% { top: 10%; }
  50% { top: 85%; }
  100% { top: 10%; }
}

.scan-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(to right, rgba(140,160,220,0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(140,160,220,0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Loading Oracle */
.loading-oracle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.loading-orb {
  width: 80px;
  height: 80px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orb-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid;
  animation: orbSpin linear infinite;
}

.ring-1 {
  width: 100%;
  height: 100%;
  border-color: rgba(140,160,220,0.2);
  animation-duration: 3s;
}

.ring-2 {
  width: 75%;
  height: 75%;
  border-color: rgba(184,169,232,0.2);
  animation-duration: 2s;
  animation-direction: reverse;
}

.ring-3 {
  width: 50%;
  height: 50%;
  border-color: rgba(220,140,160,0.2);
  animation-duration: 1.5s;
}

@keyframes orbSpin {
  to { transform: rotate(360deg); }
}

.orb-core {
  color: var(--accent);
  animation: orbPulse 2s ease-in-out infinite;
}

@keyframes orbPulse {
  0%, 100% { opacity: 0.5; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.1); }
}

.loading-text {
  color: var(--text-secondary);
  font-size: 14px;
  animation: textPulse 2s ease-in-out infinite;
}

@keyframes textPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* ============================================================
   Results Page
   ============================================================ */
.results-step {
  padding: 0 0 120px 0;
  align-items: stretch;
  min-height: auto;
}

.result-image-strip {
  height: 160px;
  overflow: hidden;
  position: relative;
}

.result-image-strip img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.5) saturate(0.6);
}

.result-image-strip::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to top, var(--bg), transparent);
}

/* Tab Bar */
.tab-bar {
  padding: 0 16px;
  margin: -8px 0 0 0;
  position: relative;
  z-index: 2;
}

.tab-bar-inner {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}

.tab-bar-inner::-webkit-scrollbar { display: none; }

.tab-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-item.active {
  background: var(--accent-glow);
  border-color: rgba(140,160,220,0.3);
  color: var(--accent);
}

.tab-icon {
  font-size: 14px;
}

/* Result Content */
.result-content {
  padding: 24px 20px;
  min-height: 200px;
}

.result-text {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-secondary);
  white-space: pre-wrap;
}

.result-text.faded {
  color: var(--text-muted);
  text-align: center;
  padding: 40px 0;
}

/* Symbols List */
.symbols-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.symbol-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
}

.symbol-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.symbol-badge {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.symbol-badge.positive { background: rgba(124,201,160,0.15); color: var(--positive); }
.symbol-badge.negative { background: rgba(220,140,140,0.15); color: var(--negative); }
.symbol-badge.neutral { background: rgba(140,160,220,0.15); color: var(--accent); }

.symbol-location {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-label);
}

.symbol-meaning {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.symbol-relations {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.relations-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.relation-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}

.relation-symbols {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
}

.relation-meaning {
  font-size: 12px;
  color: var(--text-secondary);
}

/* Q&A Section */
.qa-section {
  padding: 20px;
  border-top: 1px solid var(--border);
  margin-top: 12px;
}

.qa-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
}

.qa-message {
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  margin-bottom: 8px;
  font-size: 13px;
  line-height: 1.6;
}

.qa-message.user {
  background: rgba(140,160,220,0.1);
  color: var(--accent);
  margin-left: 40px;
  text-align: right;
}

.qa-message.cassiopeia {
  background: var(--bg-card);
  color: var(--text-secondary);
  margin-right: 40px;
}

.qa-loading {
  color: var(--text-muted);
  font-size: 13px;
  animation: textPulse 2s ease-in-out infinite;
  padding: 8px 0;
}

.qa-form {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.qa-input {
  flex: 1;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 10px 16px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 13px;
  outline: none;
}

.qa-input:focus {
  border-color: var(--border-focus);
}

.qa-send {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent-gradient);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #0a0a0f;
  flex-shrink: 0;
}

.qa-send:disabled {
  opacity: 0.3;
}

.qa-send .material-symbols-outlined {
  font-size: 18px;
}

/* Synthesis CTA */
.synthesis-cta {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  margin: 20px;
  background: linear-gradient(135deg, rgba(140,160,220,0.1), rgba(184,169,232,0.1));
  border: 1px solid rgba(140,160,220,0.2);
  border-radius: var(--radius);
  cursor: pointer;
  text-align: left;
  font-family: var(--font-body);
  color: var(--text-primary);
  transition: transform 0.15s, background 0.3s;
}

.synthesis-cta:active {
  transform: scale(0.98);
}

.synthesis-cta strong {
  display: block;
  font-size: 14px;
  margin-bottom: 2px;
}

.synthesis-cta p {
  font-size: 12px;
  color: var(--text-muted);
}

.synthesis-cta .material-symbols-outlined:first-child {
  color: var(--accent);
  font-size: 28px;
}

.synthesis-cta .material-symbols-outlined:last-child {
  margin-left: auto;
  color: var(--text-muted);
}

/* ============================================================
   Tarot Bridge
   ============================================================ */
.bridge-step {
  padding-top: 20px;
}

.bridge-header {
  text-align: center;
  margin-bottom: 24px;
}

.bridge-header .material-symbols-outlined {
  font-size: 32px;
  color: var(--accent);
  margin-bottom: 12px;
}

.selected-cards-display {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 28px;
}

.selected-card-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.slot-label {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-label);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.slot-card {
  width: 80px;
  height: 120px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s;
}

.slot-card.empty {
  background: var(--bg-card);
}

.slot-card.empty .material-symbols-outlined {
  color: var(--text-muted);
  font-size: 28px;
}

.slot-card.revealed {
  border-color: rgba(140,160,220,0.3);
  box-shadow: 0 0 20px var(--accent-glow);
}

.slot-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slot-card-name {
  font-size: 10px;
  color: var(--text-secondary);
  text-align: center;
  max-width: 80px;
}

.bridge-instruction {
  color: var(--text-secondary);
  font-size: 13px;
  text-align: center;
  margin-bottom: 20px;
}

/* Tarot Spread Grid */
.tarot-spread {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  width: 100%;
  padding: 0 10px;
}

.tarot-card-back {
  aspect-ratio: 2/3;
  border-radius: var(--radius-sm);
  cursor: pointer;
  position: relative;
  perspective: 600px;
  border: none;
  background: none;
  padding: 0;
}

.card-back-face,
.card-front-face {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-sm);
  backface-visibility: hidden;
  transition: transform 0.6s;
  overflow: hidden;
}

.card-back-face {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 1px solid rgba(140,160,220,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-back-pattern {
  color: rgba(140,160,220,0.2);
  font-size: 24px;
}

.card-front-face {
  transform: rotateY(180deg);
  border: 1px solid rgba(140,160,220,0.3);
}

.card-front-face img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tarot-card-back.flipped .card-back-face {
  transform: rotateY(180deg);
}

.tarot-card-back.flipped .card-front-face {
  transform: rotateY(0deg);
}

.tarot-card-back:disabled {
  opacity: 0.5;
  cursor: default;
}

.tarot-card-back:not(:disabled):active .card-back-face {
  background: linear-gradient(135deg, #1a1a3e, #1a2e4e);
}

/* ============================================================
   Synthesis Result
   ============================================================ */
.synthesis-header {
  text-align: center;
  margin-bottom: 24px;
}

.synthesis-header .material-symbols-outlined {
  font-size: 32px;
  color: var(--accent);
}

.synthesis-cards {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 28px;
}

.synthesis-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.synthesis-card img {
  width: 70px;
  height: 105px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(140,160,220,0.2);
}

.synthesis-card-label {
  font-size: 10px;
  color: var(--text-muted);
  font-family: var(--font-label);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.synthesis-card-name {
  font-size: 11px;
  color: var(--text-secondary);
}

.synthesis-text-container {
  padding: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin: 0 4px;
}

.synthesis-text {
  font-size: 14px;
  line-height: 1.9;
  color: var(--text-secondary);
  white-space: pre-wrap;
}

.synthesis-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
  flex-wrap: wrap;
}

.saved-text {
  color: var(--positive);
  font-size: 14px;
  padding: 16px;
}

/* ============================================================
   History Page
   ============================================================ */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  gap: 12px;
}

.empty-icon {
  font-size: 48px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
}

.empty-state p {
  color: var(--text-secondary);
  font-size: 14px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.history-item-image {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--border);
}

.history-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7);
}

.history-placeholder {
  width: 100%;
  height: 100%;
  background: var(--bg-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.history-item-info {
  flex: 1;
  min-width: 0;
}

.history-type {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-label);
}

.history-intent {
  font-size: 13px;
  color: var(--text-primary);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-date {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-label);
  margin-top: 2px;
}

.history-tarot-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--accent-glow);
  border-radius: 12px;
  font-size: 10px;
  color: var(--accent);
  font-family: var(--font-label);
  white-space: nowrap;
}

.history-tarot-badge .material-symbols-outlined {
  font-size: 14px;
}

/* ============================================================
   Discover Page
   ============================================================ */
.discover-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.discover-card {
  padding: 24px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  text-align: center;
  position: relative;
}

.discover-card.locked {
  opacity: 0.4;
}

.discover-icon {
  font-size: 32px;
  color: var(--accent);
  margin-bottom: 12px;
}

.discover-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
}

.discover-desc {
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.4;
}

.discover-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 9px;
  color: var(--text-muted);
  background: rgba(255,255,255,0.05);
  padding: 2px 8px;
  border-radius: 10px;
  font-family: var(--font-label);
}

/* ============================================================
   Profile Page
   ============================================================ */
.profile-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 24px 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 20px;
}

.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--accent-glow);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile-emoji {
  font-size: 28px;
}

.profile-zodiac {
  font-size: 20px;
  font-weight: 700;
}

.profile-details {
  display: flex;
  gap: 8px;
  align-items: center;
  color: var(--text-secondary);
  font-size: 13px;
  margin-top: 2px;
}

.profile-divider {
  color: var(--text-muted);
}

.profile-stats {
  display: flex;
  gap: 0;
  margin-bottom: 24px;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
}

.stat-item:first-child {
  border-radius: var(--radius) 0 0 var(--radius);
  border-right: none;
}

.stat-item:last-child {
  border-radius: 0 var(--radius) var(--radius) 0;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--accent);
}

.stat-label {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-label);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.profile-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: var(--font-label);
  margin-bottom: 12px;
}

.settings-item {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 8px;
}

.settings-item .material-symbols-outlined:first-child {
  color: var(--text-secondary);
}

.settings-item .material-symbols-outlined:last-child {
  margin-left: auto;
  color: var(--text-muted);
}

.api-key-edit {
  display: flex;
  gap: 8px;
  padding: 0 16px 16px;
}

.settings-input {
  flex: 1;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius-xs);
  padding: 10px 14px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 13px;
  outline: none;
}

.settings-input:focus {
  border-color: var(--border-focus);
}

.settings-save {
  padding: 10px 16px;
  background: var(--accent);
  border: none;
  border-radius: var(--radius-xs);
  color: #0a0a0f;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.profile-footer {
  text-align: center;
  padding: 32px 0;
  color: var(--text-muted);
  font-size: 12px;
}

.profile-footer p {
  margin-bottom: 4px;
}

/* ============================================================
   Modal Overlay
   ============================================================ */
.modal-overlay, .onboarding-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-container {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 32px 24px;
  width: 100%;
  max-width: 380px;
  text-align: center;
}

.modal-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--accent-glow);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.modal-icon .material-symbols-outlined {
  font-size: 24px;
  color: var(--accent);
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.modal-subtitle {
  color: var(--text-secondary);
  font-size: 13px;
  margin-bottom: 24px;
  line-height: 1.5;
}

.modal-input {
  width: 100%;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 14px;
  outline: none;
  margin-bottom: 12px;
}

.modal-input:focus {
  border-color: var(--border-focus);
}

.modal-link {
  display: block;
  color: var(--accent);
  font-size: 12px;
  margin-bottom: 20px;
  text-decoration: none;
}

.modal-button {
  width: 100%;
  padding: 14px;
  background: var(--accent-gradient);
  border: none;
  border-radius: var(--radius-sm);
  color: #0a0a0f;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.modal-button:disabled {
  opacity: 0.4;
}

/* ============================================================
   Onboarding
   ============================================================ */
.onboarding-container {
  width: 100%;
  max-width: 400px;
  padding: 32px 24px;
}

.onboarding-progress {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  transition: background 0.3s;
}

.progress-dot.active {
  background: var(--accent);
}

.onboarding-step {
  text-align: center;
}

.onboarding-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.onboarding-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 32px;
}

.zodiac-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 24px;
}

.zodiac-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 8px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-body);
  color: var(--text-primary);
}

.zodiac-card.selected {
  border-color: var(--accent);
  background: var(--accent-glow);
}

.zodiac-emoji {
  font-size: 24px;
}

.zodiac-name {
  font-size: 13px;
  font-weight: 500;
}

.zodiac-date {
  font-size: 9px;
  color: var(--text-muted);
  font-family: var(--font-label);
}

.age-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;
}

.age-card {
  padding: 18px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  transition: all 0.2s;
}

.age-card.selected {
  border-color: var(--accent);
  background: var(--accent-glow);
}

.relationship-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.relationship-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text-primary);
  transition: all 0.2s;
}

.relationship-card.selected {
  border-color: var(--accent);
  background: var(--accent-glow);
}

.relationship-emoji {
  font-size: 20px;
}

.onboarding-next {
  padding: 14px 48px;
  background: var(--accent-gradient);
  border: none;
  border-radius: var(--radius);
  color: #0a0a0f;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.onboarding-next:disabled {
  opacity: 0.3;
}

/* ============================================================
   Error Container
   ============================================================ */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  gap: 12px;
  min-height: calc(100vh - var(--nav-height));
}

.error-icon {
  font-size: 48px;
  color: var(--negative);
}

.error-container h3 {
  font-size: 18px;
}

.error-container p {
  color: var(--text-secondary);
  font-size: 14px;
  max-width: 300px;
}

### src/components/LoadingOracle.jsx
export default function LoadingOracle({ message = 'Cassiopeia okuma yapıyor...' }) {
  return (
    <div className="loading-oracle">
      <div className="loading-orb">
        <div className="orb-ring ring-1"></div>
        <div className="orb-ring ring-2"></div>
        <div className="orb-ring ring-3"></div>
        <div className="orb-core">
          <span className="material-symbols-outlined">auto_awesome</span>
        </div>
      </div>
      <p className="loading-text">{message}</p>
    </div>
  );
}

### src/components/ApiKeyModal.jsx
import { useState } from 'react';
import { useAppState, useAppDispatch } from '../context/AppContext';

function ApiKeyModal() {
  const { showApiKeyModal, apiKey } = useAppState();
  const dispatch = useAppDispatch();
  const [tempKey, setTempKey] = useState(apiKey || '');
  if (!showApiKeyModal) return null;
  const handleSave = () => { dispatch({ type: 'SET_API_KEY', payload: tempKey.trim() }); };
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">API Ayarları</h2>
        <input type="password" value={tempKey} onChange={(e) => setTempKey(e.target.value)} placeholder="OLLAMA veya API Key" className="modal-input" />
        <button className="modal-button" onClick={handleSave}>Kaydet</button>
        <button className="modal-link" onClick={() => dispatch({ type: 'SHOW_API_KEY_MODAL', payload: false })}>Kapat</button>
      </div>
    </div>
  );
}
export default ApiKeyModal;

### src/components/OnboardingFlow.jsx
import { useState } from 'react';
import { useAppDispatch } from '../context/AppContext';
import { ZODIAC_SIGNS } from '../utils/constants';

function OnboardingFlow() {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(1);
  const [zodiac, setZodiac] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');

  const handleComplete = () => {
    dispatch({
      type: 'SET_USER',
      payload: { zodiac, ageRange, relationshipStatus, onboarded: true },
    });
  };

  const renderStep1 = () => (
    <div className="onboarding-step">
      <h2 className="onboarding-title">Burcunu Seç ✨</h2>
      <div className="zodiac-grid">
        {ZODIAC_SIGNS.map((z) => (
          <button
            key={z.id}
            className={`zodiac-item ${zodiac === z.id ? 'active' : ''}`}
            onClick={() => { setZodiac(z.id); setStep(2); }}
          >
            <span className="zodiac-emoji">{z.emoji}</span>
            <span className="zodiac-name">{z.name}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="onboarding-step">
      <h2 className="onboarding-title">Yaş Aralığın? 🕯️</h2>
      <div className="options-grid">
        {['18-24', '25-34', '35-44', '45-54', '55+'].map((opt) => (
          <button
            key={opt}
            className={`option-btn ${ageRange === opt ? 'active' : ''}`}
            onClick={() => { setAgeRange(opt); setStep(3); }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="onboarding-step">
      <h2 className="onboarding-title">İlişki Durumun? 💕</h2>
      <div className="options-grid">
        {['Bekar', 'İlişkisi var', 'Evli', 'Aramız karışık', 'Boşanmış'].map((opt) => (
          <button
            key={opt}
            className={`option-btn ${relationshipStatus === opt ? 'active' : ''}`}
            onClick={() => setRelationshipStatus(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
      <button 
        className="primary-btn wide-btn mt-2" 
        disabled={!relationshipStatus}
        onClick={handleComplete}
      >
        Cassiopeia'ya Katıl
      </button>
    </div>
  );

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card glass-card animate-float">
        <div className="onboarding-progress">
          <div className="progress-bar" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>
        
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        {step > 1 && (
          <button className="back-link" onClick={() => setStep(step - 1)}>
            Geri
          </button>
        )}
      </div>
    </div>
  );
}

export default OnboardingFlow;

### src/components/TabBar.jsx
import { useState } from 'react';

export default function TabBar({ tabs, activeTab, onTabChange }) {
  return (
    <div className="tab-bar">
      <div className="tab-bar-inner">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

### src/components/BottomNav.jsx
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', icon: 'home', label: 'Ana Sayfa' },
  { path: '/fallar', icon: 'auto_awesome', label: 'Fallar' },
  { path: '/gecmis', icon: 'history', label: 'Geçmiş' },
  { path: '/kesfet', icon: 'explore', label: 'Keşfet' },
  { path: '/profil', icon: 'person', label: 'Profil' },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

### src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

### src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useAppState } from './context/AppContext';
import BottomNav from './components/BottomNav';
import ApiKeyModal from './components/ApiKeyModal';
import OnboardingFlow from './components/OnboardingFlow';
import HomePage from './pages/HomePage';
import FortunesPage from './pages/FortunesPage';
import CoffeeFortunePage from './pages/CoffeeFortunePage';
import HistoryPage from './pages/HistoryPage';
import DiscoverPage from './pages/DiscoverPage';
import ProfilePage from './pages/ProfilePage';
import './index.css';

function AppContent() {
  const { showOnboarding, showApiKeyModal, error } = useAppState();

  if (error && !showApiKeyModal && !showOnboarding) {
    return (
      <div className="critical-error" style={{ padding: '40px', textAlign: 'center', background: '#0a0a0f', color: '#e8e8ed', height: '100vh' }}>
        <h2>Sistem Hatası</h2>
        <p style={{ margin: '20px 0', color: '#8a8a9a' }}>{error}</p>
        <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #8ca0dc 0%, #dc8ca0 100%)', border: 'none', borderRadius: '12px', color: '#0a0a0f', fontWeight: 'bold' }}>Yeniden Dene</button>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <ApiKeyModal />
      {showOnboarding && !showApiKeyModal && <OnboardingFlow />}

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/fallar" element={<FortunesPage />} />
          <Route path="/fallar/kahve" element={<CoffeeFortunePage />} />
          <Route path="/gecmis" element={<HistoryPage />} />
          <Route path="/kesfet" element={<DiscoverPage />} />
          <Route path="/profil" element={<ProfilePage />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}

### src/pages/CoffeeFortune/SynthesisResult.jsx
import { useEffect, useState } from 'react';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { callGemini } from '../../services/gemini';
import { buildTarotSynthesisPrompt } from '../../utils/prompts';
import LoadingOracle from '../../components/LoadingOracle';

function SynthesisResult() {
  const { currentFortune, apiKey, user } = useAppState();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Array.isArray(currentFortune?.selectedTarotCards) && currentFortune.selectedTarotCards.length === 3 && !currentFortune.synthesisResult) {
      runSynthesis();
    } else if (currentFortune?.synthesisResult) {
      setLoading(false);
    }
  }, []);

  async function runSynthesis() {
    if (!apiKey) return;
    setLoading(true);
    try {
      const prompt = buildTarotSynthesisPrompt(
        currentFortune?.coffeeResult?.general || '',
        currentFortune?.intent || '',
        user?.zodiac || '',
        user?.ageRange || '',
        user?.relationshipStatus || '',
        currentFortune?.selectedTarotCards?.[0] || null,
        currentFortune?.selectedTarotCards?.[1] || null,
        currentFortune?.selectedTarotCards?.[2] || null
      );

      if (!prompt) throw new Error('Sentez promptu hazırlanamadı.');

      const result = await callGemini(apiKey, prompt);
      dispatch({ type: 'SET_SYNTHESIS_RESULT', payload: result });
    } catch (err) {
      console.error('Sentez hatası:', err);
      dispatch({ type: 'SET_ERROR', payload: 'Sentez oluşturulamadı.' });
    }
    setLoading(false);
  }

  if (loading && !currentFortune?.synthesisResult) {
    return <LoadingOracle message="Cassiopeia yıldızları birleştiriyor..." />;
  }

  // Safety guard if still no result
  if (!currentFortune?.synthesisResult) {
    return (
      <div className="fortune-step synthesis-step">
        <p className="result-text faded" style={{ textAlign: 'center' }}>Sentez sonucu şu an hazır değil.</p>
      </div>
    );
  }

  return (
    <div className="fortune-step synthesis-step">
      <div className="synthesis-header">
        <span className="material-symbols-outlined">auto_awesome</span>
        <h2 className="step-title">Büyük Resim</h2>
        <p className="step-subtitle">Kahve ve Tarot'un ortak mesajı</p>
      </div>

      <div className="synthesis-cards-mini">
        {Array.isArray(currentFortune?.selectedTarotCards) && currentFortune.selectedTarotCards.map((card, i) => (
          <div key={i} className="mini-card">
            {card?.img ? (
              <img src={card.img} alt={card?.nameTr || 'Kart'} />
            ) : (
              <span className="material-symbols-outlined">style</span>
            )}
          </div>
        ))}
      </div>

      <div className="synthesis-content">
        <p className="result-text">{currentFortune?.synthesisResult || 'Sentez metni yüklenemedi.'}</p>
      </div>

      <div className="synthesis-actions">
        <button className="step-button" onClick={() => { dispatch({ type: 'SAVE_TO_HISTORY' }); dispatch({ type: 'RESET_FORTUNE' }); }}>
          Falı Kaydet ve Bitir
        </button>
      </div>
    </div>
  );
}

export default SynthesisResult;

### src/pages/CoffeeFortune/UploadStep.jsx
import { useRef, useState } from 'react';
import { useAppDispatch } from '../../context/AppContext';
import { compressImage } from '../../utils/imageCompressor';

export default function UploadStep() {
  const dispatch = useAppDispatch();
  const fileRef = useRef(null);
  
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [compressing, setCompressing] = useState(false);
  const [compressedData, setCompressedData] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Lütfen bir fotoğraf seç');
      return;
    }

    setError('');
    setCompressing(true);

    try {
      const result = await compressImage(file);
      setPreview(result.dataUrl);
      setCompressedData({
        base64: result.base64,
        mimeType: result.mimeType,
        dataUrl: result.dataUrl
      });
      setCompressing(false);
    } catch (err) {
      setError('Fotoğraf işlenemedi, tekrar dene');
      setCompressing(false);
    }
  };

  const handleSubmit = () => {
    if (!compressedData) return;
    
    dispatch({
      type: 'SET_IMAGE',
      payload: compressedData,
    });
  };

  return (
    <div className="fortune-step upload-step">
      <div className="step-icon">
        <span className="material-symbols-outlined">add_a_photo</span>
      </div>
      <h2 className="step-title">Fincanı Yükle</h2>
      <p className="step-subtitle">
        Fincanının iç kısmının net bir fotoğrafını çek veya galerinden seç
      </p>

      {!preview ? (
        <div className="upload-zone" onClick={() => fileRef.current?.click()}>
          {compressing ? (
            <div className="upload-compressing">
              <span className="material-symbols-outlined spinning">progress_activity</span>
              <span>İşleniyor...</span>
            </div>
          ) : (
            <>
              <span className="material-symbols-outlined upload-icon">cloud_upload</span>
              <span className="upload-text">Fotoğraf Seç</span>
              <span className="upload-hint">JPG veya PNG</span>
            </>
          )}
        </div>
      ) : (
        <div className="upload-preview-container">
          <div className="preview-aspect-ratio">
            <img src={preview} alt="Fincan" className="upload-preview" />
          </div>
          <button className="upload-change" onClick={() => { setPreview(null); setCompressedData(null); if(fileRef.current) fileRef.current.value = ''; }}>
            <span className="material-symbols-outlined">refresh</span>
            Değiştir
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {error && <p className="step-error">{error}</p>}

      {preview && !compressing && (
        <button className="step-button pulse" onClick={handleSubmit}>
          Falıma Baktır
          <span className="material-symbols-outlined">auto_awesome</span>
        </button>
      )}
    </div>
  );
}

### src/pages/CoffeeFortune/ResultsPage.jsx
import { useState } from 'react';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { callGemini } from '../../services/gemini';
import {
  buildCoffeePastPrompt,
  buildCoffeeFuturePrompt,
  buildCoffeeLovePrompt,
  buildCoffeeCareerPrompt,
  buildCoffeeSymbolsPrompt,
} from '../../utils/prompts';
import TabBar from '../../components/TabBar';
import LoadingOracle from '../../components/LoadingOracle';

function ResultsPage() {
  const { currentFortune, apiKey, user } = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [tabData, setTabData] = useState({});
  const [tabLoading, setTabLoading] = useState({});
  const [question, setQuestion] = useState('');
  const [qaMessages, setQaMessages] = useState([]);
  const [qaLoading, setQaLoading] = useState(false);

  const TABS = [
    { id: 'general', label: 'Genel', icon: '✨' },
    { id: 'past', label: 'Geçmiş', icon: '⏪' },
    { id: 'future', label: 'Gelecek', icon: '⏩' },
    { id: 'love', label: 'Aşk', icon: '💕' },
    { id: 'career', label: 'Kariyer', icon: '💰' },
    { id: 'symbols', label: 'Semboller', icon: '🔍' },
  ];

  const handleTabChange = async (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'general' || tabData[tabId]) return;
    if (!apiKey) return;

    setTabLoading((prev) => ({ ...prev, [tabId]: true }));

    try {
      const zodiac = user?.zodiac || '';
      const relationship = user?.relationshipStatus || '';
      const intent = currentFortune?.intent || '';
      let prompt;

      switch (tabId) {
        case 'past': prompt = buildCoffeePastPrompt(intent, zodiac, relationship); break;
        case 'future': prompt = buildCoffeeFuturePrompt(intent, zodiac, relationship); break;
        case 'love': prompt = buildCoffeeLovePrompt(intent, zodiac, relationship); break;
        case 'career': prompt = buildCoffeeCareerPrompt(intent, zodiac); break;
        case 'symbols': prompt = buildCoffeeSymbolsPrompt(); break;
        default: break;
      }

      if (!prompt) throw new Error('Prompt oluşturulamadı.');

      const isJson = tabId === 'symbols';
      const result = await callGemini(apiKey, prompt, {
        imageBase64: currentFortune?.imageData?.base64,
        imageMimeType: currentFortune?.imageData?.mimeType,
        jsonMode: isJson,
      });

      setTabData((prev) => ({ ...prev, [tabId]: result }));
    } catch (err) {
      console.error('Yorum yükleme hatası:', err);
      setTabData((prev) => ({ ...prev, [tabId]: 'Yorum şu an alınamıyor.' }));
    }

    setTabLoading((prev) => ({ ...prev, [tabId]: false }));
  };

  const handleQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim() || !apiKey) return;

    const q = question.trim();
    setQuestion('');
    setQaMessages((prev) => [...prev, { role: 'user', text: q }]);
    setQaLoading(true);

    try {
      const prompt = `Sen Cassiopeia'sın. Az önce bu kullanıcının kahve falına baktın. 
Genel yorum: "${currentFortune?.coffeeResult?.general?.substring(0, 300)}"
Kullanıcı soruyor: "${q}"
Kısa ve öz yanıt ver. Türkçe. Markdown kullanma.`;

      const answer = await callGemini(apiKey, prompt, {
        imageBase64: currentFortune?.imageData?.base64,
        imageMimeType: currentFortune?.imageData?.mimeType,
      });
      setQaMessages((prev) => [...prev, { role: 'cassiopeia', text: answer }]);
    } catch {
      setQaMessages((prev) => [...prev, { role: 'cassiopeia', text: 'Yanıt alınamadı.' }]);
    }
    setQaLoading(false);
  };

  if (!currentFortune?.coffeeResult) {
    return <LoadingOracle message="Sonuçlar hazırlanıyor..." />;
  }

  const renderTabContent = () => {
    if (activeTab === 'general') {
      return <p className="result-text">{currentFortune?.coffeeResult?.general || 'Yorum bulunamadı.'}</p>;
    }

    if (tabLoading[activeTab]) {
      return <LoadingOracle message="Cassiopeia bu bölüme bakıyor..." />;
    }

    const currentContent = tabData[activeTab];
    if (!currentContent) {
      return <p className="result-text faded" style={{ textAlign: 'center', padding: '2rem' }}>Yorumu yüklemek için bekleyin veya sekmeyi yenileyin.</p>;
    }

    if (activeTab === 'symbols' && typeof currentContent === 'object') {
      return (
        <div className="symbols-list">
          {Array.isArray(currentContent?.semboller) && currentContent.semboller.map((s, i) => (
            <div key={i} className="symbol-item">
              <div className="symbol-header">
                <span className={`symbol-badge ${s?.pisin === 'olumlu' ? 'positive' : s?.pisin === 'olumsuz' ? 'negative' : 'neutral'}`}>
                  {s?.sembol || 'Belirsiz'}
                </span>
                <span className="symbol-location">{s?.konum || ''}</span>
              </div>
              <p className="symbol-meaning">{s?.anlam || ''}</p>
            </div>
          ))}
          {Array.isArray(currentContent?.iliskiler) && currentContent.iliskiler.length > 0 && (
            <div className="symbol-relations">
              <h4 className="relations-title">Sembol İlişkileri</h4>
              {currentContent.iliskiler.map((r, i) => (
                <div key={i} className="relation-item">
                  <span className="relation-symbols">{Array.isArray(r?.semboller) ? r.semboller.join(' + ') : ''}</span>
                  <span className="relation-meaning">{r?.anlam || ''}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return <p className="result-text">{typeof currentContent === 'string' ? currentContent : 'Yorum formatı hatalı.'}</p>;
  };

  return (
    <div className="fortune-step results-step">
      {currentFortune?.imageData?.dataUrl && (
        <div className="result-image-strip">
          <img src={currentFortune.imageData.dataUrl} alt="Fincan" />
        </div>
      )}

      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="result-content">{renderTabContent()}</div>

      <div className="qa-section">
        <h4 className="qa-title">Soru Sor</h4>
        {qaMessages.map((msg, i) => (
          <div key={i} className={`qa-message ${msg.role}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {qaLoading && <p className="qa-loading">Cassiopeia düşünüyor...</p>}
        <form onSubmit={handleQuestion} className="qa-form">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Fala dair bir sorun var mı?"
            className="qa-input"
          />
          <button type="submit" className="qa-send" disabled={!question.trim() || qaLoading}>
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>

      <button className="synthesis-cta" onClick={() => dispatch({ type: 'GO_TO_BRIDGE' })}>
        <span className="material-symbols-outlined">auto_awesome</span>
        <div>
          <strong>Sentez: Büyük Resmi Gör</strong>
          <p>3 Tarot kartı çekerek falını derinleştir</p>
        </div>
        <span className="material-symbols-outlined">arrow_forward</span>
      </button>
    </div>
  );
}

export default ResultsPage;

### src/pages/CoffeeFortune/TarotBridge.jsx
import { useState } from 'react';
import { useAppDispatch } from '../../context/AppContext';
import { TAROT_DECK } from '../../utils/constants';

function TarotBridge() {
  const dispatch = useAppDispatch();
  const [selectedCards, setSelectedCards] = useState([]);
  const [revealedIndices, setRevealedIndices] = useState([]);
  const [shuffled] = useState(() => {
    const deck = Array.isArray(TAROT_DECK) ? [...TAROT_DECK] : [];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  });

  const labels = ['Gecmis', 'Su An', 'Gelecek'];

  const handleCardClick = (cardIndex) => {
    if (selectedCards.length >= 3 || revealedIndices.includes(cardIndex)) return;
    setRevealedIndices((prev) => [...prev, cardIndex]);
    const card = shuffled?.[cardIndex];
    if (!card) return;
    
    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);
    
    if (newSelected.length === 3) {
      setTimeout(() => {
        dispatch({ type: 'SET_TAROT_CARDS', payload: newSelected });
      }, 1500);
    }
  };

  return (
    <div className="fortune-step bridge-step">
      <div className="bridge-header">
        <span className="material-symbols-outlined">auto_awesome</span>
        <h2 className="step-title">Kartlarını Cek</h2>
        <p className="step-subtitle">Fincanındaki enerjileri netlestirmek için 3 kart sec</p>
      </div>

      <div className="selected-cards-display">
        {labels.map((label, i) => (
          <div key={label} className={`selected-card-slot ${selectedCards?.[i] ? 'filled' : ''}`}>
            <span className="slot-label">{label}</span>
            {selectedCards?.[i] ? (
              <div className="slot-card revealed">
                {selectedCards[i]?.img ? (
                  <img src={selectedCards[i].img} alt={selectedCards[i]?.nameTr || 'Kart'} />
                ) : (
                  <span className="material-symbols-outlined">style</span>
                )}
                <span className="slot-card-name">{selectedCards[i]?.nameTr || 'Seçildi'}</span>
              </div>
            ) : (
              <div className="slot-card empty">
                <span className="material-symbols-outlined">help</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedCards.length < 3 && (
        <div className="tarot-spread-container">
          <p className="bridge-instruction">
            {3 - selectedCards.length} kart daha sec ({labels[selectedCards.length]})
          </p>
          <div className="tarot-spread">
            {Array.isArray(shuffled) && shuffled.slice(0, 12).map((card, i) => (
              <button
                key={card?.id || i}
                className={`tarot-card-back ${revealedIndices.includes(i) ? 'flipped' : ''}`}
                onClick={() => handleCardClick(i)}
                disabled={revealedIndices.includes(i)}
              >
                <div className="card-back-face">
                  <div className="card-back-pattern"><span>✦</span></div>
                </div>
                <div className="card-front-face">
                  {card?.img ? (
                    <img src={card.img} alt={card?.nameTr || 'Kart'} />
                  ) : (
                    <span className="material-symbols-outlined">style</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TarotBridge;

### src/pages/CoffeeFortune/AnalyzingStep.jsx
import { useEffect } from 'react';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { callGemini } from '../../services/gemini';
import { buildCoffeeGeneralPrompt } from '../../utils/prompts';
import LoadingOracle from '../../components/LoadingOracle';

function AnalyzingStep() {
  const { currentFortune, apiKey, user } = useAppState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentFortune.imageData && apiKey) {
      runAnalysis();
    }
  }, []);

  async function runAnalysis() {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const zodiacName = user?.zodiac || 'bilinmiyor';
      const ageRange = user?.ageRange || 'bilinmiyor';
      const relationship = user?.relationshipStatus || 'bilinmiyor';

      const prompt = buildCoffeeGeneralPrompt(
        currentFortune.intent,
        zodiacName,
        ageRange,
        relationship
      );

      const generalResult = await callGemini(apiKey, prompt, {
        imageBase64: currentFortune.imageData.base64,
        imageMimeType: currentFortune.imageData.mimeType,
      });

      dispatch({
        type: 'SET_COFFEE_RESULT',
        payload: {
          general: generalResult,
          past: null,
          future: null,
          love: null,
          career: null,
          symbols: null,
        },
      });
    } catch (err) {
      console.error('Analiz hatası:', err);
      const isQuota = err.message?.includes('KOTA_LIMITI');
      dispatch({
        type: 'SET_ERROR',
        payload: isQuota 
          ? 'Gemini şu an çok yoğun. 15 saniye bekleyip tekrar dene abi.'
          : (err.message || 'Analiz sırasında bir hata oluştu'),
      });
    }
  }

  return (
    <div className="fortune-step analyzing-step">
      <div className="analyzing-image-container">
        {currentFortune.imageData && (
          <>
            <img
              src={currentFortune.imageData.dataUrl}
              alt="Fincan"
              className="analyzing-image"
            />
            <div className="scan-line"></div>
            <div className="scan-grid"></div>
          </>
        )}
      </div>
      <LoadingOracle message="Cassiopeia fincanına bakıyor..." />
    </div>
  );
}

export default AnalyzingStep;

### src/pages/CoffeeFortune/IntentStep.jsx
import { useState } from 'react';
import { useAppDispatch } from '../../context/AppContext';

export default function IntentStep() {
  const dispatch = useAppDispatch();
  const [intent, setIntent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (intent.trim()) {
      dispatch({ type: 'SET_INTENT', payload: intent.trim() });
    }
  };

  return (
    <div className="fortune-step intent-step">
      <div className="step-icon">
        <span className="material-symbols-outlined">edit_note</span>
      </div>
      <h2 className="step-title">Niyetini Yaz</h2>
      <p className="step-subtitle">
        Aklındaki soruyu veya merak ettiğin konuyu yaz. Cassiopeia niyetine göre fincanını okuyacak.
      </p>
      <form onSubmit={handleSubmit} className="intent-form">
        <textarea
          className="intent-input"
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          placeholder="Örn: Aşk hayatım nasıl olacak? / İş değişikliği yapmalı mıyım? / Genel olarak hayatıma bak..."
          rows={4}
          maxLength={500}
          autoFocus
        />
        <span className="intent-counter">{intent.length}/500</span>
        <button type="submit" className="step-button" disabled={!intent.trim()}>
          Devam
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </form>
    </div>
  );
}

### src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { ZODIAC_SIGNS, TAROT_DECK } from '../utils/constants';
import { callGemini } from '../services/gemini';
import { buildDailyHoroscopePrompt, buildDailyCardPrompt } from '../utils/prompts';

export default function HomePage() {
  const { user, apiKey } = useAppState();
  const navigate = useNavigate();
  const [dailyCard, setDailyCard] = useState(null);
  const [dailyCardReading, setDailyCardReading] = useState('');
  const [horoscope, setHoroscope] = useState('');
  const [dailyEnergy, setDailyEnergy] = useState(null);
  const [loading, setLoading] = useState(true);

  const userZodiac = user ? ZODIAC_SIGNS.find(z => z.id === user.zodiac) : null;

  useEffect(() => {
    // Generate daily card (deterministic per day)
    const today = new Date().toDateString();
    const seed = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const cardIndex = seed % TAROT_DECK.length;
    const card = TAROT_DECK[cardIndex];
    setDailyCard(card);

    // Generate daily energy
    const colors = ['Mor', 'Mavi', 'Yeşil', 'Altın', 'Gümüş', 'Turkuaz', 'Pembe', 'Turuncu'];
    const energyColor = colors[seed % colors.length];
    const luckyNumber = ((seed * 7) % 99) + 1;
    setDailyEnergy({ color: energyColor, number: luckyNumber });

    // Fetch AI content with caching
    if (apiKey && userZodiac) {
      const cachedCard = localStorage.getItem(`daily_card_reading_${today}_${user?.zodiac}`);
      const cachedHoroscope = localStorage.getItem(`daily_horoscope_${today}_${user?.zodiac}`);

      if (cachedCard && cachedHoroscope) {
        setDailyCardReading(cachedCard);
        setHoroscope(cachedHoroscope);
        setLoading(false);
      } else {
        loadDailyContent(card, userZodiac, today);
      }
    } else {
      setLoading(false);
    }
  }, [apiKey, user]);

  async function loadDailyContent(card, zodiac, todayString) {
    if (!apiKey || !zodiac || !card) return;
    setLoading(true);
    try {
      // First get the card reading
      const cardReading = await callGemini(apiKey, buildDailyCardPrompt(card?.nameTr || '', card?.meaning || ''));
      setDailyCardReading(cardReading);
      localStorage.setItem(`daily_card_reading_${todayString}_${zodiac?.id}`, cardReading);
      
      // Then get the horoscope (sequential to respect rate limits)
      const horoscopeReading = await callGemini(apiKey, buildDailyHoroscopePrompt(zodiac?.name || ''));
      setHoroscope(horoscopeReading);
      localStorage.setItem(`daily_horoscope_${todayString}_${zodiac?.id}`, horoscopeReading);
    } catch (err) {
      console.error('AI içerik yüklenirken hata oluştu:', err);
      if (!dailyCardReading) setDailyCardReading('Yorum şu an hazır değil.');
      if (!horoscope) setHoroscope('Yorum şu an hazır değil.');
    }
    setLoading(false);
  }

  // Safety Guard: If user profile is not ready, show clean loading
  if (!user || !userZodiac) {
    return (
      <div className="page home-page">
        <div style={{ padding: '3rem', textAlign: 'center', opacity: 0.7 }}>
          <p>Cassiopeia yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page home-page">
      {/* Header */}
      <div className="home-header">
        <div className="home-greeting">
          <span className="greeting-emoji">{userZodiac?.emoji || '✨'}</span>
          <div>
            <p className="greeting-text">Merhaba</p>
            <h1 className="greeting-zodiac">{userZodiac?.name || 'Gezgin'}</h1>
          </div>
        </div>
        <div className="home-date">
          {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}
        </div>
      </div>

      {/* Quick Action */}
      <button className="quick-action-btn" onClick={() => navigate('/fallar/kahve')}>
        <span className="material-symbols-outlined">coffee</span>
        <span>Fal Baktır</span>
        <span className="material-symbols-outlined arrow">arrow_forward</span>
      </button>

      {/* Daily Card */}
      <div className="home-card daily-card-section">
        <div className="card-header">
          <span className="material-symbols-outlined">style</span>
          <h3>Günün Kartı</h3>
        </div>
        {dailyCard ? (
          <div className="daily-card-content">
            <div className="daily-card-image">
              <img src={dailyCard?.img} alt={dailyCard?.nameTr} />
            </div>
            <div className="daily-card-info">
              <h4 className="daily-card-name">{dailyCard?.nameTr}</h4>
              <p className="daily-card-meaning">{dailyCard?.meaning}</p>
              {loading ? (
                <p className="daily-card-reading shimmer">Yükleniyor...</p>
              ) : (
                <p className="daily-card-reading">{dailyCardReading || 'Yorum hazır değil.'}</p>
              )}
            </div>
          </div>
        ) : (
          <p className="shimmer">Kart seçiliyor...</p>
        )}
      </div>

      {/* Daily Horoscope */}
      <div className="home-card horoscope-section">
        <div className="card-header">
          <span className="zodiac-mini-emoji">{userZodiac?.emoji}</span>
          <h3>Günlük Burç Yorumun</h3>
        </div>
        {loading ? (
          <p className="horoscope-text shimmer">Yükleniyor...</p>
        ) : (
          <p className="horoscope-text">{horoscope || 'Yorum hazır değil.'}</p>
        )}
      </div>

      {/* Daily Energy */}
      {dailyEnergy && (
        <div className="home-card energy-section">
          <div className="card-header">
            <span className="material-symbols-outlined">bolt</span>
            <h3>Günün Enerjisi</h3>
          </div>
          <div className="energy-row">
            <div className="energy-item">
              <span className="energy-label">Renk</span>
              <span className="energy-value">{dailyEnergy?.color}</span>
            </div>
            <div className="energy-divider"></div>
            <div className="energy-item">
              <span className="energy-label">Şanslı Sayı</span>
              <span className="energy-value">{dailyEnergy?.number}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

### src/pages/DiscoverPage.jsx
export default function DiscoverPage() {
  const categories = [
    { title: 'Semboller Ansiklopedisi', icon: 'menu_book', desc: 'Fincandaki sembollerin anlamlarını öğren' },
    { title: 'Tarot Rehberi', icon: 'style', desc: '78 tarot kartının detaylı anlamları' },
    { title: 'Burçlar', icon: 'stars', desc: '12 burç hakkında her şey' },
    { title: 'Fal Okuma Rehberi', icon: 'school', desc: 'Fal nasıl bakılır? Adım adım' },
  ];

  return (
    <div className="page discover-page">
      <div className="page-header">
        <h1 className="page-title">Keşfet</h1>
        <p className="page-subtitle">Öğren ve derinleş</p>
      </div>

      <div className="discover-grid">
        {categories.map((cat) => (
          <div key={cat.title} className="discover-card locked">
            <span className="material-symbols-outlined discover-icon">{cat.icon}</span>
            <h3 className="discover-title">{cat.title}</h3>
            <p className="discover-desc">{cat.desc}</p>
            <span className="discover-badge">Yakında</span>
          </div>
        ))}
      </div>
    </div>
  );
}

### src/pages/CoffeeFortunePage.jsx
import { useNavigate } from 'react-router-dom';
import { useAppState, useAppDispatch } from '../context/AppContext';
import IntentStep from './CoffeeFortune/IntentStep';
import UploadStep from './CoffeeFortune/UploadStep';
import AnalyzingStep from './CoffeeFortune/AnalyzingStep';
import ResultsPage from './CoffeeFortune/ResultsPage';
import TarotBridge from './CoffeeFortune/TarotBridge';
import SynthesisResult from './CoffeeFortune/SynthesisResult';

export default function CoffeeFortunePage() {
  const { currentFortune, error } = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isApiKeyError = error && (error.toLowerCase().includes('api key') || error.toLowerCase().includes('api_key'));

  const getErrorMessage = (err) => {
    if (!err) return '';
    if (err.toLowerCase().includes('api key')) return 'API anahtarın geçersiz. Profil sayfasından yeni bir anahtar gir.';
    if (err.toLowerCase().includes('timeout') || err.toLowerCase().includes('network')) return 'Bağlantı hatası. İnternet bağlantını kontrol edip tekrar dene.';
    return err;
  };

  if (error) {
    return (
      <div className="page coffee-page">
        <div className="error-container">
          <span className="material-symbols-outlined error-icon">error</span>
          <h3>Bir sorun oluştu</h3>
          <p>{getErrorMessage(error)}</p>
          {isApiKeyError ? (
            <button className="step-button" onClick={() => { dispatch({ type: 'CLEAR_ERROR' }); dispatch({ type: 'RESET_FORTUNE' }); navigate('/profil'); }}>
              API Anahtarını Düzenle
            </button>
          ) : (
            <button className="step-button" onClick={() => { dispatch({ type: 'CLEAR_ERROR' }); dispatch({ type: 'RESET_FORTUNE' }); }}>
              Tekrar Dene
            </button>
          )}
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentFortune.step) {
      case 'intent': return <IntentStep />;
      case 'upload': return <UploadStep />;
      case 'analyzing': return <AnalyzingStep />;
      case 'results': return <ResultsPage />;
      case 'bridge': return <TarotBridge />;
      case 'synthesis': return <SynthesisResult />;
      default: return <IntentStep />;
    }
  };

  // Step progress indicator
  const steps = ['intent', 'upload', 'analyzing', 'results', 'bridge', 'synthesis'];
  const currentIndex = steps.indexOf(currentFortune.step);

  return (
    <div className="page coffee-page">
      {/* Progress bar */}
      <div className="fortune-progress">
        <div
          className="fortune-progress-fill"
          style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
        />
      </div>

      {renderStep()}
    </div>
  );
}

### src/pages/HistoryPage.jsx
import { useAppState } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function HistoryPage() {
  const { history } = useAppState();
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Tarih belirsiz';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('tr-TR', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return 'Tarih hatalı';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'coffee': return '☕ Kahve Falı';
      case 'tarot': return '🃏 Tarot';
      default: return '🔮 Fal';
    }
  };

  return (
    <div className="page history-page">
      <div className="page-header">
        <h1 className="page-title">Geçmiş</h1>
        <p className="page-subtitle">Önceki falların</p>
      </div>

      {!Array.isArray(history) || history.length === 0 ? (
        <div className="empty-state">
          <span className="material-symbols-outlined empty-icon">history</span>
          <h3>Henüz fal baktırmadın</h3>
          <p>İlk falını baktırdığında burada görünecek</p>
          <button className="step-button" onClick={() => navigate('/fallar')}>
            Fal Baktır
          </button>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item, i) => (
            <div key={item?.id || i} className="history-item">
              <div className="history-item-image">
                {item?.imageDataUrl ? (
                  <img src={item.imageDataUrl} alt="Fincan" />
                ) : (
                  <div className="history-placeholder">
                    <span className="material-symbols-outlined">coffee</span>
                  </div>
                )}
              </div>
              <div className="history-item-info">
                <span className="history-type">{getTypeLabel(item?.type)}</span>
                <p className="history-intent">{item?.intent || 'Genel Niyet'}</p>
                <span className="history-date">{formatDate(item?.date)}</span>
              </div>
              {item?.tarotCards?.length > 0 && (
                <div className="history-tarot-badge">
                  <span className="material-symbols-outlined">auto_awesome</span>
                  Sentez
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

### src/pages/FortunesPage.jsx
import { useNavigate } from 'react-router-dom';
import { FORTUNE_TYPES } from '../utils/constants';

export default function FortunesPage() {
  const navigate = useNavigate();

  const handleClick = (type) => {
    if (!type.available) return;
    if (type.id === 'coffee') navigate('/fallar/kahve');
  };

  return (
    <div className="page fortunes-page">
      <div className="page-header">
        <h1 className="page-title">Fallar</h1>
        <p className="page-subtitle">Ne öğrenmek istiyorsun?</p>
      </div>

      <div className="fortune-grid">
        {FORTUNE_TYPES.map((type) => (
          <button
            key={type.id}
            className={`fortune-type-card ${!type.available ? 'locked' : ''}`}
            onClick={() => handleClick(type)}
          >
            <div className="fortune-type-emoji">{type.emoji}</div>
            <div className="fortune-type-info">
              <h3 className="fortune-type-name">{type.name}</h3>
              <p className="fortune-type-desc">{type.description}</p>
            </div>
            {!type.available && (
              <div className="fortune-type-badge">Yakında</div>
            )}
            {type.available && (
              <span className="material-symbols-outlined fortune-arrow">chevron_right</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

### src/pages/ProfilePage.jsx
import { useState } from 'react';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { ZODIAC_SIGNS, AGE_RANGES, RELATIONSHIP_STATUSES } from '../utils/constants';

export default function ProfilePage() {
  const { user, apiKey, history } = useAppState();
  const dispatch = useAppDispatch();
  const [showApiInput, setShowApiInput] = useState(false);
  const [newKey, setNewKey] = useState(apiKey || '');

  const userZodiac = user ? ZODIAC_SIGNS.find(z => z.id === user.zodiac) : null;
  const userAge = user ? AGE_RANGES.find(a => a.id === user.ageRange) : null;
  const userRel = user ? RELATIONSHIP_STATUSES.find(r => r.id === user.relationshipStatus) : null;

  const handleSaveKey = () => {
    if (newKey.trim()) {
      dispatch({ type: 'SET_API_KEY', payload: newKey.trim() });
      setShowApiInput(false);
    }
  };

  return (
    <div className="page profile-page">
      <div className="page-header">
        <h1 className="page-title">Profil</h1>
      </div>

      {/* User Info */}
      <div className="profile-card">
        <div className="profile-avatar">
          <span className="profile-emoji">{userZodiac?.emoji || '✨'}</span>
        </div>
        <div className="profile-info">
          <h2 className="profile-zodiac">{userZodiac?.name || 'Bilinmiyor'}</h2>
          <div className="profile-details">
            <span className="profile-detail">{userAge?.label || '-'} yaş</span>
            <span className="profile-divider">•</span>
            <span className="profile-detail">{userRel?.label || '-'}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-number">{history.length}</span>
          <span className="stat-label">Fal</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {history.filter(h => h.tarotCards?.length > 0).length}
          </span>
          <span className="stat-label">Sentez</span>
        </div>
      </div>

      {/* Settings */}
      <div className="profile-section">
        <h3 className="section-title">Ayarlar</h3>

        <button className="settings-item" onClick={() => setShowApiInput(!showApiInput)}>
          <span className="material-symbols-outlined">key</span>
          <span>API Anahtarı</span>
          <span className="material-symbols-outlined">{showApiInput ? 'expand_less' : 'expand_more'}</span>
        </button>

        {showApiInput && (
          <div className="api-key-edit">
            <input
              type="password"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Gemini API anahtarı"
              className="settings-input"
            />
            <button className="settings-save" onClick={handleSaveKey}>Kaydet</button>
          </div>
        )}

        <button className="settings-item" onClick={() => dispatch({ type: 'SHOW_ONBOARDING', payload: true })}>
          <span className="material-symbols-outlined">tune</span>
          <span>Profili Düzenle</span>
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      <div className="profile-footer">
        <p>Cassiopeia v1.0</p>
        <p>Powered by Gemini AI</p>
      </div>
    </div>
  );
}

### src/services/gemini.js
export async function callGemini(apiKey, prompt, options = {}) {
  const { imageBase64 = null, imageMimeType = null, jsonMode = false } = options;

  if (apiKey.toUpperCase() === 'OLLAMA') {
    const OLLAMA_URL = 'http://localhost:11434/api/generate';
    const modelName = imageBase64 ? 'qwen3-vl:8b' : 'gemma3:12b';
    try {
      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelName,
          prompt: prompt,
          stream: false,
          images: imageBase64 ? [imageBase64] : undefined
        }),
      });
      const data = await response.json();
      let text = data.response;
      if (jsonMode) {
        let cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
      }
      return text;
    } catch (err) {
      throw new Error('Ollama Bağlantı Hatası: Terminalden CORS ayarını kontrol et.');
    }
  }

  const GEMINI_MODEL = 'gemini-2.5-flash';
  const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
  const url = `${API_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const parts = [{ text: prompt }];
  if (imageBase64 && imageMimeType) {
    parts.push({ inline_data: { mime_type: imageMimeType, data: imageBase64 } });
  }
  const requestBody = { contents: [{ role: 'user', parts }] };
  if (jsonMode) requestBody.generationConfig = { responseMimeType: 'application/json' };
  const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) });
  const d = await resp.json();
  let resultText = d.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (jsonMode) {
     let cleanText = resultText.replace(/```json/gi, '').replace(/```/g, '').trim();
     return JSON.parse(cleanText);
  }
  return resultText;
}

### src/services/storage.js
/**
 * localStorage CRUD operations for Cassiopeia
 */

const KEYS = {
  API_KEY: 'cassiopeia_api_key',
  USER_PROFILE: 'cassiopeia_user_profile',
  HISTORY: 'cassiopeia_history',
  ONBOARDING_DONE: 'cassiopeia_onboarding_done',
};

// API Key
export function getApiKey() {
  try { return localStorage.getItem(KEYS.API_KEY) || ''; } catch { return ''; }
}

export function setApiKey(key) {
  try { localStorage.setItem(KEYS.API_KEY, key); } catch {}
}

// User Profile
export function getUserProfile() {
  try {
    const data = localStorage.getItem(KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

export function setUserProfile(profile) {
  try { localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile)); } catch {}
}

// History
export function getHistory() {
  try {
    const data = localStorage.getItem(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function addToHistory(entry) {
  try {
    const history = getHistory();
    history.unshift({
      ...entry,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    });
    // Keep max 50 entries
    if (history.length > 50) history.pop();
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  } catch {}
}

export function getHistoryById(id) {
  return getHistory().find((h) => h.id === id) || null;
}

export function deleteHistoryItem(id) {
  try {
    const history = getHistory().filter((h) => h.id !== id);
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  } catch {}
}

// Onboarding
export function isOnboardingDone() {
  try { return localStorage.getItem(KEYS.ONBOARDING_DONE) === 'true'; } catch { return false; }
}

export function setOnboardingDone() {
  try { localStorage.setItem(KEYS.ONBOARDING_DONE, 'true'); } catch {}
}

