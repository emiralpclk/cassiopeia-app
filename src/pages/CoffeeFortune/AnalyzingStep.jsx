import { useEffect, useRef } from 'react';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { callGemini } from '../../services/gemini';
import { buildCoffeeGeneralPrompt, buildCoffeeSymbolsPrompt } from '../../utils/prompts';
import { getMockCoffeeResult } from '../../services/mockData';
import OracleLoading from '../../components/OracleLoading';

function AnalyzingStep() {
  const { currentFortune, apiKey, user, isTestMode } = useAppState();
  const dispatch = useAppDispatch();
  const hasRequested = useRef(false);

  useEffect(() => {
    // In test mode, we don't need apiKey
    if (currentFortune.images?.length > 0 && (apiKey || isTestMode) && !hasRequested.current) {
      hasRequested.current = true;
      runAnalysis();
    }
  }, [apiKey, isTestMode, currentFortune.images]);

  async function runAnalysis() {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      let generalResult, symbolsResult;
      const startTime = Date.now();

      if (isTestMode) {
        // Simüle edilmiş mistik bekleme (1.5 sn)
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mock = getMockCoffeeResult();
        generalResult = mock.general;
        symbolsResult = { semboller: mock.semboller };
      } else {
        const generalPrompt = buildCoffeeGeneralPrompt(
          currentFortune.intent,
          user?.zodiac || 'bilinmiyor',
          user?.ageRange || 'bilinmiyor',
          user?.relationshipStatus || 'bilinmiyor'
        );

        const symbolsPrompt = buildCoffeeSymbolsPrompt();

        // Parallel fetch for BOTH general and symbols
        [generalResult, symbolsResult] = await Promise.all([
          callGemini(apiKey, generalPrompt, { images: currentFortune.images }),
          callGemini(apiKey, symbolsPrompt, { images: currentFortune.images, jsonMode: true })
        ]);
        
        // Minimum 10 seconds of mystical waiting only for real API
        const elapsed = Date.now() - startTime;
        if (elapsed < 10000) {
          await new Promise(resolve => setTimeout(resolve, 10000 - elapsed));
        }
      }

      // Store symbols first in tabData
      dispatch({ type: 'SET_TAB_DATA', payload: { symbols: symbolsResult } });

      // Then store general result and move to results page
      dispatch({
        type: 'SET_COFFEE_RESULT',
        payload: { general: generalResult, past: null, future: null, love: null, career: null, symbols: null },
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
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }

  return (
    <div className="fortune-step analyzing-step">
      <OracleLoading />
    </div>
  );
}

export default AnalyzingStep;