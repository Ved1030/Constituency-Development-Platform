export const CACHE_TTL = 10 * 60 * 1000

interface CacheEntry<T> {
  data: T
  timestamp: number
}

class SocialCache {
  private store = new Map<string, CacheEntry<unknown>>()

  get<T>(key: string): T | null {
    const entry = this.store.get(key)
    if (!entry) return null
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      this.store.delete(key)
      return null
    }
    return entry.data as T
  }

  set<T>(key: string, data: T): void {
    this.store.set(key, { data, timestamp: Date.now() })
  }

  has(key: string): boolean {
    const entry = this.store.get(key)
    if (!entry) return false
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      this.store.delete(key)
      return false
    }
    return true
  }

  clear(): void {
    this.store.clear()
  }

  clearStale(): void {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now - entry.timestamp > CACHE_TTL) {
        this.store.delete(key)
      }
    }
  }
}

export const socialCache = new SocialCache()
