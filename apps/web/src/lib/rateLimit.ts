interface Entry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private store = new Map<string, Entry>();

  check(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetAt) {
      this.store.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }

    if (entry.count >= limit) return false;
    entry.count++;
    return true;
  }
}

// Module-level singleton (shared across requests in the same process)
export const rateLimiter = new RateLimiter();
