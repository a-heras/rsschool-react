import type { Item } from '@/types/item';

function escapeCsvField(value: string): string {
    if (/[",\n\r]/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}

export function buildDetailsUrl(
    origin: string,
    locale: string,
    itemId: number
): string {
    const params = new URLSearchParams({ page: '1', details: String(itemId) });
    return `${origin}/${locale}?${params.toString()}`;
}

export function buildSelectedItemsCsv(
    items: Item[],
    origin: string,
    locale: string
): string {
    const header = ['id', 'name', 'description', 'details_url'];
    const rows = items.map((item) => [
        String(item.id),
        escapeCsvField(item.name),
        escapeCsvField(item.description),
        escapeCsvField(buildDetailsUrl(origin, locale, item.id)),
    ]);

    return [header.join(','), ...rows.map((row) => row.join(','))].join('\n');
}
