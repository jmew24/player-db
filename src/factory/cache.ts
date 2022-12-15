import type { CachedPlayers, CachedTeams } from "cache";

// Create a class for the cache
class Cache<CacheValue> {
  // Create a private map to store the cache values
  private cache = new Map<string, CacheValue>();

  // Create a method to get a value from the cache
  get(key: string) {
    return this.cache.get(key) || [];
  }

  // Create a method to set a value in the cache and return the array
  set(key: string, value: CacheValue) {
    this.cache.set(key, value);
    return value;
  }

  // Create a method to clear a value from the cache
  remove(key: string) {
    this.cache.delete(key);
  }
}

// Create a new cache instance
const playerCache = new Cache<CachedPlayers>();
const teamCache = new Cache<CachedTeams>();

// Export the cache instance
export { playerCache, teamCache };

export default playerCache;
