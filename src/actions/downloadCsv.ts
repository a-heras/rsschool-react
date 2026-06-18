'use server';

import { headers } from 'next/headers';
import type { Item } from '@/types/item';
import { buildSelectedItemsCsv } from '@/lib/csv/buildSelectedItemsCsv';

export type CsvDownloadState = {
    csv: string;
    filename: string;
} | null;

function parseItems(value: FormDataEntryValue | null): Item[] {
    if (typeof value !== 'string' || value.length === 0) {
        return [];
    }

    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed)) {
        return [];
    }

    return parsed.filter(
        (entry): entry is Item =>
            typeof entry === 'object' &&
            entry !== null &&
            typeof (entry as Item).id === 'number' &&
            typeof (entry as Item).name === 'string' &&
            typeof (entry as Item).description === 'string'
    );
}

async function resolveOrigin(): Promise<string> {
    const headersList = await headers();
    const host = headersList.get('host') ?? 'localhost:3000';
    const protocol = headersList.get('x-forwarded-proto') ?? 'http';

    return `${protocol}://${host}`;
}

export async function downloadSelectedItemsCsvAction(
    _prevState: CsvDownloadState,
    formData: FormData
): Promise<CsvDownloadState> {
    const items = parseItems(formData.get('items'));
    const locale = String(formData.get('locale') ?? 'en');

    if (items.length === 0) {
        return null;
    }

    const origin = await resolveOrigin();
    const csv = buildSelectedItemsCsv(items, origin, locale);

    return {
        csv,
        filename: `${items.length}_items.csv`,
    };
}
