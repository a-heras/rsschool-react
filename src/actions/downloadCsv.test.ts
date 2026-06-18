import { describe, it, expect, vi, beforeEach } from 'vitest';
import { downloadSelectedItemsCsvAction } from './downloadCsv';

vi.mock('next/headers', () => ({
    headers: vi.fn(async () => ({
        get: (name: string) => {
            if (name === 'host') return 'localhost:3000';
            if (name === 'x-forwarded-proto') return 'http';
            return null;
        },
    })),
}));

describe('downloadSelectedItemsCsvAction', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns null when no items are provided', async () => {
        const formData = new FormData();
        formData.set('items', '[]');
        formData.set('locale', 'en');

        await expect(
            downloadSelectedItemsCsvAction(null, formData)
        ).resolves.toBeNull();
    });

    it('generates csv on the server from submitted items', async () => {
        const formData = new FormData();
        formData.set(
            'items',
            JSON.stringify([
                { id: 1, name: 'Alpha', description: 'Desc A' },
                { id: 2, name: 'Beta', description: 'Desc B' },
            ])
        );
        formData.set('locale', 'en');

        const result = await downloadSelectedItemsCsvAction(null, formData);

        expect(result).toEqual({
            csv: expect.stringContaining('id,name,description,details_url'),
            filename: '2_items.csv',
        });
        expect(result?.csv).toContain('1,Alpha,Desc A');
        expect(result?.csv).toContain(
            'http://localhost:3000/en?page=1&details=2'
        );
    });
});
