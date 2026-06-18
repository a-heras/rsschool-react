import { describe, it, expect, afterEach, vi } from 'vitest';

describe('cache config', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('uses NEXT_PUBLIC_CACHE_TTL_MS from environment', async () => {
        vi.stubEnv('NEXT_PUBLIC_CACHE_TTL_MS', '120000');
        vi.resetModules();

        const { CACHE_TTL_MS, CACHE_TTL_SECONDS } =
            await import('./cache');

        expect(CACHE_TTL_MS).toBe(120_000);
        expect(CACHE_TTL_SECONDS).toBe(120);
    });

    it('falls back to default when env is missing', async () => {
        vi.stubEnv('NEXT_PUBLIC_CACHE_TTL_MS', '');
        vi.resetModules();

        const { CACHE_TTL_MS } = await import('./cache');

        expect(CACHE_TTL_MS).toBe(60_000);
    });
});
