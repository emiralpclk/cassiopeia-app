import localforage from 'localforage';

/**
 * Storage CRUD operations for Cassiopeia
 * History and CurrentFortune moved to IndexedDB via localforage
 */

const KEYS = {
  API_KEY: 'cassiopeia_api_key',
  USER_PROFILE: 'cassiopeia_user_profile',
  HISTORY: 'cassiopeia_history',
  ONBOARDING_DONE: 'cassiopeia_onboarding_done',
  CURRENT_FORTUNE: 'cassiopeia_current_fortune',
  TEST_MODE: 'cassiopeia_test_mode',
};

// Configure localforage
localforage.config({
  name: 'Cassiopeia',
  storeName: 'cassiopeia_store',
  description: 'Storage for Cassiopeia fortunes and history'
});

// Auto-run migration
export async function migrateStorage() {
  try {
    const oldHistory = localStorage.getItem(KEYS.HISTORY);
    if (oldHistory) {
      await localforage.setItem(KEYS.HISTORY, JSON.parse(oldHistory));
      localStorage.removeItem(KEYS.HISTORY);
      console.log('History migrated to IndexedDB');
    }

    const oldFortune = localStorage.getItem(KEYS.CURRENT_FORTUNE);
    if (oldFortune) {
      await localforage.setItem(KEYS.CURRENT_FORTUNE, JSON.parse(oldFortune));
      localStorage.removeItem(KEYS.CURRENT_FORTUNE);
      console.log('Current Fortune migrated to IndexedDB');
    }
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

// Synced storage for small items
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

// Onboarding
export function isOnboardingDone() {
  try { return localStorage.getItem(KEYS.ONBOARDING_DONE) === 'true'; } catch { return false; }
}

export function setOnboardingDone() {
  try { localStorage.setItem(KEYS.ONBOARDING_DONE, 'true'); } catch {}
}

// Test Mode (Mock API) - Disabled for production
export function getTestMode() {
  return false; // Force false for production
}

export function setTestMode(val) {
  // No-op for production to prevent accidental toggling
}

// Async Storage for History and Current Fortune 
export async function getHistory() {
  try {
    const data = await localforage.getItem(KEYS.HISTORY);
    return data || [];
  } catch {
    return [];
  }
}

export async function addToHistory(entry) {
  try {
    const history = await getHistory();
    history.unshift({
      ...entry,
      id: entry.id || Date.now().toString(),
      date: entry.date || new Date().toISOString(),
    });
    // Strict limit: Only keep the last 5 entries as requested
    if (history.length > 5) {
      history.length = 5;
    }
    await localforage.setItem(KEYS.HISTORY, history);
  } catch (e) {
    console.error('addToHistory error:', e);
  }
}

export async function getHistoryById(id) {
  try {
    const history = await getHistory();
    return history.find((h) => h.id === id) || null;
  } catch { return null; }
}

export async function deleteHistoryItem(id) {
  try {
    const history = await getHistory();
    const newHistory = history.filter((h) => h.id !== id);
    await localforage.setItem(KEYS.HISTORY, newHistory);
  } catch {}
}

export async function clearHistory() {
  try {
    await localforage.removeItem(KEYS.HISTORY);
  } catch {}
}

// Current Fortune (Session Persistence)
export async function saveCurrentFortune(fortune) {
  try {
    await localforage.setItem(KEYS.CURRENT_FORTUNE, fortune);
  } catch {}
}

export async function getCurrentFortune() {
  try {
    const data = await localforage.getItem(KEYS.CURRENT_FORTUNE);
    return data || null;
  } catch { return null; }
}

export async function clearCurrentFortune() {
  try {
    await localforage.removeItem(KEYS.CURRENT_FORTUNE);
  } catch {}
}