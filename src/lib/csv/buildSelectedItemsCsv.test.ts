import { describe, it, expect } from 'vitest';
import {
    buildDetailsUrl,
    buildSelectedItemsCsv,
} from './buildSelectedItemsCsv';
import type { Item } from '@/types/item';

describe('buildSelectedItemsCsv', () => {
    const items: Item[] = [
        { id: 1, name: 'Alpha', description: 'Desc A' },
        { id: 2, name: 'Beta, "quote"', description: 'Line\nbreak' },
    ];

    it('builds csv with header and item fields', () => {
        const csv = buildSelectedItemsCsv(
            items,
            'http://localhost:3000',
            'en'
        );

        expect(csv).toContain('id,name,description,details_url');
        expect(csv).toContain('1,Alpha,Desc A');
        expect(csv).toContain('page=1&details=1');
        expect(csv).toContain('page=1&details=2');
    });

    it('escapes special characters in csv fields', () => {
        const csv = buildSelectedItemsCsv(
            items,
            'http://localhost:3000',
            'en'
        );

        expect(csv).toContain('"Beta, ""quote"""');
        expect(csv).toContain('"Line\nbreak"');
    });

    it('includes locale in details url', () => {
        const url = buildDetailsUrl('http://localhost:3000', 'ru', 5);

        expect(url).toBe('http://localhost:3000/ru?page=1&details=5');
    });

    it('returns header only for empty items', () => {
        const csv = buildSelectedItemsCsv([], 'http://localhost:3000', 'en');

        expect(csv).toBe('id,name,description,details_url');
    });
});
