const DEFAULT_CACHE_TTL_MS = 60_000;

export const CACHE_TTL_MS =
    Number(import.meta.env.VITE_CACHE_TTL_MS) || DEFAULT_CACHE_TTL_MS;

export const CACHE_TTL_SECONDS = CACHE_TTL_MS / 1000;