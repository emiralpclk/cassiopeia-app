export async function callGemini(apiKey, prompt, options = {}) {
  const { images = [], jsonMode = false, signal } = options;

  if (apiKey.toUpperCase() === 'OLLAMA') {
    const OLLAMA_URL = 'http://localhost:11434/api/generate';
    const hasImages = images && images.length > 0;
    const modelName = hasImages ? 'qwen3-vl:8b' : 'gemma3:12b';
    try {
      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelName,
          prompt: prompt,
          stream: false,
          images: hasImages ? images.map(img => img.base64) : undefined
        }),
        signal
      });
      // ... rest of Ollama logic ...
      const data = await response.json();
      let text = data.response;
      if (jsonMode) {
        try {
          let cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
          return JSON.parse(cleanText);
        } catch (e) {
          console.error("JSON Format Hatası (Ollama):", text);
          return { semboller: [], iliskiler: [] };
        }
      }
      return text;
    } catch (err) {
      throw new Error('Ollama Bağlantı Hatası: Terminalden CORS ayarını kontrol et.');
    }
  }

  const GEMINI_MODEL = 'gemini-2.5-flash'; 
  const API_BASE = 'https://generativelanguage.googleapis.com/v1/models';
  const url = `${API_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const parts = [{ text: prompt }];

  if (images && images.length > 0) {
    images.forEach(img => {
      parts.push({ inline_data: { mime_type: img.mimeType, data: img.base64 } });
    });
  }

  const requestBody = { 
    contents: [{ role: 'user', parts }],
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }
    ]
  };

  // if (jsonMode) requestBody.generationConfig = { responseMimeType: 'application/json' };
  
  // 60 saniyelik dahili timeout yönetimi
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);
  
  const combinedSignal = signal || controller.signal;

  try {
    const resp = await fetch(url, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(requestBody),
      signal: combinedSignal
    });
    
    clearTimeout(timeoutId);

    const d = await resp.json();

    if (!resp.ok) {
      console.error("Gemini API Error Data:", d);
      const errorMsg = d.error?.message || 'API Hatası';
      if (errorMsg.toLowerCase().includes('api key')) throw new Error('API ANAHTARI_GECERSIZ');
      if (errorMsg.toLowerCase().includes('quota')) throw new Error('KOTA_LIMITI');
      throw new Error(errorMsg);
    }

    let resultText = d.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!resultText && d.error) throw new Error(d.error.message || 'Yanıt alınamadı');

    if (jsonMode) {
      try {
        let cleanText = resultText.replace(/```json/gi, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
      } catch (e) {
        console.error("JSON Format Hatası. Gemini düz metin döndü:", resultText);
        throw new Error('JSON_PARSING_ERROR');
      }
    }
    return resultText;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') throw new Error('Zaman aşımı: Kâhinden yanıt gelmedi.');
    throw err;
  }
}