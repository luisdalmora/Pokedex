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
    
    // Update lastAccessed for LRU
    item.lastAccessed = now;
    localStorage.setItem(fullKey, JSON.stringify(item));
    
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
      expiry: now + ttl,
      lastAccessed: now
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
    if (key && key.startsWith('pokedex_')) {
      try {
        const item = JSON.parse(localStorage.getItem(key));
        // Use lastAccessed if available, fallback to expiry
        items.push({ key, priority: item.lastAccessed || item.expiry || 0 });
      } catch (e) {}
    }
  }
  
  if (items.length === 0) return;

  // Sort by priority (least recently accessed first)
  items.sort((a, b) => a.priority - b.priority);
  
  // Remove 50% of the cache to ensure we actually make space
  const toRemove = Math.max(1, Math.floor(items.length * 0.5));
  for (let i = 0; i < toRemove; i++) {
    if (items[i]) {
      localStorage.removeItem(items[i].key);
    }
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
