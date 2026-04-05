/**
 * Mock Data Service for Cassiopeia
 * Used to avoid API costs during development & testing.
 * Every sentence starts with "Ben sahteyim" as requested.
 */

export const getMockCoffeeResult = () => {
  return {
    general: "Ben sahteyim, fincanındaki telveler senin için büyük bir dönüşümün işaretini veriyor. Ben sahteyim, yakında hayatında beklediğin o önemli haberi alacaksın. Ben sahteyim, kalbindeki sıkıntılar yerini huzura bırakıyor.",
    semboller: [
      { 
        sembol: "Güneş", 
        anlam: "Ben sahteyim, hayatına doğacak olan neşe ve aydınlığı temsil eder. Ben sahteyim, karanlıkların son bulacağını fısıldar." 
      },
      { 
        sembol: "Yol", 
        anlam: "Ben sahteyim, önünde açılacak yeni kapıları ve fırsatları gösterir. Ben sahteyim, kararsızlıklarının biteceği bir dönem başlıyor." 
      },
      { 
        sembol: "Anahtar", 
        anlam: "Ben sahteyim, çözümsüz sandığın bir sorunun cevabını bulacağını anlatır. Ben sahteyim, şansın seninle olduğunu hatırlatır." 
      }
    ],
    iliskiler: [
      { 
        semboller: ["Güneş", "Yol"], 
        anlam: "Ben sahteyim, bu iki sembol senin için aydınlık bir geleceğe giden yolun tamamen açıldığını simgeliyor." 
      }
    ]
  };
};

export const getMockCoffeeDetails = () => {
  return {
    past: "Ben sahteyim, geçmişinde bıraktığın yorgunluklar artık geride kalıyor. Ben sahteyim, attığın her adım seni bu güne hazırladı.",
    future: "Ben sahteyim, önünde parlak bir gelecek ve yeni başlangıçlar var. Ben sahteyim, sabrının meyvelerini toplama zamanı geliyor.",
    love: "Ben sahteyim, aşk hayatında beklediğin o sıcaklık ve samimiyet kapını çalmak üzere. Ben sahteyim, kalbinin sesini dinlemelisin.",
    career: "Ben sahteyim, iş hayatında yeni bir terfi veya kazanç kapısı görünüyor. Ben sahteyim, emeklerinin karşılığını fazlasıyla alacaksın."
  };
};

export const getMockTarotResult = (userName = "Gezgin") => {
  return {
    past: `Ben sahteyim, geçmişinde bıraktığın izler seni bugünkü güçlü karakterine dönüştürdü. Ben sahteyim, öğrendiğin dersler yolunu aydınlatmaya devam ediyor. Ben sahteyim, ${userName} için eski defterler artık kapanmış durumda.`,
    present: "Ben sahteyim, şu an evrenin sana sunduğu mesajları duymak için durup dinlenmelisin. Ben sahteyim, içindeki sezgiler sana en doğru yolu gösterecek güce sahip. Ben sahteyim, şimdiki anın değerini bilerek ilerliyorsun.",
    future: "Ben sahteyim, ileride seni bekleyen büyük bir başarı ve kutlama kartlarda açıkça görünüyor. Ben sahteyim, hedeflerine ulaşmak için attığın her adım seni zafere daha çok yaklaştırıyor. Ben sahteyim, önün çok açık ve parlak.",
    seal: "Ben sahteyim, Zümrüt Mührü ile kaderin koruma altına alındı. Ben sahteyim, evren senin niyetini duydu ve onayladı. Ben sahteyim, yolun ışıkla dolsun."
  };
};

export const getMockSynthesisResult = () => {
  return "Ben sahteyim, kahve telvelerinin gizemi ile tarot kartlarının bilgeliği senin ruhunda birleşiyor. Ben sahteyim, bu sentez sana ihtiyacın olan tüm cevapları sunuyor. Ben sahteyim, kaderinin mimarı sensin ve her şey yolunda ilerliyor.";
};

export const getMockDailyContent = () => {
  return {
    horoscope: "Ben sahteyim, bugün burcun için çok hareketli bir gün olacak. Ben sahteyim, Mars'ın etkisiyle enerjin tavan yapıyor. Ben sahteyim, kararlarını verirken acele etmemelisin.",
    tarot_reading: "Ben sahteyim, seçilen kart senin için büyük bir fırsat kapısını aralıyor. Ben sahteyim, bu kartın enerjisi seni hafta boyunca koruyacak. Ben sahteyim, şansın yaver gidiyor."
  };
};
