const DEFAULT_TTL = 1000 * 60 * 60 * 24; // 24 hours

// In-memory registry for in-flight requests deduplication
const inFlightRequests = new Map();

export const getCache = (group, key) => {
  try {
    const fullKey = `pokedex_${group}_${key}`;
    const itemStr = localStorage.getItem(fullKey);
    if (!itemStr) return null;
    
    const item = JSON.parse(itemStr);
    const now = Date.now();
    
    if (now > item.expiry) {
      localStorage.removeItem(fullKey);
      return null;
    }
    return item.value;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
};

export const setCache = (group, key, value, ttl = DEFAULT_TTL) => {
  try {
    const fullKey = `pokedex_${group}_${key}`;
    const now = Date.now();
    
    const item = {
      value: value,
      expiry: now + ttl
    };
    
    localStorage.setItem(fullKey, JSON.stringify(item));
  } catch (error) {
    // Handling QuotaExceededError
    if (error.name === 'QuotaExceededError') {
      console.warn('Local storage quota exceeded. Clearing old cache...');
      clearOldestCache();
      try {
        localStorage.setItem(`pokedex_${group}_${key}`, JSON.stringify({ value, expiry: Date.now() + ttl }));
      } catch (e) {
        console.error('Failed to save to cache even after clearing:', e);
      }
    }
  }
};

const clearOldestCache = () => {
  const items = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('pokedex_')) {
      try {
        const item = JSON.parse(localStorage.getItem(key));
        items.push({ key, expiry: item.expiry });
      } catch (e) {}
    }
  }
  
  // Sort by expiry (oldest first)
  items.sort((a, b) => a.expiry - b.expiry);
  
  // Remove 20% of the oldest cache
  const toRemove = Math.max(1, Math.floor(items.length * 0.2));
  for (let i = 0; i < toRemove; i++) {
    localStorage.removeItem(items[i].key);
  }
};

/**
 * Fetch wrapper that handles deduplication of concurrent identical requests
 * and uses the TTL cache.
 */
export const fetchWithCache = async (url, group, key, ttl = DEFAULT_TTL) => {
  const cached = getCache(group, key);
  if (cached) return cached;

  const inflightKey = `${group}_${key}`;
  if (inFlightRequests.has(inflightKey)) {
    return inFlightRequests.get(inflightKey);
  }

  const fetchPromise = fetch(url).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }
    const data = await response.json();
    setCache(group, key, data, ttl);
    return data;
  }).finally(() => {
    inFlightRequests.delete(inflightKey);
  });

  inFlightRequests.set(inflightKey, fetchPromise);
  return fetchPromise;
};
